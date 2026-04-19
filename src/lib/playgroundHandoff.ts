// Small helper for handing Python snippets from chat to the Playground.
// SessionStorage is the primary channel (survives route changes without
// polluting URLs or history). A tiny URL param is the secondary trigger so
// Playground knows to read the key on mount.

const STORAGE_KEY = "pylearn:incoming-code";
const QUERY_FLAG = "fromChat";

// Hard cap to avoid writing megabytes into sessionStorage if a model ever
// returns a pathological snippet.
const MAX_BYTES = 20_000;

export function stashPlaygroundCode(code: string): boolean {
  if (!code) return false;
  const truncated = code.length > MAX_BYTES ? code.slice(0, MAX_BYTES) : code;
  try {
    sessionStorage.setItem(STORAGE_KEY, truncated);
    return true;
  } catch {
    return false;
  }
}

export function readAndClearPlaygroundCode(): string | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value) sessionStorage.removeItem(STORAGE_KEY);
    return value;
  } catch {
    return null;
  }
}

export const PLAYGROUND_QUERY_FLAG = QUERY_FLAG;
