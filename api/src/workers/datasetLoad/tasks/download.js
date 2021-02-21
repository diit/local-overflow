const stream = require("stream");
const { promisify } = require("util");
const fs = require("fs");

const got = require("got");
const Seven = require("node-7z");
const throttle = require("lodash.throttle");
import connect, { sql } from '@databases/sqlite';

const db = connect("./db.sqlite");

// TODO: create tmp folder
const pipeline = promisify(stream.pipeline);

const updateTaskState = require('../lib/updateTaskState');

const downloadTask = async (state) => {
  const run = () =>
    new Promise(async (resolve, reject) => {
      // Stage 0
      const [stack] = await db.query(sql`SELECT * FROM stacks WHERE id = ${state.stack_id};`)

      // Stage 1
      const cleanupStage1 = async () => {
        fs.unlinkSync("./tmp/full.7z");
      };
      const downloadStream = got.stream(
        `https://archive.org/download/stackexchange/${stack.name}.stackexchange.com.7z`
      );
      downloadStream.on("downloadProgress", (progress) => {
        throttle((progress) => {
          // Update db every 500ms
          console.log("DOWNLOAD", progress);
          updateTaskState({
            taskId: state.id,
            taskState: {
              stack_id: state.stack_id,
              download: progress.percent * 0.5,
              storage: 0,
              index: 0,
            },
          });
        }, 500)(progress);
      });
      await pipeline(downloadStream, fs.createWriteStream("./tmp/full.7z"));

      // Stage 2
      const readStream = Seven.extract("./tmp/full.7z", "./tmp/extracted", {
        $progress: true,
        $cherryPick: "Posts.xml",
      });
      readStream.on("progress", function (progress) {
        throttle((progress) => {
          // Update db every 500ms
          console.log("EXTRACT", progress);
          updateTaskState({
            taskId: state.id,
            taskState: {
              stack_id: state.stack_id,
              download: 0.5 + (progress.percent / 100) * 0.5,
              storage: 0,
              index: 0,
            },
          });
        }, 500)(progress);
      });
      readStream.on("error", (err) => console.error(err));
      readStream.on("end", () => {
        cleanupStage1();
        resolve();
      });
    });

  await run();
  await updateTaskState({
    taskId: state.id,
    taskState: {
      stack_id: state.stack_id,
      download: 1,
      storage: 0,
      index: 0,
    },
  });
};

module.exports = downloadTask;
