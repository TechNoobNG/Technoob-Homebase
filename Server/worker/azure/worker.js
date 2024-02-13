//queue listener for azure queue
const config = require('../../config/config')
const azureStorageConnectionString= config.AZURE_STORAGE_CONNECTION_STRING;
const queueName = config.AZURE_QUEUE_NAME;
const queueUrl = config.AZURE_QUEUE_URL;
const subscriber = require('azure-queue-subscriber');
const worker_logs = require("../../models/workerJobLogs")
const logBuffer = [];
const logBatchSize = config.WORKER_LOG_BATCH_SIZE || 50;
const { flushLogsToDatabase } = require("../../utils/utils")

//  initialise_db = async () => {
//   db.on('error', console.error.bind(console, 'connection error:'));
//   db.once('open', function () {
//   });

//  }

//  async function flushLogsToDatabase() {
//   if (logBuffer.length === 0) return;

//    try {
//     await worker_logs.insertMany(logBuffer);
//     logBuffer.length = 0;
//   } catch (error) {
//     console.error('Error flushing logs to the database:', error);
//   }
//  }

module.exports = function () {
    try {

      const app = subscriber.create({
        queueUrl: queueUrl,
        queueName: queueName,
        connectionString: azureStorageConnectionString,
        batchSize: config.WORKER_BATCH_SIZE,
      async handleMessage(message, done) {
          try {
            if (!message.messageText || message.messageText === 'undefined' || message.messageText === 'null' || message.messageText === '' || message.messageText === ' ' ) {
            return done();
            }
            console.log(message)
            const data = JSON.parse(message.messageText);
            const method = data.method;
            const importService = data.service ? `${data.import}/${data.service}` : data.import;
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
                await flushLogsToDatabase(logBuffer, worker_logs );
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
            done();
        },
        blobConnectionString: azureStorageConnectionString,
        useAcquireLease: true,
        maximumRetries: 3
      });


      app.on('error', async (err) => {
        console.log(err.message);
        await flushLogsToDatabase();
      });
      app.on('processing_error', async () => await flushLogsToDatabase());
      app.on('stopped', async () => await flushLogsToDatabase());


      app.start();
  } catch (err) {
    console.error('Error starting Azure queue listener:', err);
  }
}


