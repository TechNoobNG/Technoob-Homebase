import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';
import config from '../utils/config.js';
puppeteer.use(StealthPlugin());

const extractIndeedJobs = async function (page) {
  const list = await page.evaluate(() => {
    const listings = [];

    const jobElements = document.querySelector('.mosaic-provider-jobcards');
    const liList = jobElements.querySelectorAll('div.cardOutline.tapItem');

    liList.forEach((jobElement) => {
    if (jobElement.className) {
      const title = jobElement.querySelector('h2.jobTitle')?.innerText;
      const company = jobElement.querySelector('span[data-testid="company-name"]')?.innerText;
      const location = jobElement.querySelector('div[data-testid="text-location"]')?.innerText;
      const type = jobElement.querySelector('div[data-testid="attribute_snippet_testid"]')?.innerText;
      const linkTag = jobElement.querySelector('h2.jobTitle a')?.getAttribute('href');
      const link = `https://ng.indeed.com${linkTag}`
      const description = Array.from(jobElement.querySelectorAll('div.tapItem-gutter ul li'))
        .map(li => li.textContent.trim())
        .join('\n');
      const poster = 'https://technoob-dev-public-read.s3.amazonaws.com/images/2024-03-14T13-45-18.558Z-Indeed_(4).png'
      const posted = jobElement.querySelector('span[data-testid="myJobsStateDate"]')?.textContent
        .replace("PostedPosted", "")
        .replace("EmployerActive", "")
        .replace("days ago", "")
        .replace("day ago", "")
        .replace("+", "")
        .replace("PostedToday", "1")
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

const extractJobbermanJobs = async function (page) {
  const list = await page.evaluate(() => {
    const listings = [];
    const liList = document.querySelectorAll('div[data-cy="listing-cards-components"]');
    liList.forEach((jobElement) => {
      if (jobElement.className) {
        const title = jobElement.querySelector('a[title]')?.textContent.trim();
        const company = jobElement.querySelector('p.text-link-500 a')?.textContent
          .replace("(Third Party Recruitment)", "")
          .trim();
        const tagsArray = Array.from(document.querySelectorAll('.flex-wrap.text-gray-500 span'));
        const location = tagsArray[0]?.textContent
          .replace("(Work From Home)", "")
          .trim();;
        const type = tagsArray[1]?.textContent
          .replace("Full Time","full-time")
          .trim();
        const link = jobElement.querySelector('a[href]').href;

        const description = jobElement.querySelector('.flex.flex-col.flex-grow-0.flex-shrink-0.justify-start.items-center.px-5.py-3.border-t.border-gray-300.md\\:flex-row.basis-full p.text-sm.font-normal.text-gray-700.md\\:text-gray-500.md\\:pl-5')?.textContent.trim();
        const poster = 'https://technoob-dev-public-read.s3.amazonaws.com/image/2024-03-15T05-58-42.251Z-jobberman.webp'
        const timeMapping = {
          "1 month ago": "30",
          "Today": "1",
          "Yesterday": "2",
          "1 week ago": "7",
          "2 weeks ago": "14",
          "3 weeks ago": "21"
        };
        let posted = (jobElement.querySelector('.flex-row.items-start.items-center p')?.textContent || '').trim();
        posted = timeMapping[posted] || posted;
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


let puppeteerConfig = {};
if (config.NODE_ENV !== 'production') {
  puppeteerConfig = {
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-gpu'
    ],
  }
} else {
  puppeteerConfig = {
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--incognito",
        "--disable-client-side-phishing-detection",
        "--disable-software-rasterizer",
    ],
      }
}

const scrapeJobsIndeed = async function({ searchTag, q }) {
    try {
      const browser = await puppeteer.launch(puppeteerConfig);

      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15');

      await page.setViewport({ width: 1080, height: 1024 });

      await page.goto('https://ng.indeed.com', { waitUntil: 'domcontentloaded' });

      await page.waitForSelector('#text-input-what');

      await page.type('#text-input-what', searchTag);

      await page.click('.yosegi-InlineWhatWhere-primaryButton');

      await page.waitForSelector('.mosaic-provider-jobcards', {
        timeout: 3000,
      });

      const jobArray = [];
      let searchResultPage = 1;
      console.log(jobArray)
      while (jobArray.length < q) {
        const extractedJobsArray = await extractIndeedJobs(page);
        jobArray.push(...extractedJobsArray);
        searchResultPage++;
        const nextPageSelector = `a[data-testid="pagination-page-${searchResultPage}"]`;
        const nextPageElement = await page.$(nextPageSelector);
        if (!nextPageElement) {
          break;
        }

        await page.click(nextPageSelector);
        await page.waitForSelector('.mosaic-provider-jobcards');
      }

      await browser.close();

      return jobArray;
    } catch (error) {
      if (error.message.includes('mosaic-provider-jobcards')) {
        throw new Error(`Job not found for searchtag: ${searchTag}`);
      }
      throw error;
    }
  }
export default scrapeJobsIndeed


export async function scrapeJobsJobberman({ searchTag, exp, q }) {
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

    await page.goto(`https://www.jobberman.com/jobs?q=${searchTag}&experience=${exp}`, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#onetrust-accept-btn-handler', { visible: true }) 
    await page.evaluate(() => {
      document.querySelector('#onetrust-accept-btn-handler').scrollIntoView();
    });

    await page.waitForTimeout(500);
    await page.click('#onetrust-accept-btn-handler');
    await page.waitForSelector('div[data-cy="listing-cards-components"]', {
      timeout: 3000
    });

    const jobArray = [];
    let searchResultPage = 1

    while (jobArray.length < q) {
      const extractedJobsArray = await extractJobbermanJobs(page)
      jobArray.push(...extractedJobsArray)
      searchResultPage++
      const nextPageSelector = 'a[aria-label="Next »"]'
      const nextPageElement = await page.$(nextPageSelector)
      if (!nextPageElement) {
          break;
      }
  
      await page.click(nextPageSelector)
      await page.waitForSelector('div[data-cy="listing-cards-components"]')
    }
  
    await browser.close();

    return jobArray
  } catch (error) {
    if (error.message.includes('div[data-cy="listing-cards-components"]')) {
      throw new Error(`Job not found for searchtag: ${searchTag}`)
    }
    throw error
  }
}