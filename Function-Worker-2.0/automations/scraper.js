const puppeteer = require('puppeteer');

module.exports = {
  async scrapeJobsIndeed({ searchTag, q }) {
    try {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-gpu',
      ],
        executablePath: "./chrome-linux/chrome"
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

}

