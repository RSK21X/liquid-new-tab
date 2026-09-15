import { FormEvent, useEffect, useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { CommandMenu } from './CommandMenu';
import { GlassSurface } from './GlassSurface';
import { GlassIntensity, SearchEngine } from '../types';

export type LensMode = 'rest' | 'search' | 'add';

interface SearchLensProps {
  mode: LensMode;
  query: string;
  addUrl: string;
  addTitle: string;
  addError: string;
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  onOpenSearch: () => void;
  onQueryChange: (value: string) => void;
  onNavigate: (event: FormEvent<HTMLFormElement>) => void;
  onAddUrlChange: (value: string) => void;
  onAddTitleChange: (value: string) => void;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onOpenCommand: (command: 'edit' | 'theme' | 'settings') => void;
  onPointerMove: (x: number, y: number) => void;
}

export function SearchLens({
  mode,
  query,
  addUrl,
  addTitle,
  addError,
  searchEngine,
  glassIntensity,
  onOpenSearch,
  onQueryChange,
  onNavigate,
  onAddUrlChange,
  onAddTitleChange,
  onAdd,
  onClose,
  onOpenCommand,
  onPointerMove,
}: SearchLensProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== 'rest') inputRef.current?.focus();
  }, [mode]);

  const updateHighlight = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    onPointerMove(
      Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
      Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
    );
  };

  return (
    <div className={`lens-wrap lens-${mode}`} onPointerMove={updateHighlight}>
      <GlassSurface
        className="lens-surface"
        variant={mode === 'add' ? 'menu' : 'lens'}
        intensity={glassIntensity}
        interactive
      >
        {mode === 'rest' && (
          <button className="lens-rest-button" type="button" onClick={onOpenSearch}>
            <span className="search-glyph" aria-hidden="true">
              <MorphIcon icon={Search} size={20} strokeWidth={1.8} reducedMotion="user" />
            </span>
            <span>Search</span>
            <span className="lens-key" aria-hidden="true">
              /
            </span>
          </button>
        )}

        {mode === 'search' && (
          <form className="lens-form" onSubmit={onNavigate}>
            <label className="sr-only" htmlFor="search-input">
              Search the web
            </label>
            <span className="search-glyph" aria-hidden="true">
              <MorphIcon icon={Search} size={20} strokeWidth={1.8} reducedMotion="user" />
            </span>
            <input
              ref={inputRef}
              id="search-input"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  onClose();
                }
              }}
              placeholder="Search anything..."
              autoComplete="off"
              spellCheck={false}
            />
            <button className="lens-submit" type="submit" aria-label="Search or navigate">
              <MorphIcon icon={ArrowRight} size={17} strokeWidth={1.8} reducedMotion="user" />
            </button>
            <div className="lens-meta">
              <span>{searchEngine === 'duckduckgo' ? 'DuckDuckGo' : searchEngine[0].toUpperCase() + searchEngine.slice(1)}</span>
              <span>@g &nbsp; @yt &nbsp; @gh</span>
            </div>
          </form>
        )}

        {mode === 'add' && (
          <form className="add-form" onSubmit={onAdd}>
            <div className="add-form-heading">
              <span className="add-kicker">New shortcut</span>
              <button type="button" className="icon-button" aria-label="Close add shortcut" onClick={onClose}>
                <MorphIcon icon={X} size={16} strokeWidth={1.8} reducedMotion="user" />
              </button>
            </div>
            <label htmlFor="shortcut-url">Website URL</label>
            <input
              ref={inputRef}
              id="shortcut-url"
              value={addUrl}
              onChange={(event) => onAddUrlChange(event.target.value)}
              placeholder="https://example.com"
              autoComplete="url"
              spellCheck={false}
            />
            <label htmlFor="shortcut-title">Name <span>(optional)</span></label>
            <input
              id="shortcut-title"
              value={addTitle}
              onChange={(event) => onAddTitleChange(event.target.value)}
              placeholder="Example"
              autoComplete="off"
            />
            {addError && <p className="form-error" role="alert">{addError}</p>}
            <button className="add-submit" type="submit">
              Add shortcut
            </button>
          </form>
        )}
      </GlassSurface>
      {mode === 'search' && query.trim().startsWith('>') && <CommandMenu onSelect={onOpenCommand} />}
    </div>
  );
}
