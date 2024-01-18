const puppeteer = require('puppeteer-extra')
const {executablePath} = require('puppeteer')
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin())
const { uploadFile } = require('../multer/multer_upload');
const stream = require('stream');
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
    let ss = {};
    try {
      const browser = await puppeteer.launch({
        executablePath: executablePath(),
        args: [
          '--no-sandbox',
        ],
    
        headless: 'new',
      });
      //let page = (await browser.pages())[0];
      let page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1024 });

      await page.goto('https://ng.indeed.com', { waitUntil: 'load' });

      await page.waitForTimeout(5000)

      // // try to solve the cloudflare captcha 
      // await page.click('body')
      // await page.waitForTimeout(500)

      // await page.keyboard.press('Tab')
      // await page.waitForTimeout(500)

      // await page.keyboard.press('Space')
      // await page.waitForTimeout(10000)

      const screenShot = await page.screenshot({
        fullPage: true
      });
      ss = await uploadFile({
        mimetype: 'image/jpeg',
        buffer: screenShot,
        acl: "public",
        originalname: "indeedpage.jpeg"
      })

 
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
      console.warn(error)
      error.message = error.message + "  " + ss.url
      throw error
    }
  }

}

