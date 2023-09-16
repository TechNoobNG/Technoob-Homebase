//queue listener for azure queue
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const azureStorageConnectionString= config.AZURE_STORAGE_CONNECTION_STRING;
const queueName = config.AZURE_QUEUE_NAME;
const queueUrl = config.AZURE_QUEUE_URL;
const subscriber = require('azure-queue-subscriber');
const db = require("../utils/db_connector");
const worker_logs = require("../models/workerJobLogs")

 initialise_db = async () => {
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
  });

}

(async () => {
  await Promise.all([
    initialise_db(),
  ])

  console.log("Database connected for worker ");

})();


const app = subscriber.create({
    queueUrl: queueUrl,
    queueName: queueName,
    connectionString: azureStorageConnectionString,
    batchSize: 1,
  async handleMessage(message, done) {
      let log
      try {
        if (!message.messageText || message.messageText === 'undefined' || message.messageText === 'null' || message.messageText === '' || message.messageText === ' ' ) {
         return done();
        }
       
        const data = JSON.parse(message.messageText);
        const method = data.method;
        const importService = data.service ? `${data.import}/${data.service}` : data.import;
        log = await worker_logs.create({
          action: method,
          importService: importService,
          payload: data.data ? data.data : null,
          status: "started"
         })
        const importedData = require(importService);
        await importedData[method](data.data ? data.data : null);
        log.status = "completed"
        await log.save()
      } catch (err) {
        if (log) {
          log.status = "failed";
          log.error_stack = {
            message: err.message,
            stack_trace: err
          }
          await log.save()
        }
        console.log(err.message);
        done()
      }
      done();
    },    
  blobConnectionString: azureStorageConnectionString,
  useAcquireLease: true,
  maximumRetries: 5
});

app.on('error', (err) => {
  console.log(err.message);
});

app.start();