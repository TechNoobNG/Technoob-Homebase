const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
const worker_logs = require('../../models/workerJobLogs');
const config = require('../../config/config');

const {
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  queueUrl: AWS_QUEUE_URL
} = config.AWS_SERVICES.SQS;

const {
  WORKER_LOG_BATCH_SIZE = 50
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
        if (!message.Body || !message.Body.trim()) {
          return;
        }

        let data = JSON.parse(message.Body);
        if (typeof data === 'string') {
          data = JSON.parse(data)
        }
        const method = data.method;
    
        const importService = data.service ? `../../services/${data.service}` : data.import;

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

        setTimeout(async () => {
          await flushLogsToDatabase();
        }, 10)
        
      } catch (err) {
        console.log(err);
        const log = logBuffer.pop() || {};
        log.status = 'failed';
        log.error_stack = {
          message: err.message,
          stack_trace: err
        };
        logBuffer.push(log);
        throw err
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
