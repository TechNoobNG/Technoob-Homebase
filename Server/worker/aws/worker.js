const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
const worker_logs = require("../../models/workerJobLogs")
const config = require('../../config/config')
const accessKeyId= config.AWS_ACCESS_KEY_ID;
const secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
const region = config.AWS_REGION;
const queueUrl = config.AWS_QUEUE_URL;
const logBuffer = [];
const logBatchSize = config.WORKER_LOG_BATCH_SIZE;

//  initialise_db = async () => {
//   db.on('error', console.error.bind(console, 'connection error:'));
//   db.once('open', function () {
//   });

//  }

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
  let app;
  try {

    app = Consumer.create({
      queueUrl: queueUrl,
      handleMessage: async (message) => {
        try {
          if (!message.messageText || message.messageText === 'undefined' || message.messageText === 'null' || message.messageText === '' || message.messageText === ' ' ) {
          return
          }
          const data = JSON.parse(message.messageText);
          const method = data.method;
          const importService = data.service ? `../${data.import}/${data.service}` : data.import;
          logBuffer.push({
            action: method,
            importService: importService,
            payload: data.data ? data.data : null,
            status: "started"
          });
          const importedData = require(importService);
          await importedData[method](data.data ? data.data : null);

          const log = logBuffer.pop();
          log.status = "completed";
          logBuffer.push(log);

          if (logBuffer.length >= logBatchSize) {
              await flushLogsToDatabase();
          }
        } catch (err) {
              console.log(err.message);
              const log = logBuffer.pop();
              log.status = "failed";
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

    app.on('error', async (err) => {
      console.log(err.message);
      await flushLogsToDatabase();
    });
    app.on('processing_error', async () => await flushLogsToDatabase());
    app.on('stopped', async () => await flushLogsToDatabase());

    app.on('timeout_error', async (err) => await flushLogsToDatabase());

    app.start();
  } catch (err) {
    console.error('Error starting Azure queue listener:', err);
    app.start();
  }
}
