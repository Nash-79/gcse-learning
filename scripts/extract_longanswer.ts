import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
];

type RunOptions = {
  board: string;
  topicFilter?: string[];
  difficultyFilter?: 'standard' | 'extension';
  maxQuestions: number;
  maxAttempts: number;
  headful: boolean;
  interactive: boolean;
  entry: 'landing' | 'direct';
  cfMaxWaitMs: number;
  cfStepMs: number;
  userDataDir?: string;
};

function parseArgs(argv: string[]): RunOptions {
  const board = argv[2] || 'ocr';
  let topicFilter: string[] | undefined;
  let difficultyFilter: 'standard' | 'extension' | undefined;
  let maxQuestions = 10;
  let maxAttempts = 3;
  let headful = !!process.env.HEADFUL;
  let interactive = false;
  let entry: 'landing' | 'direct' = 'landing';
  let cfMaxWaitMs = 2 * 60 * 1000;
  let cfStepMs = 25 * 1000;
  let userDataDir: string | undefined;

  for (let i = 3; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--topic' && argv[i + 1]) {
      topicFilter = argv[i + 1]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      i++;
      continue;
    }
    if (arg === '--difficulty' && argv[i + 1]) {
      const d = argv[i + 1];
      if (d === 'standard' || d === 'extension') difficultyFilter = d;
      i++;
      continue;
    }
    if (arg === '--max-questions' && argv[i + 1]) {
      const n = Number(argv[i + 1]);
      if (Number.isFinite(n) && n > 0) maxQuestions = n;
      i++;
      continue;
    }
    if (arg === '--attempts' && argv[i + 1]) {
      const n = Number(argv[i + 1]);
      if (Number.isFinite(n) && n > 0) maxAttempts = n;
      i++;
      continue;
    }
    if (arg === '--headful') {
      headful = true;
      continue;
    }
    if (arg === '--interactive') {
      interactive = true;
      headful = true;
      continue;
    }
    if (arg === '--entry' && argv[i + 1]) {
      const v = argv[i + 1];
      if (v === 'landing' || v === 'direct') entry = v;
      i++;
      continue;
    }
    if (arg === '--cf-max-wait-ms' && argv[i + 1]) {
      const n = Number(argv[i + 1]);
      if (Number.isFinite(n) && n > 0) cfMaxWaitMs = n;
      i++;
      continue;
    }
    if (arg === '--cf-step-ms' && argv[i + 1]) {
      const n = Number(argv[i + 1]);
      if (Number.isFinite(n) && n > 0) cfStepMs = n;
      i++;
      continue;
    }
    if (arg === '--user-data-dir' && argv[i + 1]) {
      userDataDir = argv[i + 1];
      i++;
      continue;
    }
  }

  return {
    board,
    topicFilter,
    difficultyFilter,
    maxQuestions,
    maxAttempts,
    headful,
    interactive,
    entry,
    cfMaxWaitMs,
    cfStepMs,
    userDataDir,
  };
}

async function isCloudflareChallenge(page: Page) {
  const title = (await page.title().catch(() => '')).toLowerCase();
  if (title.includes('just a moment') || title.includes('attention required') || title.includes('cloudflare')) {
    return true;
  }

  const count = await page
    .locator(
      '#cf-spinner, .cf-browser-verification, [data-cf-beacon], input[name="cf-turnstile-response"], text=/Just a moment/i, text=/checking your browser/i, text=/verify you are human/i',
    )
    .count()
    .catch(() => 0);
  return count > 0;
}

async function waitForEnter(prompt: string) {
  if (!process.stdin.isTTY) return;
  process.stdout.write(`${prompt}\n`);
  await new Promise<void>((resolve) => {
    process.stdin.resume();
    process.stdin.once('data', () => resolve());
  });
}

