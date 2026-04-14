import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Severity = "info" | "review_required" | "high";
type EventStatus = "new" | "acknowledged" | "resolved";

interface WatchSource {
  sourceName: string;
  sourceUrl: string;
}

interface WatchEvent {
  sourceName: string;
  sourceUrl: string;
  detectedAt: string;
  changeFingerprint: string;
  severity: Severity;
  status: EventStatus;
  note?: string;
}

interface CacheRecord {
  fingerprint: string;
  checkedAt: string;
}

const SOURCES: WatchSource[] = [
  { sourceName: "OCR J277", sourceUrl: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/" },
  { sourceName: "AQA 8525", sourceUrl: "https://filestore.aqa.org.uk/resources/computing/specifications/AQA-8525-SP-2020.PDF" },
  { sourceName: "Pearson 1CP2", sourceUrl: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/computer-science-2020.html" },
  { sourceName: "DfE CS Subject Content", sourceUrl: "https://www.gov.uk/government/publications/gcse-computer-science/gcse-subject-content-for-computer-science" },
  { sourceName: "Ofqual GCSE Register", sourceUrl: "https://register.ofqual.gov.uk/" },
];

const TMP_DIR = resolve(process.cwd(), ".tmp");
const CACHE_PATH = resolve(TMP_DIR, "curriculum-watch-cache.json");
const EVENTS_PATH = resolve(TMP_DIR, "curriculum-watch-events.json");

function loadCache(): Record<string, CacheRecord> {
  try {
    const raw = readFileSync(CACHE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, CacheRecord>) {
  writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

function saveEvents(events: WatchEvent[]) {
  writeFileSync(EVENTS_PATH, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

function fingerprintFromResponse(response: Response, bodyText: string): string {
  const etag = response.headers.get("etag") || "";
  const lastModified = response.headers.get("last-modified") || "";
  const contentLength = response.headers.get("content-length") || "";
  const sample = bodyText.slice(0, 256).replace(/\s+/g, " ").trim();
  return [response.status, etag, lastModified, contentLength, sample].join("|");
}

async function fetchFingerprint(url: string): Promise<{ fingerprint: string; note?: string }> {
  let response = await fetch(url, { method: "HEAD" });
  if (!response.ok) {
    response = await fetch(url, { method: "GET" });
  }
  const text = response.ok ? await response.text() : "";
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return { fingerprint: fingerprintFromResponse(response, text) };
}

async function main() {
  mkdirSync(TMP_DIR, { recursive: true });
  const now = new Date().toISOString();
  const cache = loadCache();
  const events: WatchEvent[] = [];
  let hasFailure = false;

  for (const source of SOURCES) {
    try {
      const { fingerprint } = await fetchFingerprint(source.sourceUrl);
      const previous = cache[source.sourceName]?.fingerprint || "";
      if (!previous) {
        events.push({
          sourceName: source.sourceName,
          sourceUrl: source.sourceUrl,
          detectedAt: now,
          changeFingerprint: fingerprint,
          severity: "info",
          status: "new",
          note: "Initial baseline fingerprint recorded",
        });
      } else if (previous !== fingerprint) {
        events.push({
          sourceName: source.sourceName,
          sourceUrl: source.sourceUrl,
          detectedAt: now,
          changeFingerprint: fingerprint,
          severity: "review_required",
          status: "new",
          note: "Source changed since last run",
        });
      }
      cache[source.sourceName] = { fingerprint, checkedAt: now };
    } catch (error: any) {
      hasFailure = true;
      events.push({
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        detectedAt: now,
        changeFingerprint: "error",
        severity: "high",
        status: "new",
        note: error?.message || "Unknown watch error",
      });
    }
  }

  saveCache(cache);
  saveEvents(events);

  console.log(`curriculum:watch completed with ${events.length} event(s)`);
  for (const event of events) {
    console.log(`- [${event.severity}] ${event.sourceName}: ${event.note || "event recorded"}`);
  }

  if (hasFailure) {
    console.error("curriculum:watch encountered source fetch failures");
    process.exit(1);
  }
}

void main();
