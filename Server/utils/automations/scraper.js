const puppeteer = require('puppeteer-extra')
const {executablePath} = require('puppeteer')
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin())
const { uploadFile } = require('../multer/multer_upload');
const axios = require('axios').default
const { XMLParser } = require("fast-xml-parser");
const tunnel = require('tunnel');
const config = require('../../config/config')
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'smartproxy.crawlbase.com',
    port: 8012,
    proxyAuth: `${config.SMART_PROXY_KEY}:`,
  },
});
puppeteer.use(StealthPlugin());
const allowedContractTypes = ["full-time", "contract","internship","part-time","gig"]
const scrapingLogs = require("../../models/scrapingLogs");
const extractIndeedJobs = async function (page) {
  const list = await page.evaluate(() => {
    const listings = [];

    const jobElements = document.querySelectorAll('.mosaic-provider-jobcards li');
    
    jobElements.forEach((jobElement) => {
      if (jobElement.className) {
        const title = jobElement.querySelector('.jobTitle span')?.innerText;
        const company = jobElement.querySelector('.company_location div > span')?.innerText;
        const location = jobElement.querySelector('.company_location div > div ')?.innerText;
        const type = jobElement.querySelector('.metadata .css-1ihavw2')?.innerText;
        const linkTag = jobElement.querySelector('h2.jobTitle a')?.getAttribute('href');
        const link = `https://ng.indeed.com${linkTag}`
        const description = Array.from(jobElement.querySelectorAll('.result-footer ul li'))
          .map(li => li.textContent.trim())
          .join('\n');
        const poster = 'https://technoobsub9718.blob.core.windows.net/images/2023-09-15T11-07-47.477Z-indeed_logo_1200x630.png'
        const posted = jobElement.querySelector('span.date')?.textContent
          .replace("PostedPosted", "")
          .replace("EmployerActive", "")
          .replace("days ago", "")
          .replace("+","")
          .trim();


        if (title && title.length > 0 && company && company.length > 0 && description && description.length > 0) {
          listings.push({
            title,
            company,
            location,
            type,
            description,
            link,
            poster,
            posted
          });
        }
      }
    });

    return listings;
  });
  return list
}
const extractIndeedRSSJobs =  function(inputData) {
  const transformedData = inputData.map(item => {
    const [, title, company, location] = item.title.match(/^(.*?) - (.*?) - (.+)$/);
    const type = item.source;
    const link = item.link;
    let description = item.description
    .split('<br>')[0] 
    .replace(/<.*?>/g, '');

    let salary = null;
    const salaryMatch = item.description.match(/(\$[\d,]+(\s?-\s?\$[\d,]+)?)/);
    if (salaryMatch) {
      salary = salaryMatch[0];
      description = description.replace(salary, '').trim();
    }
    const postedAt = new Date(item.pubDate.replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun), /, ''));
    const posted = Math.floor((new Date() - postedAt) / (24 * 60 * 60 * 1000)); // Calculate days difference


    return {
      title,
      company,
      location,
      type,
      link,
      description,
      postedAt,
      salary,
      posted
    };
  });

  return transformedData;
}