async function bypassCloudflare(page: Page, url: string, opts: Pick<RunOptions, 'interactive' | 'cfMaxWaitMs' | 'cfStepMs'>) {
  console.log(`    Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);

  const maxWaitMs = opts.cfMaxWaitMs;
  const stepMs = opts.cfStepMs;
  const start = Date.now();
  let attempt = 0;

  if (opts.interactive && (await isCloudflareChallenge(page))) {
    await waitForEnter('Cloudflare challenge detected. Solve it in the browser window, then press Enter here to continue.');
  }

  while (await isCloudflareChallenge(page)) {
    attempt++;
    const elapsed = Date.now() - start;
    if (elapsed > maxWaitMs) {
      throw new Error('Failed to bypass Cloudflare challenge');
    }
    console.log(`      Challenge detected (Attempt ${attempt}). Waiting ${Math.round(stepMs / 1000)}s...`);
    await page.waitForTimeout(stepMs);
  }
}

async function revealAnswers(page: Page) {
  const names: RegExp[] = [
    /show solution/i,
    /show worked solution/i,
    /show mark scheme/i,
    /show example answer/i,
    /show model answer/i,
  ];

  for (const name of names) {
    const locator = page.getByRole('button', { name }).first();
    if (await locator.count().catch(() => 0)) {
      await locator.click({ timeout: 5000 }).catch(() => undefined);
      await page.waitForTimeout(800);
    }
  }

  // Fallback for sites that use toggled/hidden sections.
  await page
    .evaluate(() => {
      for (const el of document.querySelectorAll('.solution, .model-answer, .mark-scheme, .worked-solution, .example-answer')) {
        (el as HTMLElement).style.display = 'block';
        (el as HTMLElement).style.visibility = 'visible';
        (el as HTMLElement).style.opacity = '1';
      }
    })
    .catch(() => undefined);
}

async function navigateToFirstQuestion(
  page: Page,
  board: string,
  topic: string,
  difficulty: 'standard' | 'extension',
  opts: Pick<RunOptions, 'entry' | 'interactive' | 'cfMaxWaitMs' | 'cfStepMs'>,
) {
  if (opts.entry === 'direct') {
    const url = `https://www.williamsphysics.co.uk/computerscience/gcse/${board}/longanswer/questions?q=1&topic=${topic}&difficulty=${difficulty}`;
    await bypassCloudflare(page, url, opts);
    return;
  }

  const landingUrl = `https://www.williamsphysics.co.uk/computerscience/gcse/${board}/longanswer`;
  await bypassCloudflare(page, landingUrl, opts);

  // The landing page uses a select + "STANDARD/EXTENSION" buttons + "Start Questions".
  await page.selectOption('select[name="topic"]', topic).catch(() => undefined);
  const diffLabel = difficulty === 'standard' ? 'STANDARD' : 'EXTENSION';
  await page.getByRole('button', { name: new RegExp(`^${diffLabel}$`, 'i') }).click().catch(() => undefined);

  // Some pages use links instead of buttons; handle both.
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => undefined),
    page.getByRole('button', { name: /start questions/i }).click().catch(async () => {
      await page.getByRole('link', { name: /start questions/i }).click().catch(() => undefined);
    }),
  ]);
}

