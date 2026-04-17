import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  
  const target = process.argv[2] || 'https://www.williamsphysics.co.uk/computerscience/gcse/aqa/textbook';
  console.log(`Targeting: ${target}`);

  try {
    await page.goto(target, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(10000);
    
    const title = await page.title();
    console.log(`Title: ${title}`);
    
    if (title.includes('Just a moment')) {
      console.log('Challenge detected. Waiting 30s...');
      await page.waitForTimeout(30000);
      console.log(`Title after wait: ${await page.title()}`);
    }

    const text = await page.innerText('body');
    console.log('---PAGE_TEXT_START---');
    console.log(text);
    console.log('---PAGE_TEXT_END---');

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => ({ text: a.innerText, href: a.href }));
    });
    console.log('---LINKS_START---');
    console.log(JSON.stringify(links, null, 2));
    console.log('---LINKS_END---');

  } catch (e) {
    console.error(`Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

run();
