export type ThemeMode = 'system' | 'dark' | 'light';
export type SearchEngine = 'google' | 'bing' | 'duckduckgo';
export type GlassIntensity = 'low' | 'normal' | 'high';

export interface Shortcut {
  id: string;
  title: string;
  url: string;
  faviconUrl: string | null;
  position: number;
  createdAt: number;
}

export interface Preferences {
  theme: ThemeMode;
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
}

export interface AppState {
  version: 1;
  shortcuts: Shortcut[];
  preferences: Preferences;
}

export const createDefaultState = (): AppState => ({
  version: 1,
  shortcuts: [],
  preferences: {
    theme: 'system',
    searchEngine: 'google',
    glassIntensity: 'normal',
  },
});

export const SEARCH_ENGINE_LABELS: Record<SearchEngine, string> = {
  google: 'Google',
  bing: 'Bing',
  duckduckgo: 'DuckDuckGo',
};
