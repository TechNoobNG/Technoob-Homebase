const { fork } = require('child_process');
const path = require('path');

const childPath = path.join(__dirname, 'child_worker.js');
const pool = [];

function checkChild() {
  return pool.length;
}

async function work(params, timeout = 5000) {
  if (pool.length === 0) {
    throw new Error('No child processes available in the pool');
  }

  const child = pool.shift();
  if (!child) {
    throw new Error('No child processes available in the pool');
  }

  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      pool.push(child);
      reject(new Error('Child process timed out'));
    }, timeout);

    try {
      const response = await sendMessageToChild(child, params);
      clearTimeout(timeoutId);
      pool.push(child);
      if (response.type === 'error') {
        reject(new Error(response.data));
      } else {
        resolve(response.data);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      pool.push(child);
      reject(error);
    }
  });
}

function sendMessageToChild(child, params) {
  return new Promise((resolve, reject) => {
    child.send({
      payload: params.payload,
      activity: params.activity,
    });

    child.once('message', (resp) => {
      resolve(resp);
    });

    child.once('error', (err) => {
      reject(err);
    });
  });
}


const numChildProcesses = 2;
for (let i = 0; i < numChildProcesses; i++) {
  const child = fork(childPath, [], { env: process.env });
  pool.push(child);
}

module.exports = {
  checkChild,
  work,
};
