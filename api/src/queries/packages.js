import got from "got";
import cheerio from "cheerio";
import connect, { sql } from '@databases/sqlite';

const db = connect("./db.sqlite");

const ARCHIVE_INDEX = `https://archive.org/download/stackexchange`;

const remotePackages = async ({ query }) => {
  const { body } = await got(ARCHIVE_INDEX);
  const $ = cheerio.load(body);

  const stacks = $(".directory-listing-table tr")
    .map((idx, row) => {
      return {
        name: $(row)
          .find("td:nth-child(1) a:nth-child(1)")
          .text()
          .replace(".stackexchange.com.7z", ""),
        updatedAt: $(row).find("td:nth-child(2)").text(),
        size: $(row).find("td:nth-child(3)").text(),
      };
    })
    .get()
    .filter((stack) => {
      const BLOCKLIST = ["", " Go to parent directory", "Sites.xml"];
      return !BLOCKLIST.includes(stack.name);
    })
    .map((stack) => ({ id: stack.name, ...stack }));

  return stacks;
}

const localPackages = async ({ query }) => {
  // TODO: size, updatedAt
  return db.query(sql`SELECT * FROM stacks;`);
}

const packages = async ({ query = '', local = false }) => {
  return local ? await localPackages({ query }) : await remotePackages({ query });
};

export default packages;
