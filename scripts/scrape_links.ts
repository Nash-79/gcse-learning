import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const urls = [
    'https://www.williamsphysics.co.uk/computerscience/gcse/aqa/textbook',
    'https://www.williamsphysics.co.uk/computerscience/gcse/aqa/assessments',
    'https://www.williamsphysics.co.uk/computerscience/gcse/aqa/longanswer',
    'https://www.williamsphysics.co.uk/computerscience/gcse/edexcel/textbook',
    'https://www.williamsphysics.co.uk/computerscience/gcse/edexcel/assessments',
    'https://www.williamsphysics.co.uk/computerscience/gcse/edexcel/longanswer',
    'https://www.williamsphysics.co.uk/computerscience/gcse/ocr/textbook',
    'https://www.williamsphysics.co.uk/computerscience/gcse/ocr/assessments',
    'https://www.williamsphysics.co.uk/computerscience/gcse/ocr/longanswer'
  ];

  const results = {};

  for (const url of urls) {
    console.log(`Fetching: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => href.includes('/computerscience/gcse/'));
      });
      results[url] = [...new Set(links)];
    } catch (e) {
      console.error(`Error fetching ${url}: ${e.message}`);
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

run();