async function run() {
  const opts = parseArgs(process.argv);
  const board = opts.board;
  const outputDir = `content-library/${board}/longanswer`;
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const launchArgs = ['--disable-blink-features=AutomationControlled'];
  const persistentContext = opts.userDataDir
    ? await chromium.launchPersistentContext(opts.userDataDir, {
        headless: opts.headful ? false : true,
        args: launchArgs,
      })
    : null;
  const browser = persistentContext
    ? null
    : await chromium.launch({
        headless: opts.headful ? false : true,
        args: launchArgs,
      });

  const topics = [
    'algorithms_searching_sorting',
    'algorithms_trace_tables',
    'boolean_logic',
    'character_sets',
    'computational_thinking',
    'cpu_architecture',
    'cyber_security_prevention',
    'cyber_security_threats',
    'data_representation_media',
    'data_representation_numbers',
    'embedded_systems',
    'fde_cycle_and_systems',
    'legal_ethical_environmental',
    'memory_and_storage',
    'network_hardware_topologies',
    'network_protocols',
    'networks_basics',
    'programming_fundamentals',
    'programming_data_structures',
    'programming_testing_and_robustness',
  ];

  const topicsToRun = opts.topicFilter && opts.topicFilter.length > 0 ? opts.topicFilter : topics;
  const difficultiesToRun: Array<'standard' | 'extension'> = opts.difficultyFilter
    ? [opts.difficultyFilter]
    : ['standard', 'extension'];

  for (const topic of topicsToRun) {
    const topicDir = path.join(outputDir, topic);
    if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

    for (const difficulty of difficultiesToRun) {
      const pdfPath = path.join(topicDir, `${difficulty}_full.pdf`);
      if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 50000) {
        console.log(`Skipping valid existing ${pdfPath}`);
        continue;
      }

      console.log(`>>> Starting ${board}/${topic} (${difficulty})`);

      let success = false;
      let attempt = 0;

      while (!success && attempt < opts.maxAttempts) {
        attempt++;
        const context = persistentContext
          ? persistentContext
          : await browser!.newContext({
              userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
              locale: 'en-GB',
            });

        await context.route('**/*', async (route) => {
          const type = route.request().resourceType();
          if (type === 'image' || type === 'font' || type === 'media') {
            await route.abort();
            return;
          }
          await route.continue();
        });

        const page = await context.newPage();

        try {
          let questionNum = 1;
          let extractedQuestions = 0;
          let validQuestions = 0;
          let hasMore = true;
          let blockedByCloudflare = false;

          let allHtml =
            '<html><head><style>body{font-family:sans-serif;padding:20px}.question{margin-bottom:50px;border-bottom:3px solid #3498db;padding-bottom:30px}pre{white-space:pre-wrap}</style></head><body>';

          try {
            await navigateToFirstQuestion(page, board, topic, difficulty, opts);
          } catch (e) {
            console.error(`      Blocked by Cloudflare at entry: ${e.message}`);
            blockedByCloudflare = true;
          }

          while (hasMore && questionNum <= opts.maxQuestions) {
            if (blockedByCloudflare) break;

            // For landing-entry runs, we arrive on Q1 already; for subsequent questions rely on Next navigation.
            if (questionNum > 1 || opts.entry === 'direct') {
              const url = `https://www.williamsphysics.co.uk/computerscience/gcse/${board}/longanswer/questions?q=${questionNum}&topic=${topic}&difficulty=${difficulty}`;
              try {
                await bypassCloudflare(page, url, opts);
              } catch (e) {
                console.error(`      Q${questionNum} blocked by Cloudflare: ${e.message}`);
                blockedByCloudflare = true;
                break;
              }
            }

            await revealAnswers(page);

            const data = await page.evaluate((q) => {
              const bodyText = document.body.innerText || '';
              const hasTask = /task\\b/i.test(bodyText) || /\\(\\s*\\d+\\s*marks\\s*\\)/i.test(bodyText);
              if (!hasTask) return null;

              const solutionEl =
                document.querySelector('.solution, .worked-solution, .mark-scheme') ||
                document.querySelector('[id^="solution-"], [id^="markscheme-"], [id^="marksheme-"]');
              const modelEl =
                document.querySelector('.model-answer, .example-answer') ||
                document.querySelector('[id^="model-"], [id^="example-"]');

              const solutionText = (solutionEl?.textContent || '').trim();
              const modelText = (modelEl?.textContent || '').trim();

              const solutionStyle = solutionEl ? window.getComputedStyle(solutionEl) : null;
              const modelStyle = modelEl ? window.getComputedStyle(modelEl) : null;
              const solutionVisible =
                !!solutionStyle &&
                solutionStyle.display !== 'none' &&
                solutionStyle.visibility !== 'hidden' &&
                parseFloat(solutionStyle.opacity || '1') > 0;
              const modelVisible =
                !!modelStyle &&
                modelStyle.display !== 'none' &&
                modelStyle.visibility !== 'hidden' &&
                parseFloat(modelStyle.opacity || '1') > 0;

              const hasSolution =
                !!solutionEl && solutionVisible && solutionText.replace(/show\\s+solution/i, '').trim().length > 40;
              const hasExample =
                !!modelEl &&
                modelVisible &&
                modelText.replace(/show\\s+example\\s+answer/i, '').trim().length > 40;

              document.querySelector('nav')?.remove();
              document.querySelector('footer')?.remove();
              document.querySelector('.top-actions')?.remove();
              document.querySelectorAll('script,noscript').forEach(el => el.remove());

              const main = document.querySelector('main') || document.querySelector('.container') || document.body;

              return {
                html: `<div class="question"><h1>Question ${q}</h1>${main.innerHTML}</div>`,
                isValid: hasSolution && hasExample,
              };
            }, questionNum);

            if (!data) {
              hasMore = false;
              break;
            }

            extractedQuestions++;
            if (data.isValid) validQuestions++;
            allHtml += data.html;
            console.log(`      Q${questionNum} Extracted (Valid Ground Truth: ${data.isValid})`);

            const nextBtn = await page.$('text="Next Question"');
            if (nextBtn) {
              questionNum++;
              await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => undefined),
                nextBtn.click().catch(() => undefined),
              ]);
              await page.waitForTimeout(1500);
            } else {
              hasMore = false;
            }
          }

          if (extractedQuestions > 0) {
            allHtml += '</body></html>';
            await page.setContent(allHtml, { waitUntil: 'load' });
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
            console.log(`    SUCCESS: Saved ${pdfPath} with ${validQuestions}/${extractedQuestions} valid questions.`);
            success = true;
          } else if (blockedByCloudflare) {
            console.log(`    BLOCKED: Cloudflare prevented extraction for ${topic} (${difficulty}) on attempt ${attempt}`);
          } else {
            console.log(`    FAILED: No questions extracted for ${topic} on attempt ${attempt}`);
          }
        } catch (e) {
          console.error(`    ERROR on attempt ${attempt}: ${e.message}`);
        } finally {
          await page.close().catch(() => undefined);
          if (!persistentContext) {
            await context.close();
          }
          await new Promise(r => setTimeout(r, 15000)); // Cooldown
        }
      }
    }
  }

  if (persistentContext) {
    await persistentContext.close();
  } else {
    await browser!.close();
  }
}

run();
