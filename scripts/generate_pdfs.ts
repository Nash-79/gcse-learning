import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
];

const topics = [
  "algorithms_searching_sorting",
  "algorithms_trace_tables",
  "boolean_logic",
  "character_sets",
  "computational_thinking",
  "cpu_architecture",
  "cyber_security_prevention",
  "cyber_security_threats",
  "data_representation_media",
  "data_representation_numbers",
  "embedded_systems",
  "fde_cycle_and_systems",
  "legal_ethical_environmental",
  "memory_and_storage",
  "networks_basics",
  "network_protocols",
  "programming_fundamentals",
  "programming_data_structures",
  "programming_testing_and_robustness"
];

const boards = ["aqa", "edexcel", "ocr"];

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  const outputDir = 'content-library';
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const board of boards) {
    const boardDir = path.join(outputDir, board);
    if (!fs.existsSync(boardDir)) fs.mkdirSync(boardDir);

    const categories = ["textbook", "assessments"];
    for (const category of categories) {
      const categoryDir = path.join(boardDir, category);
      if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir);

      for (const topic of topics) {
        let urls = [];
        if (category === "textbook") {
          urls.push(`https://www.williamsphysics.co.uk/computerscience/gcse/${board}/textbook/${topic}`);
        } else {
          // Add 3 papers for each assessment topic
          urls.push(`https://www.williamsphysics.co.uk/computerscience/gcse/${board}/assessments/${topic}/test?paper=1`);
          urls.push(`https://www.williamsphysics.co.uk/computerscience/gcse/${board}/assessments/${topic}/test?paper=2`);
          urls.push(`https://www.williamsphysics.co.uk/computerscience/gcse/${board}/assessments/${topic}/test?paper=3`);
        }

        for (const url of urls) {
          const urlObj = new URL(url);
          const paper = urlObj.searchParams.get('paper');
          const fileName = paper ? `${topic}_set${paper}.pdf` : `${topic}.pdf`;
          const pdfPath = path.join(categoryDir, fileName);

          if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 100000) {
              console.log(`Skipping valid existing ${pdfPath}`);
              continue;
          }

          console.log(`Processing ${url}...`);

          const context = await browser.newContext({
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          });
          const page = await context.newPage();

          try {
            await page.goto(url, { waitUntil: 'load', timeout: 90000 });
            
            let title = await page.title();
            let retryCount = 0;
            while (title.includes('Just a moment') && retryCount < 5) {
              console.log(`Challenge detected for ${url}. Waiting ${20 + retryCount * 10}s...`);
              await page.waitForTimeout((20 + retryCount * 10) * 1000);
              title = await page.title();
              retryCount++;
            }

            if (title.includes('Just a moment')) {
              console.error(`Failed to bypass challenge for ${url}`);
              await context.close();
              continue;
            }

            await page.waitForTimeout(5000 + Math.random() * 5000);

            await page.pdf({ 
              path: pdfPath, 
              format: 'A4',
              margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
              printBackground: true
            });
            
            const size = fs.statSync(pdfPath).size;
            if (size < 100000) {
                console.log(`Warning: ${pdfPath} is small (${size} bytes). Might still be a challenge page.`);
            } else {
                console.log(`Successfully saved ${pdfPath} (${size} bytes)`);
            }
            
          } catch (e) {
            console.error(`Error processing ${url}: ${e.message}`);
          } finally {
            await context.close();
            // Randomized long delay between pages
            const delay = 15000 + Math.random() * 15000;
            console.log(`Cooling down for ${Math.round(delay/1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }
  }

  await browser.close();
}

run();
