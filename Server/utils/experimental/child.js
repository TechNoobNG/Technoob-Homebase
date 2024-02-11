const { fork } = require('child_process');
const pool = [];
const path = require('path');
const childPath = path.join(__dirname, 'child_worker.js');

try {

  for (let i = 0; i < 1; i++) {
    const child = fork(childPath, [], { env: process.env });
    pool.push(child);
  }
} catch (error) {

}

module.exports = {
   checkChild() {
      return pool.length;

  },

  async work (params) {
    return new Promise((resolve, reject) => {
      if (!pool.length) {
        reject(new Error('No child processes available in the pool'));
        return;
      }
      const child = pool.shift();
      if (!child) {
        reject(new Error('No child processes available to use in the pool'));
        return;
      }
      let connected_child = child.connected;

      if (!connected_child) {
        reject(new Error(' child processes is dead available in the pool'));
        return;
      } else {
        child.send({
          payload: params.payload,
          activity: params.activity,
        });

        child.on('message', resp => {
          pool.push(child);
          try {
            if (resp.type === 'error') {
              throw new Error(resp.data);
            }
            resolve(resp.data);
          } catch (error) {
            reject(error);
          }
        })
      }

    })
  }
}

