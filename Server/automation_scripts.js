

//const jobs = require('./models/jobs')
//const Activity = require('./models/activity')
//const db = require("./utils/db_connector");

const puppeteer = require('puppeteer');
  const scrapeJobsIndeed = async({ searchTag, q }) => {
    try {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-gpu',
        ]
    });
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36');

      await page.goto('https://ng.indeed.com', { waitUntil: 'domcontentloaded' });

      await page.setViewport({ width: 1080, height: 1024 });

      await page.type('#text-input-what', searchTag);

      await page.click('.yosegi-InlineWhatWhere-primaryButton');

      const jobArray = []

      for (i = 1; i <= q * 1; i++){
        const selector = `#mosaic-provider-jobcards > ul > li:nth-child(${i}) > div > div.slider_container.css-8xisqv.eu4oa1w0 > div > div.slider_item.css-kyg8or.eu4oa1w0 > div > table.jobCard_mainContent.big6_visualChanges > tbody`
        const job = await page.waitForSelector(selector)
        const jobObject = await page.evaluate(job => {
          const title = job.querySelector('.jobTitle')?.textContent?.trim();
          const company = job.querySelector('.companyName')?.textContent?.trim();
          const location = job.querySelector('.companyLocation')?.textContent?.trim();
          const type = job.querySelector('.attribute_snippet')?.textContent?.trim();
          const linkTag = job.querySelector('h2.jobTitle a')?.getAttribute('href');
          const link = `https://ng.indeed.com${linkTag}`
          const poster = 'https://stackliteblob.blob.core.windows.net/images/2023-09-15T11-07-47.477Z-indeed_logo_1200x630.png'
          return {
            title,
            company,
            location,
            type,
            link,
            poster
          }

        }, job)

        console.log(jobObject)

        const detailsSelector = `#mosaic-provider-jobcards > ul > li:nth-child(${i}) > div > div.slider_container.css-8xisqv.eu4oa1w0 > div > div.slider_item.css-kyg8or.eu4oa1w0 > div > table.jobCardShelfContainer.big6_visualChanges`

        const jobDetails = await page.waitForSelector(detailsSelector)

        const jobDetailsObject = await page.evaluate(jobDetails => {
          const posted = jobDetails.querySelector('span.date')?.textContent
            .replace("PostedPosted", "")
            .replace("EmployerActive", "")
            .replace("days ago", "")
            .trim();

          return {
            posted
          }

        }, jobDetails)

        jobObject.details = jobDetailsObject

        jobArray.push(jobObject)
        }
      await browser.close();

      return jobArray
    } catch (error) {
      throw error
    }
  }
try {

    // initialise_db = async () => {
    //     db.on('error', console.error.bind(console, 'connection error:'));
    //     db.once('open', function () {
    //     });

    //   }

    //   (async () => {
    //     await Promise.all([
    //       initialise_db(),
    //     ])

    //     console.log("Database connected for worker ");

    //   })();

  (async () => {
    let dataUpload = []

    const stackKeywords = [
        "junior product manager",
        "junior project manager",
        "junior devops",
        "junior cloud engineer",
        "junior ui/ux designer",
        "junior backend developer",
        "junior QA",
        "junior mobile developer",
        "junior frontend developer",
        "junior fullstack "
]

    for (let keyword of stackKeywords) {
      console.log(keyword)


        let insertJobObj = {}

        let result = []

        try {
            result = await scrapeJobsIndeed({
                searchTag: keyword,
                q: 4
              })
        } catch (err) {
            console.log(err)
        }

      result.forEach((scrapedJob)=>{

        if (scrapedJob.details.posted * 1 > 5) {
          insertJobObj.title = scrapedJob.title;
          insertJobObj.company = scrapedJob.company;
          insertJobObj.exp = "N/A";
          insertJobObj.location = `${scrapedJob.location}, Lagos, Nigeria`;
          insertJobObj.workplaceType = scrapedJob.workplaceType || "onsite";
          insertJobObj.contractType =  "full-time";
          insertJobObj.datePosted = new Date();
          insertJobObj.expiryDate = new Date(insertJobObj.datePosted);
          insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + 7);
          insertJobObj.link = scrapedJob.link || "https://ng.indeed.com";
            insertJobObj.poster = scrapedJob.poster;
            insertJobObj.uploader_id = "64feb85db96fbbd731c42d5f"
        }

        if (JSON.stringify(insertJobObj) !== '{}') dataUpload.push(insertJobObj);

      })
      if (JSON.stringify(insertJobObj) !== '{}') {

            //const updatedJobs = await jobs.insertMany(dataUpload)

            const activityPromises = dataUpload.map((jobs) => {
                const activity = {
                  user_id: "64feb85db96fbbd731c42d5f",
                  module: "job",
                  activity: {
                    activity: "Job Upload(Worker)",
                    title: jobs.title,
                    location: jobs.location,
                    company: jobs.company,
                    datePosted: jobs.datePosted,
                    expiryDate: jobs.expiryDate,
                    workplaceType: jobs.workplaceType,
                    contractType: jobs.contractType,
                    status: "Successful"
                  }
                };
                return Activity.create(activity);
            });

            dataUpload = []

              try {
                //await Promise.all(activityPromises);
              } catch (err) {
                console.log(err)
              }
            console.log(updatedJobs)
        }
        }


    })()

} catch (error) {
    console.log( error.message)
}






