const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

const downloadTask = require('./tasks/download');
const storageTask = require('./tasks/storage');
const indexTask = require('./tasks/index');

const datasetLoadQueueWorker = async ({ updateId }, cb) => {
  try {
    console.log(`DATASET_LOAD:${updateId}:START`);

    // check database for status
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

    // start each step in order
    const TASKS = {
      DOWNLOAD: downloadTask,
      STORAGE: storageTask,
      INDEX: indexTask,
    };

    for (let [taskId, runTask] of Object.entries(TASKS)) {
      const taskDatabaseId = `${taskId.toLowerCase()}_percentage`;
      if (state[taskDatabaseId] < 1) {
        await runTask(state);
      }
    }

    console.log(`DATASET_LOAD:${updateId}:END`);
    cb(null, updateId);
  } catch (error) {
    console.log(`DATASET_LOAD:${updateId}:FAILURE`);
    console.error(error);
    cb(error);
  }
};

module.exports = datasetLoadQueueWorker;
