import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
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
  
  const board = process.argv[2] || 'ocr';
  const outputDir = `content-library/${board}/longanswer`;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

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
    "network_hardware_topologies",
    "network_protocols",
    "networks_basics",
    "programming_fundamentals",
    "programming_data_structures",
    "programming_testing_and_robustness"
  ];

  for (const topic of topics) {
    const topicDir = path.join(outputDir, topic);
    if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

    for (const difficulty of ['standard', 'extension']) {
      const pdfPath = path.join(topicDir, `${difficulty}_full.pdf`);
      
      if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 50000) {
          console.log(`Skipping valid existing ${pdfPath}`);
          continue;
      }

      console.log(`>>> Starting ${board}/${topic} (${difficulty})`);
      
      let success = false;
      let attempt = 0;
      
      while (!success && attempt < 3) {
          attempt++;
          const context = await browser.newContext({ userAgent: userAgents[Math.floor(Math.random() * userAgents.length)] });
          const page = await context.newPage();
          
          try {
              let questionNum = 1;
              let allHtml = '<html><head><style>body { font-family: sans-serif; padding: 20px; } .question { margin-bottom: 50px; border-bottom: 3px solid #3498db; padding-bottom: 30px; } .truth { background: #f4f4f4; padding: 15px; border-left: 5px solid #27ae60; margin-top: 10px; }</style></head><body>';
              let validQuestions = 0;
              let hasMore = true;

              while (hasMore && questionNum <= 10) {
                  const url = `https://www.williamsphysics.co.uk/computerscience/gcse/${board}/longanswer/questions?q=${questionNum}&topic=${topic}&difficulty=${difficulty}`;
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

                  // VALIDATE AND EXTRACT
                  const data = await page.evaluate((q) => {
                      const body = document.body.innerText;
                      const hasTask = body.includes('Task');
                      const hasSolution = body.includes('Worked Solution') || body.includes('Mark Scheme');
                      const hasExample = body.includes('Example Answer');

                      if (!hasTask) return null;

                      // Clean UI
                      const nav = document.querySelector('nav');
                      const footer = document.querySelector('footer');
                      if (nav) nav.remove(); if (footer) footer.remove();

                      return {
                          html: `<div class="question"><h1>Question ${q}</h1>${document.body.innerHTML}</div>`,
                          isValid: hasSolution && hasExample
                      };
                  }, questionNum);

                  if (!data) {
                      hasMore = false;
                      break;
                  }

                  allHtml += data.html;
                  if (data.isValid) validQuestions++;
                  console.log(`      Q${questionNum} Extracted (Valid Ground Truth: ${data.isValid})`);

                  const nextBtn = await page.$('text="Next Question"');
                  if (nextBtn) {
                      questionNum++;
                      await page.waitForTimeout(3000);
                  } else {
                      hasMore = false;
                  }
              }

              if (validQuestions > 0) {
                  allHtml += '</body></html>';
                  const tempPath = path.join(topicDir, 'temp.html');
                  fs.writeFileSync(tempPath, allHtml);
                  await page.goto(`file://${path.resolve(tempPath)}`);
                  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
                  fs.unlinkSync(tempPath);
                  console.log(`    SUCCESS: Saved ${pdfPath} with ${validQuestions} valid questions.`);
                  success = true;
              } else {
                  console.log(`    FAILED: No valid ground truth found for ${topic} on attempt ${attempt}`);
              }

          } catch (e) {
              console.error(`    ERROR on attempt ${attempt}: ${e.message}`);
          } finally {
              await context.close();
              await new Promise(r => setTimeout(r, 15000)); // Cooldown
          }
      }
    }
  }
  await browser.close();
}

run();
