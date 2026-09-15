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
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  backgroundImage: string | null;
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
    searchEngine: 'google',
    glassIntensity: 'normal',
    backgroundImage: null,
  },
});

export const SEARCH_ENGINE_LABELS: Record<SearchEngine, string> = {
  google: 'Google',
  bing: 'Bing',
  duckduckgo: 'DuckDuckGo',
};
