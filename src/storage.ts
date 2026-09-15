import { AppState, Shortcut, createDefaultState } from './types';

const STORAGE_KEY = 'liquid-new-tab-state';
const MAX_BACKGROUND_DATA_LENGTH = 8_000_000;

type ChromeStorage = {
  get: (keys: string[]) => Promise<Record<string, unknown>>;
  set: (values: Record<string, unknown>) => Promise<void>;
};

const getChromeStorage = (): ChromeStorage | null => {
  const extensionChrome = (globalThis as typeof globalThis & {
    chrome?: { storage?: { local?: ChromeStorage } };
  }).chrome;

  return extensionChrome?.storage?.local ?? null;
};

const isShortcut = (value: unknown): value is Shortcut => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Shortcut>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    (item.faviconUrl === null || typeof item.faviconUrl === 'string') &&
    typeof item.position === 'number' &&
    typeof item.createdAt === 'number'
  );
};

export const sanitizeState = (value: unknown): AppState => {
  const fallback = createDefaultState();
  if (!value || typeof value !== 'object') return fallback;

  const candidate = value as Partial<AppState>;
  const preferences = candidate.preferences;
  const safeShortcuts = Array.isArray(candidate.shortcuts)
    ? candidate.shortcuts.filter(isShortcut).slice(0, 18)
    : [];

  return {
    version: 1,
    shortcuts: safeShortcuts.map((shortcut, index) => ({ ...shortcut, position: index })),
    preferences: {
      searchEngine:
        preferences?.searchEngine === 'bing' || preferences?.searchEngine === 'duckduckgo'
          ? preferences.searchEngine
          : 'google',
      glassIntensity:
        preferences?.glassIntensity === 'low' || preferences?.glassIntensity === 'high'
          ? preferences.glassIntensity
          : 'normal',
      backgroundImage:
        typeof preferences?.backgroundImage === 'string' &&
        preferences.backgroundImage.startsWith('data:image/') &&
        preferences.backgroundImage.length <= MAX_BACKGROUND_DATA_LENGTH
          ? preferences.backgroundImage
          : null,
    },
  };
};

export async function loadAppState(): Promise<{ state: AppState; usedFallback: boolean }> {
  try {
    const chromeStorage = getChromeStorage();
    if (chromeStorage) {
      const result = await chromeStorage.get([STORAGE_KEY]);
      return { state: sanitizeState(result[STORAGE_KEY]), usedFallback: false };
    }

    const localValue = window.localStorage.getItem(STORAGE_KEY);
    return {
      state: sanitizeState(localValue ? JSON.parse(localValue) : null),
      usedFallback: false,
    };
  } catch {
    return { state: createDefaultState(), usedFallback: true };
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  const chromeStorage = getChromeStorage();
  if (chromeStorage) {
    await chromeStorage.set({ [STORAGE_KEY]: state });
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
