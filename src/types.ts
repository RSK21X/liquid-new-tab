export type SearchEngine = 'google' | 'bing' | 'duckduckgo';
export type GlassIntensity = 'low' | 'normal' | 'high';
export type Language = 'en' | 'zh';

export interface Shortcut {
  id: string;
  title: string;
  url: string;
  faviconUrl: string | null;
  position: number;
  createdAt: number;
}

export interface Preferences {
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  language: Language;
  backgroundImage: string | null;
}

export interface AppState {
  version: 1;
  shortcuts: Shortcut[];
  preferences: Preferences;
}

export const detectLanguage = (): Language => {
  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return browserLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

export const createDefaultState = (): AppState => ({
  version: 1,
  shortcuts: [],
  preferences: {
    searchEngine: 'google',
    glassIntensity: 'normal',
    language: detectLanguage(),
    backgroundImage: null,
  },
});

export const SEARCH_ENGINE_LABELS: Record<SearchEngine, string> = {
  google: 'Google',
  bing: 'Bing',
  duckduckgo: 'DuckDuckGo',
};
