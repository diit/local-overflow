const sqlite3 = require("sqlite3").verbose();
import connect, { sql } from "@databases/sqlite";
import { ApolloServer, gql } from "apollo-server";
import datasetLoadQueueWorker from "./workers/datasetLoad";

// Queries
import packages from "./queries/packages";

const db = new sqlite3.Database("./db.sqlite");
const db2 = connect("./db.sqlite");
const datasetLoadQueue = require("fastq")(datasetLoadQueueWorker, 1);

// The GraphQL schema
const typeDefs = gql`
  type Query {
    datasetLoadStatus(updateId: ID!): DatasetLoadStatus!
    post(stack: String!, id: ID!): Post!
    packages(query: String!, local: Boolean): [Package!]!
  }
  type Mutation {
    loadDataset(stack: String!): DatasetLoadPayload!
  }
  type DatasetLoadStatus {
    id: ID!
    download: Status!
    storage: Status!
    index: Status!
  }
  type Status {
    percentage: Float!
    complete: Boolean!
  }
  type DatasetLoadPayload {
    updateId: ID!
  }
  type Post {
    id: ID!
    postId: ID!
    title: String
    body: String!
    score: Int!
    createdAt: String!
    postTypeId: ID!
    posts: [Post!]!
  }
  type Package {
    id: ID!
    name: String!
    size: String!
    updatedAt: String!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    datasetLoadStatus: async (root, { updateId }) => {
      const state = await new Promise((resolve, reject) => {
        db.get(
          `
          SELECT *
          FROM dataset_loads
          WHERE id = $id
        `,
          {
            $id: updateId,
          },
          function (err, row) {
            if (err) reject(err);
            resolve(row);
          }
        );
      });
      return {
        id: updateId,
        download: {
          percentage: state.download_percentage,
          complete: state.download_percentage === 1,
        },
        storage: {
          percentage: state.storage_percentage,
          complete: state.storage_percentage === 1,
        },
        index: {
          percentage: state.index_percentage,
          complete: state.index_percentage === 1,
        },
      };
    },
    post: async (root, { stack, id }) => {
      const [post] = await db2.query(
        sql`SELECT * FROM posts WHERE stack_id = (SELECT id FROM stacks WHERE name = ${stack}) AND post_id = ${id};`
      );
      return {
        ...post,
        postId: post.post_id,
        postTypeId: post.post_type_id,
        createdAt: post.creation_date
      };
    },
    packages: async (root, { query, local }) => {
      return packages({ query, local });
    },
  },
  Mutation: {
    loadDataset: async (root, { stack }) => {
      // Validate Stack Exists
      // TODO: using query

      // Save Stack
      await db2.query(sql`
        INSERT INTO stacks (name, last_updated)
        VALUES (${stack}, 0);
      `);
      const [{ stack_id }] = await db2.query(
        sql`SELECT last_insert_rowid() as stack_id;`
      );

      // Create Dataset Load Record
      await db2.query(sql`
        INSERT INTO dataset_loads (stack_id, download_percentage, storage_percentage, index_percentage)
        VALUES (${stack_id}, 0, 0, 0);
      `);
      const [{ update_id }] = await db2.query(
        sql`SELECT last_insert_rowid() as update_id;`
      );

      // Push to Queue for Loading
      datasetLoadQueue.push({ updateId: update_id });

      return {
        updateId: update_id,
      };
    },
  },
  Post: {
    posts: async (post) => {
      const posts = await db2.query(
        sql`SELECT * FROM posts WHERE parent_id = ${post.post_id};`
      );
      return posts.map(post => ({
        ...post,
        postId: post.post_id,
        postTypeId: post.post_type_id,
        createdAt: post.creation_date
      }));
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const bootstrap = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      last_updated REAL NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dataset_loads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stack_id INTEGER NOT NULL,
      download_percentage REAL NOT NULL,
      storage_percentage REAL NOT NULL,
      index_percentage REAL NOT NULL,
      FOREIGN KEY (stack_id)
        REFERENCES stacks (id) 
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stack_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      title TEXT,
      body TEXT NOT NULL,
      score INTEGER NOT NULL,
      parent_id INTEGER,
      post_type_id INTEGER NOT NULL,
      creation_date TEXT NOT NULL,
      FOREIGN KEY (stack_id)
        REFERENCES stacks (id),
      FOREIGN KEY (parent_id)
        REFERENCES posts (id)
    );
  `);

  // TODO: Search for in progress and push to queue
};

db.serialize(function () {
  bootstrap();

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
