import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

async function bypassCloudflare(page: Page, url: string) {
    console.log(`    Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(5000);
    
    let title = await page.title();
    let retry = 0;
    while (title.includes('Just a moment') && retry < 5) {
        console.log(`      Challenge detected (Attempt ${retry+1}). Waiting 25s...`);
        await page.waitForTimeout(25000);
        title = await page.title();
        retry++;
    }
    
    if (title.includes('Just a moment')) {
        throw new Error('Failed to bypass Cloudflare challenge');
    }
    return title;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const topic = "algorithms_trace_tables";
  const difficulty = "standard";
  const outputDir = 'content-library/ocr/longanswer';
  const topicDir = path.join(outputDir, topic);
  if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });
  const pdfPath = path.join(topicDir, `${difficulty}_full.pdf`);

  const context = await browser.newContext({ userAgent: userAgents[0] });
  const page = await context.newPage();
  
  try {
      let questionNum = 1;
      let allHtml = '<html><body>';
      const url = `https://www.williamsphysics.co.uk/computerscience/gcse/ocr/longanswer/questions?q=${questionNum}&topic=${topic}&difficulty=${difficulty}`;
      await bypassCloudflare(page, url);

      // CLICK REVEALS
      const buttons = ['Show Solution', 'Show Example Answer'];
      for (const b of buttons) {
          const btn = await page.$(`text="${b}"`);
          if (btn) {
              await btn.click();
              await page.waitForTimeout(1500);
          }
      }

      const data = await page.evaluate((q) => {
          const body = document.body.innerText;
          const hasTask = body.includes('Task');
          return {
              html: `<div class="question"><h1>Question ${q}</h1>${document.body.innerHTML}</div>`,
              hasTask
          };
      }, questionNum);

      console.log(`Extracted Q1: ${data.hasTask}`);
      if (data.hasTask) {
          allHtml += data.html + '</body></html>';
          fs.writeFileSync('test_extract.html', allHtml);
          console.log('Saved test_extract.html');
      }

  } catch (e) {
      console.error(`ERROR: ${e.message}`);
  } finally {
      await browser.close();
  }
}

run();
