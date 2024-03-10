const express = require("express");
const bodyParser = require('body-parser');
const config = require('../../config/config');
const path = require("path");
const worker_logs = require("../../models/workerJobLogs")
const logBatchSize = config.WORKER_LOG_BATCH_SIZE || 50;
const { flushLogsToDatabase } = require("../../utils/utils")
const app = express();

app.use(bodyParser.text())

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
  

app.get('/', (req, res) => {
    const data = {
        title: 'TechNoob Worker',
        environment: config.NODE_ENV,
        repo_link: 'https://github.com/TechNoobNG/Technoob-Homebase'
      };
    
      res.send(data);
});

const logBuffer = [];

setTimeout(() => {
    
},500)

const processJob = async function (req, res) {
    try {
        const payload = req.body;
        let data = JSON.parse(payload);
        if (typeof data === "string") {
            data = JSON.parse(data)
        }
 
        const method = data.method;
        const importService = data.service ? `../${data.service}` : `../${data.import}`;
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

        res.status(200).send('Payload received successfully.'); 
    } catch (err) {
        console.log("Job Failed",err);
        const log = logBuffer.pop();
        log.status = "failed";
        log.error_stack = {
            message: err.message,
            stack_trace: err
        };
        logBuffer.push(log);
        res.status(422).send(err.message); 
    }
}
app.post('/work', async (req, res) => {

    try {
        await processJob(req, res);
        setTimeout(async () => {
            if (logBuffer.length >= 1) {
                try {
                    await flushLogsToDatabase(logBuffer, worker_logs);
                } catch (error) {
                    console.log(error, " failed to push logs");
                }
            }
        }, 500)
    } catch (error) {
        res.status(422).send(error.message);
    }
    
});

module.exports = app;
