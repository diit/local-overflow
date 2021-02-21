const updateTaskState = require('../lib/updateTaskState');

const indexTask = async (state) => {
  console.log("ix");
  await updateTaskState({
    taskId: state.id,
    taskState: {
      stack_id: state.stack_id,
      download: 1,
      storage: 1,
      index: 1,
    },
  });
};
    
module.exports = indexTask;
