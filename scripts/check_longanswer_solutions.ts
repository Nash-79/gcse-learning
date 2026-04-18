import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const mainUrl = 'https://www.williamsphysics.co.uk/computerscience/gcse/ocr/longanswer';
  
  try {
    await page.goto(mainUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    // Select first topic and Standard difficulty
    await page.selectOption('select[name="topic"]', { index: 1 });
    await page.click('text=STANDARD');
    
    console.log('Clicking Start Questions...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('text=Start Questions')
    ]);

    await page.waitForTimeout(5000);
    console.log(`Page Title: ${await page.title()}`);

    // Look for solution buttons or hidden sections
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, summary'))
        .map(el => ({ 
            tag: el.tagName, 
            text: (el as HTMLElement).innerText, 
            id: el.id, 
            className: el.className 
        }))
        .filter(b => /solution|mark|scheme|answer|example|worked/i.test(b.text));
    });

    console.log('Found potential solution buttons:');
    console.log(JSON.stringify(buttons, null, 2));

    // Print text to see if solutions are already there but hidden
    const text = await page.innerText('body');
    console.log('--- CONTENT PREVIEW ---');
    console.log(text.substring(0, 2000));

  } catch (e) {
    console.error(`Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

run();
