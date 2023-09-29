// const config = require('../config/config')['development'];
// const scraper = require('../services/jobs')
// const queue = require('../azure_Queue/init');
// const honeybadger = require('../utils/honeybadger');
// const { exec } = require('child_process');

// module.exports = {
//     runWebScraper: async () => {
//              try {
//                 const stackKeywords = config.SCRAPE_STACK_KEYWORDS || [
//                     "junior software developer",

//             ]

//             for (let keyword of stackKeywords) {
//                  await scraper.createScrapedJobs(keyword)
//             }
//         //     honeybadger.notify({
//         //         name: "createScrapedJobs",
//         //         message: "Initiated Job scraping"
//         //    })
//         } catch (error) {
//             console.log(err)
//             throw err
//         }
//     },

//     runDockerJob: function () {

//     }
// }