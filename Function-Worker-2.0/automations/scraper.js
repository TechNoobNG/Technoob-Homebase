const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin())
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

module.exports = {
  async scrapeJobsIndeed({ searchTag, q }) {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-gpu'
        ],
      });
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15');

      await page.setViewport({ width: 1080, height: 1024 });

      await page.goto('https://ng.indeed.com', { waitUntil: 'domcontentloaded' });

      await page.waitForSelector('#text-input-what');

      await page.type('#text-input-what', searchTag);

      await page.click('.yosegi-InlineWhatWhere-primaryButton');

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
      throw error
    }
  },

}

