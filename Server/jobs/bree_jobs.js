// const Graceful = require('@ladjs/graceful');
// const Cabin = require('cabin');
// const Bree = require('bree');
// const jobs = require('./index')
// const bree = new Bree({
//     logger: new Cabin(),
//     errorHandler: (error, workerMetadata) => {
//         if (workerMetadata.threadId) {
//         console.log(`There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`)
//         } else {
//         console.log(`There was an error while running a worker ${workerMetadata.name}`)
//         }

//         ;
//     }

//     });
// module.exports = {
//     runner: async function () {
//         const graceful = new Graceful({ brees: [bree] });
//         graceful.listen();
//         console.log("Bree cron started")
//         await bree.start();
//     },

//     stopper: async function () {
//        bree.stop();
//     }
// }


