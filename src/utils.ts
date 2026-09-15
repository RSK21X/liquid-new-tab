import { SearchEngine } from './types';

export const searchEngineUrls: Record<SearchEngine, (query: string) => string> = {
  google: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  bing: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  duckduckgo: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
};

const shortcutSearchUrls: Record<string, (query: string) => string> = {
  g: (query) => searchEngineUrls.google(query),
  yt: (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  gh: (query) => `https://github.com/search?q=${encodeURIComponent(query)}`,
};

export function looksLikeUrl(value: string): boolean {
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i.test(value.trim());
}

export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return null;
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function titleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '');
    const firstPart = hostname.split('.')[0] || hostname;
    const knownTitles: Record<string, string> = {
      github: 'GitHub',
      youtube: 'YouTube',
      gmail: 'Gmail',
      chatgpt: 'ChatGPT',
      duckduckgo: 'DuckDuckGo',
      linkedin: 'LinkedIn',
      notion: 'Notion',
    };
    if (knownTitles[firstPart.toLowerCase()]) return knownTitles[firstPart.toLowerCase()];
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
  } catch {
    return 'Website';
  }
}

const simpleIconHosts: Record<string, string> = {
  'apple.com': 'apple',
  'amazon.com': 'amazon',
  'behance.net': 'behance',
  'discord.com': 'discord',
  'dribbble.com': 'dribbble',
  'figma.com': 'figma',
  'github.com': 'github',
  'gmail.com': 'gmail',
  'google.com': 'google',
  'linkedin.com': 'linkedin',
  'linear.app': 'linear',
  'netflix.com': 'netflix',
  'notion.so': 'notion',
  'npmjs.com': 'npm',
  'reddit.com': 'reddit',
  'slack.com': 'slack',
  'spotify.com': 'spotify',
  'telegram.org': 'telegram',
  'twitch.tv': 'twitch',
  'twitter.com': 'x',
  'vercel.com': 'vercel',
  'wikipedia.org': 'wikipedia',
  'x.com': 'x',
  'youtube.com': 'youtube',
};

export function brandIconForUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
    const matchedHost = Object.keys(simpleIconHosts).find(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
    const slug = matchedHost ? simpleIconHosts[matchedHost] : null;
    return slug ? `https://cdn.simpleicons.org/${slug}/e9f1ef` : null;
  } catch {
    return null;
  }
}

export function getNavigationTarget(input: string, engine: SearchEngine): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (looksLikeUrl(trimmed)) return normalizeUrl(trimmed);

  const prefixMatch = trimmed.match(/^@(g|yt|gh)\s+(.+)$/i);
  if (prefixMatch) {
    const builder = shortcutSearchUrls[prefixMatch[1].toLowerCase()];
    return builder?.(prefixMatch[2].trim()) ?? null;
  }

  return searchEngineUrls[engine](trimmed);
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
