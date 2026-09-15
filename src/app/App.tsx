import { FormEvent, useEffect, useRef, useState } from 'react';
import { Settings, Undo2 } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { GlassSurface } from '../components/GlassSurface';
import { Orbit } from '../components/Orbit';
import { LensMode, SearchLens } from '../components/SearchLens';
import { SettingsPanel } from '../components/SettingsPanel';
import { loadAppState, saveAppState } from '../storage';
import {
  AppState,
  GlassIntensity,
  SearchEngine,
  Shortcut,
  ThemeMode,
  createDefaultState,
  SEARCH_ENGINE_LABELS,
} from '../types';
import { createId, faviconForUrl, getNavigationTarget, looksLikeUrl, normalizeUrl, titleFromUrl } from '../utils';

interface RemovedShortcut {
  shortcut: Shortcut;
  index: number;
}

export function App() {
  const [appState, setAppState] = useState<AppState>(createDefaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<LensMode>('rest');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [query, setQuery] = useState('');
  const [addUrl, setAddUrl] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addError, setAddError] = useState('');
  const [orbitOffset, setOrbitOffset] = useState(0);
  const [removedShortcut, setRemovedShortcut] = useState<RemovedShortcut | null>(null);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);
  const removeTimer = useRef<number | null>(null);

  useEffect(() => {
    loadAppState().then(({ state, usedFallback }) => {
      setAppState(state);
      setStorageNotice(usedFallback ? 'Local defaults loaded' : null);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveAppState(appState).catch(() => setStorageNotice('Changes stay in this tab only'));
  }, [appState, isLoaded]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = appState.preferences.theme;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateThemeColor = () => {
      const dark = appState.preferences.theme === 'dark' || (appState.preferences.theme === 'system' && media.matches);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#080b11' : '#eef3f2');
    };
    updateThemeColor();
    media.addEventListener('change', updateThemeColor);
    return () => media.removeEventListener('change', updateThemeColor);
  }, [appState.preferences.theme]);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (event.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        if (mode !== 'rest') {
          closeLens();
          return;
        }
        if (isEditing) {
          setIsEditing(false);
          return;
        }
      }

      if (event.key === '/' && !typing && mode === 'rest' && !isEditing && !showSettings) {
        event.preventDefault();
        setMode('search');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    return () => {
      if (removeTimer.current) window.clearTimeout(removeTimer.current);
    };
  }, []);

  const closeLens = () => {
    setMode('rest');
    setQuery('');
    setAddUrl('');
    setAddTitle('');
    setAddError('');
  };

  const openSearch = () => {
    setShowSettings(false);
    setMode('search');
    setQuery('');
  };

  const openAdd = () => {
    setShowSettings(false);
    setMode('add');
    setAddUrl('');
    setAddTitle('');
    setAddError('');
  };

  const navigate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = query.trim().slice(1).trim().toLowerCase();
    if (query.trim().startsWith('>') && ['edit', 'theme', 'settings'].includes(command)) {
      selectCommand(command as 'edit' | 'theme' | 'settings');
      return;
    }
    const target = getNavigationTarget(query, appState.preferences.searchEngine);
    if (target) window.location.assign(target);
  };

  const selectCommand = (command: 'edit' | 'theme' | 'settings') => {
    if (command === 'edit') {
      setIsEditing(true);
      closeLens();
      return;
    }
    setShowSettings(true);
    closeLens();
    if (command === 'theme') {
      setTimeout(() => document.getElementById('settings-theme')?.focus(), 0);
    }
  };

  const addShortcut = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUrl = normalizeUrl(addUrl);
    if (!normalizedUrl || !looksLikeUrl(addUrl)) {
      setAddError("That URL doesn't look right.");
      return;
    }
    if (appState.shortcuts.length >= 18) {
      setAddError('Your orbit is full. Remove one shortcut first.');
      return;
    }
    if (appState.shortcuts.some((shortcut) => shortcut.url === normalizedUrl)) {
      setAddError('That shortcut is already here.');
      return;
    }

    const shortcut: Shortcut = {
      id: createId(),
      title: addTitle.trim() || titleFromUrl(normalizedUrl),
      url: normalizedUrl,
      faviconUrl: faviconForUrl(normalizedUrl),
      position: appState.shortcuts.length,
      createdAt: Date.now(),
    };

    setAppState((current) => ({ ...current, shortcuts: [...current.shortcuts, shortcut] }));
    closeLens();
  };

  const openShortcut = (shortcut: Shortcut) => {
    if (isEditing) return;
    window.location.assign(shortcut.url);
  };

  const enterEdit = () => {
    setShowSettings(false);
    setIsEditing(true);
    closeLens();
  };

  const deleteShortcut = (index: number) => {
    const shortcut = appState.shortcuts[index];
    if (!shortcut) return;
    setAppState((current) => ({
      ...current,
      shortcuts: current.shortcuts
        .filter((_, currentIndex) => currentIndex !== index)
        .map((item, currentIndex) => ({ ...item, position: currentIndex })),
    }));
    setRemovedShortcut({ shortcut, index });
    if (removeTimer.current) window.clearTimeout(removeTimer.current);
    removeTimer.current = window.setTimeout(() => setRemovedShortcut(null), 3000);
  };

  const undoDelete = () => {
    if (!removedShortcut) return;
    setAppState((current) => {
      const shortcuts = [...current.shortcuts];
      shortcuts.splice(Math.min(removedShortcut.index, shortcuts.length), 0, removedShortcut.shortcut);
      return { ...current, shortcuts: shortcuts.map((item, index) => ({ ...item, position: index })) };
    });
    setRemovedShortcut(null);
    if (removeTimer.current) window.clearTimeout(removeTimer.current);
  };

  const moveShortcut = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= appState.shortcuts.length || to >= appState.shortcuts.length) return;
    setAppState((current) => {
      const shortcuts = [...current.shortcuts];
      const [moving] = shortcuts.splice(from, 1);
      shortcuts.splice(to, 0, moving);
      return { ...current, shortcuts: shortcuts.map((item, index) => ({ ...item, position: index })) };
    });
  };

  const rotateOrbit = (direction: 1 | -1) => {
    setOrbitOffset((current) => {
      if (appState.shortcuts.length <= 6) return 0;
      const next = current + direction;
      return (next + appState.shortcuts.length) % appState.shortcuts.length;
    });
  };

  const updatePreference = <K extends keyof AppState['preferences']>(key: K, value: AppState['preferences'][K]) => {
    setAppState((current) => ({
      ...current,
      preferences: { ...current.preferences, [key]: value },
    }));
  };

  const resetShortcuts = () => {
    if (!window.confirm('Reset all shortcuts?')) return;
    setAppState((current) => ({ ...current, shortcuts: [] }));
    setOrbitOffset(0);
    setShowSettings(false);
  };

  const handleAddUrlChange = (value: string) => {
    const previousNormalized = normalizeUrl(addUrl);
    const previousInferredTitle = previousNormalized ? titleFromUrl(previousNormalized) : '';
    setAddUrl(value);
    setAddError('');
    const normalized = normalizeUrl(value);
    if (normalized && looksLikeUrl(value)) {
      setAddTitle((current) => (!current || current === previousInferredTitle ? titleFromUrl(normalized) : current));
    }
  };

  const pointerMove = (x: number, y: number) => {
    document.documentElement.style.setProperty('--lens-highlight-x', `${x}%`);
    document.documentElement.style.setProperty('--lens-highlight-y', `${y}%`);
  };

  const activeEngineLabel = SEARCH_ENGINE_LABELS[appState.preferences.searchEngine];

  return (
    <main className={`app-shell glass-${appState.preferences.glassIntensity}`}>
      <div className="ambient-field" aria-hidden="true" />
      <div className="pointer-field" aria-hidden="true" />

      <header className="topbar">
        <span className="product-mark">LIQUID</span>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            closeLens();
            setShowSettings(true);
          }}
          aria-label="Open settings"
        >
          <MorphIcon icon={Settings} size={15} strokeWidth={1.8} reducedMotion="user" />
          <span>Settings</span>
        </button>
      </header>

      <section className="scene" aria-label="Liquid New Tab">
        <div className="orbit-stage">
          <Orbit
            shortcuts={appState.shortcuts}
            isEditing={isEditing}
            isSearching={mode === 'search' || mode === 'add'}
            offset={orbitOffset}
            onRotate={rotateOrbit}
            onOpen={openShortcut}
            onEnterEdit={enterEdit}
            onDelete={deleteShortcut}
            onMove={moveShortcut}
            onAdd={openAdd}
          />

          <SearchLens
            mode={mode}
            query={query}
            addUrl={addUrl}
            addTitle={addTitle}
            addError={addError}
            searchEngine={appState.preferences.searchEngine}
            glassIntensity={appState.preferences.glassIntensity}
            onOpenSearch={openSearch}
            onQueryChange={setQuery}
            onNavigate={navigate}
            onAddUrlChange={handleAddUrlChange}
            onAddTitleChange={setAddTitle}
            onAdd={addShortcut}
            onClose={closeLens}
            onOpenCommand={selectCommand}
            onPointerMove={pointerMove}
          />
        </div>

        {appState.shortcuts.length === 0 && mode === 'rest' && !isEditing && (
          <div className="empty-copy">
            <p>Add your first shortcut</p>
            <span>Click any plus to begin</span>
          </div>
        )}
      </section>

      <div className="bottom-left-hint">
        <span className="hint-key">/</span>
        <span>Search</span>
      </div>

      <div className="bottom-right-controls">
        {isEditing ? (
          <button className="control-button control-primary" type="button" onClick={() => setIsEditing(false)}>
            Done
          </button>
        ) : (
          <button className="control-button" type="button" onClick={enterEdit}>
            Edit shortcuts
          </button>
        )}
      </div>

      {showSettings && (
        <SettingsPanel
          theme={appState.preferences.theme}
          searchEngine={appState.preferences.searchEngine}
          glassIntensity={appState.preferences.glassIntensity}
          onThemeChange={(value: ThemeMode) => updatePreference('theme', value)}
          onSearchEngineChange={(value: SearchEngine) => updatePreference('searchEngine', value)}
          onGlassIntensityChange={(value: GlassIntensity) => updatePreference('glassIntensity', value)}
          onReset={resetShortcuts}
          onClose={() => setShowSettings(false)}
        />
      )}

      {removedShortcut && (
        <GlassSurface className="undo-toast" variant="tooltip" intensity={appState.preferences.glassIntensity}>
          <span>Removed {removedShortcut.shortcut.title}</span>
          <button type="button" onClick={undoDelete}>
            <MorphIcon icon={Undo2} size={14} strokeWidth={1.8} reducedMotion="user" />
            <span>Undo</span>
          </button>
        </GlassSurface>
      )}

      {storageNotice && <p className="storage-notice" role="status">{storageNotice}</p>}
      <p className="privacy-note">Local first. No account, no tracking.</p>
      <span className="sr-only">Default search engine: {activeEngineLabel}</span>
    </main>
  );
}
