export function hasStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage write failures in restricted browser contexts.
  }
}

export function readStore<T>(key: string, fallback: T): T {
  if (!hasStorage()) {
    return fallback;
  }
  const raw = safeGetItem(key);
  if (!raw) {
    safeSetItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    safeSetItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  if (!hasStorage()) {
    return;
  }
  safeSetItem(key, JSON.stringify(value));
}

export function nextId(prefix: string, ids: string[]): string {
  const max = ids.reduce((highest, id) => {
    const n = Number(id.replace(/[^0-9]/g, ''));
    return Number.isNaN(n) ? highest : Math.max(highest, n);
  }, 0);
  return `${prefix}-${max + 1}`;
}
