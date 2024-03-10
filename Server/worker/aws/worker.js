const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
const worker_logs = require('../../models/workerJobLogs');
const config = require('../../config/config');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_QUEUE_URL,
  WORKER_LOG_BATCH_SIZE
} = config;

const accessKeyId = AWS_ACCESS_KEY_ID;
const secretAccessKey = AWS_SECRET_ACCESS_KEY;
const region = AWS_REGION;
const queueUrl = AWS_QUEUE_URL;
const logBatchSize = WORKER_LOG_BATCH_SIZE;

const logBuffer = [];

async function flushLogsToDatabase() {
  if (logBuffer.length === 0) return;

  try {
    await worker_logs.insertMany(logBuffer);
    logBuffer.length = 0;
  } catch (error) {
    console.error('Error flushing logs to the database:', error);
  }
}

module.exports = function () {
  const app = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async (message) => {
      try {
        if (!message.messageText || !message.messageText.trim()) {
          return;
        }

        const data = JSON.parse(message.messageText);
        const method = data.method;
        const importService = data.service ? `../${data.import}/${data.service}` : data.import;

        logBuffer.push({
          action: method,
          importService: importService,
          payload: data.data || null,
          status: 'started'
        });

        const importedData = require(importService);
        await importedData[method](data.data || null);

        const log = logBuffer.pop();
        log.status = 'completed';
        logBuffer.push(log);

        if (logBuffer.length >= logBatchSize) {
          await flushLogsToDatabase();
        }
      } catch (err) {
        console.log(err.message);
        const log = logBuffer.pop() || {};
        log.status = 'failed';
        log.error_stack = {
          message: err.message,
          stack_trace: err
        };
        logBuffer.push(log);
      }
    },
    sqs: new SQSClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    })
  });

  const handleErrors = async (err) => {
    console.log(err.message);
    await flushLogsToDatabase();
  };

  app.on('error', handleErrors);
  app.on('processing_error', handleErrors);
  app.on('stopped', handleErrors);
  app.on('timeout_error', handleErrors);

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception in worker:', error);
    app.stop();
    app.start();
  });

  app.start();
};
