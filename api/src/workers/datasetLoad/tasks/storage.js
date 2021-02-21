import connect, { sql } from '@databases/sqlite';
const db = connect("./db.sqlite");

const fs = require("fs");
const { promisify } = require("util");
const { XMLTransform, parseAttrs } = require("xml-obj-transform-stream");
const { pipeline, Readable, Writable } = require("stream");
const { MeiliSearch } = require("meilisearch");
import DOMPurify from 'isomorphic-dompurify';
import he from 'he';

const updateTaskState = require("../lib/updateTaskState");

const asyncPipeline = promisify(pipeline);
const client = new MeiliSearch({ host: "http://127.0.0.1:7700" });
const filename = __dirname + "/../tmp/extracted/Posts.xml";

let MAX_BATCH_SIZE = 10000;
let stack = null;
let stack_id = null;
let batch = [];

const countLines = (path) => {
  return new Promise((resolve, reject) => {
    let i;
    let count = 0;

    fs.createReadStream(path)
      .on("data", function (chunk) {
        for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
      })
      .on("end", function () {
        resolve(count);
      })
      .on("error", function (error) {
        reject(error);
      });
  });
};

const writeBatchToDb = async () => {
  for (let item of batch) {
    try {
      await db.query(sql`
        INSERT OR REPLACE INTO posts(stack_id, post_id, title, body, score, parent_id, post_type_id, creation_date)
        VALUES (${stack_id}, ${item.Id}, ${item.Title}, ${item.Body}, ${item.Score}, ${item.ParentId}, ${item.PostTypeId}, ${item.CreationDate});
      `);
    } catch (error) {
      // TODO: HANDLE
      console.error(error);
    }
  }

  return true;
}

const writeBatchToSearch = async () => {
  const sanitizedBatch = batch.map(item => ({
    ...item,
    Body: DOMPurify.sanitize(he.decode(item.Body), { ALLOWED_TAGS: [] })
  }))
  return client.index(`${stack}_post`).addDocuments(sanitizedBatch);
}

const writeBatch = async () => {
  await writeBatchToDb();
  await writeBatchToSearch();

  batch = [];

  return true;
}

class ConsoleDirWritable extends Writable {
  constructor(options) {
    super(Object.assign({}, options, { objectMode: true }));
  }
  _write(chunk, encoding, callback) {
    const [event, type, attributes] = chunk;

    if (event === "tagopen" && type === "row") {
      const post = parseAttrs(attributes);

      if (batch.length >= MAX_BATCH_SIZE) {
        batch.push(post);
        writeBatch().then((res) => {
          console.log(`--> [Post:${post.Id}]`);
          callback();
        });
      } else {
        batch.push(post);
        // console.log(`<-- [Post:${post.Id}]`);
        callback();
      }
    } else if (event === "tagclose" && type === "posts") {
      // Use this to catch last items
      if (batch.length > 0) {
        writeBatch().then((res) => {
          console.log(`--> [Post:END]`);
          callback();
        });
      }
    } else {
      callback();
    }
  }
}

const storageTask = async (state) => {
  // hacky booo
  const [stackRef] = await db.query(sql`SELECT * FROM stacks WHERE id = ${state.stack_id};`)
  stack = stackRef.name;
  stack_id = state.stack_id;

  const fileLineCount = await countLines(filename);

  // be fancy later
  if (fileLineCount > 10000) MAX_BATCH_SIZE = 10000;
  else if (fileLineCount > 1000) MAX_BATCH_SIZE = 1000;
  else MAX_BATCH_SIZE = 100;

  const options = { noEmptyText: true };
  await asyncPipeline(
    fs.createReadStream(filename),
    new XMLTransform(options),
    new ConsoleDirWritable()
  );

  await updateTaskState({
    taskId: state.updateId,
    taskState: {
      stack_id: state.stack_id,
      download: 1,
      storage: 1,
      index: 0,
    },
  });
};

module.exports = storageTask;