module.exports = {
  async scrapeJobsIndeed({ searchTag, q }) {
    let ss = {};
    try {
      const browser = await puppeteer.launch({
        executablePath: executablePath(),
        args: [
          '--no-sandbox'
        ],
    
        headless: 'new',
      });
      let page = (await browser.pages())[0];
      //let page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1024 });
      const url = `https://ng.indeed.com/jobs?q=${searchTag.replace(" ","+")}&l=&from=searchOnHP`

      await page.goto(url, { waitUntil: 'load' });

      await page.waitForTimeout(5000)

      // try to solve the cloudflare captcha 
      await page.click('body')
      await page.waitForTimeout(500)

      await page.keyboard.press('Tab')
      await page.waitForTimeout(500)

      await page.keyboard.press('Space')
      await page.waitForTimeout(10000)

      const screenShot = await page.screenshot({
        fullPage: true
      });
      ss = await uploadFile({
        mimetype: 'image/jpeg',
        buffer: screenShot,
        acl: "public",
        originalname: "indeedpage.jpeg"
      })


 
      // await page.waitForSelector('#text-input-what');

      // await page.type('#text-input-what', searchTag);

      // await page.click('.yosegi-InlineWhatWhere-primaryButton');

      await page.waitForSelector('.mosaic-provider-jobcards');

      const jobArray = [];
      let searchResultPage = 1

      while (jobArray.length < q) {
        const extractedJobsArray = await extractIndeedJobs(page)
        jobArray.push(...extractedJobsArray)
        searchResultPage++
        const nextPageSelector = `a[data-testid="pagination-page-${searchResultPage}"]`
        const nextPageElement = await page.$(nextPageSelector)
        if (!nextPageElement) {
            break;
        }
    
        await page.click(nextPageSelector)
        await page.waitForSelector('.mosaic-provider-jobcards')
    }
    
      await browser.close();

      return jobArray
    } catch (error) {
      console.warn(error)
      error.message = error.message + "  " + ss.url
      throw error
    }
  },

  /**
   * 
   * @param searchTags @type {Array} @description An array of search tags
   * @param age @type {number} @description Date posted
   * @param expires @type {number} @description Expires at
  */
  async scrapeJobsRSS({ searchTags, age ,expires}) {
    try {
      if (![1, 3, 7].includes(age)) {
        throw new Error("Invalid Expiry, should be 1, 3, or 7");
      }

      const createLog = await scrapingLogs.create({
        searchTags,
        age,
        status: "initiated",
        platform: "indeedRSS"
      })
      
      let jobArray = [];
      let currentIndex = 0;
      let scraperlog = {}
  
      const processNextSearchTag = async () => {
        if (currentIndex < searchTags.length) {
          const searchTag = searchTags[currentIndex];
          const indeedUrl = `https://rss.indeed.com/rss?q=${encodeURI(searchTag)}&fromage=${age}&l=remote`;

          try {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; 
            const response = await axios({
                method: 'get',
                url: indeedUrl,
                httpsAgent:agent,
                port: 443,
                rejectUnauthorized: false,
                headers: {
                  "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15'
                }
            })
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1; 
            const parser = new XMLParser();
            let indeedSearchResultArray = parser.parse(response.data).rss?.channel?.item;
            if (!indeedSearchResultArray || !indeedSearchResultArray.length) {
              throw new Error("No jobs found")
            }
            const rssjobsArray = extractIndeedRSSJobs(indeedSearchResultArray);
            //update log
            scraperlog[searchTag] = {
              status: "successful"
            }
            jobArray.push(...rssjobsArray);
          } catch (error) {
            console.error(`Error processing search tag ${searchTag}:`, error.message);
            scraperlog[searchTag] = {
              status: "failed",
              error: error.message
            }
          }
  
          currentIndex++;
          if (currentIndex % 2 == 0) {
            console.log("Delaying for rate limit")
            setTimeout(processNextSearchTag, 30000);
          } else {
            setTimeout(processNextSearchTag, 8000);
          }
        } else {
          await scrapingLogs.findByIdAndUpdate(createLog._id, {
            $set: {
              scrapeResultLog: scraperlog,
              status: "run-completed"
            },
          })
          jobArray = jobArray.map((scrapedJob) => {
            let insertJobObj = {}
            if (scrapedJob.posted * 1 <= age) {
                insertJobObj.title = scrapedJob.title;
                insertJobObj.company = scrapedJob.company;
                insertJobObj.exp = "N/A";
                insertJobObj.location = `${scrapedJob.location}`;
                insertJobObj.workplaceType = scrapedJob.workplaceType || "remote";
                insertJobObj.contractType = allowedContractTypes.includes(scrapedJob.type?.toLowerCase()) ?  scrapedJob.type?.toLowerCase() : "full-time";
                insertJobObj.datePosted = new Date();
                insertJobObj.expiryDate = new Date(insertJobObj.datePosted);
                insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + expires);
                insertJobObj.link = scrapedJob.link || "https://ng.indeed.com";
                insertJobObj.poster = scrapedJob.poster || 'https://technoobsub9718.blob.core.windows.net/images/2023-09-15T11-07-47.477Z-indeed_logo_1200x630.png';
                insertJobObj.uploader_id = "64feb85db96fbbd731c42d5f"
            }
            if (insertJobObj && JSON.stringify(insertJobObj) !== '{}'  ) return insertJobObj;
          }).filter((insertJobObj) => insertJobObj && JSON.stringify(insertJobObj) !== '{}');
          const jobs = require("../../services/jobs")
          await jobs.createScrapedJobs({ uniqueJobsArray: jobArray })
        }
      };
  
      processNextSearchTag();
  
      return {
        message: "Job scraping queued successfully",
      };
    } catch (error) {
      console.log(error.message)
      throw error;
    }
  },

  async createScrapperLog({ searchTags, age, platform, scrapeResultLog, status }) {
     try {
       const logEntry = await scrapingLogs.create({
         searchTags: searchTags,
         platform : platform,
         age: age || 0,
         scrapeResultLog: scrapeResultLog,
         status: status
       })
       return logEntry
     } catch (error) {
        throw error
     }
  }
}

