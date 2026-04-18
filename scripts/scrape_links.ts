import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ 
    headless: true 
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  
  // Go to home page first
  console.log('Going to home page...');
  await page.goto('https://www.williamsphysics.co.uk/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);

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
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(10000); // 10s delay

      let title = await page.title();
      console.log(`Page title: ${title}`);
      
      let retryCount = 0;
      while (title.includes('Just a moment') && retryCount < 3) {
        console.log(`Retrying for ${url} (attempt ${retryCount + 1})...`);
        await page.waitForTimeout(15000);
        title = await page.title();
        console.log(`Page title after wait: ${title}`);
        retryCount++;
      }

      const links = await page.evaluate((currentUrl) => {
        const board = currentUrl.split('/')[5];
        const category = currentUrl.split('/')[6];
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => {
            return href.includes(`/computerscience/gcse/${board}/${category}/`) || 
                   (href.includes(`/computerscience/gcse/${board}/`) && !href.endsWith('/textbook') && !href.endsWith('/assessments') && !href.endsWith('/longanswer'));
          });
      }, url);
      
      results[url] = [...new Set(links)];
      console.log(`Found ${results[url].length} links for ${url}`);
    } catch (e) {
      console.error(`Error fetching ${url}: ${e.message}`);
    }
  }

  console.log('FINAL_RESULTS:');
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

run();
