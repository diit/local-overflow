const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

const updateTaskState = ({
  taskId,
  taskState: { stack_id, download, storage, index },
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
          UPDATE dataset_loads
          SET stack_id = $stack_id,
              download_percentage = $download,
              storage_percentage = $storage,
              index_percentage = $index
          WHERE id = $id
        `,
      {
        $id: taskId,
        $stack_id: stack_id,
        $download: download,
        $storage: storage,
        $index: index,
      },
      function (err) {
        if (err) reject(err);
        resolve(this.changes);
      }
    );
  });
};

module.exports = updateTaskState;
