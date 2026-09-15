import { GlassSurface } from './GlassSurface';
import { X } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { GlassIntensity, SearchEngine, SEARCH_ENGINE_LABELS } from '../types';

interface SettingsPanelProps {
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  onSearchEngineChange: (engine: SearchEngine) => void;
  onGlassIntensityChange: (intensity: GlassIntensity) => void;
  backgroundImage: string | null;
  onBackgroundChange: (file: File) => void;
  onBackgroundClear: () => void;
  onReset: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  searchEngine,
  glassIntensity,
  onSearchEngineChange,
  onGlassIntensityChange,
  backgroundImage,
  onBackgroundChange,
  onBackgroundClear,
  onReset,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={onClose}>
      <GlassSurface
        className="settings-panel"
        variant="menu"
        intensity={glassIntensity}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">Preferences</span>
            <h2>Settings</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close settings" onClick={onClose}>
            <MorphIcon icon={X} size={16} strokeWidth={1.8} reducedMotion="user" />
          </button>
        </div>

        <div className="settings-row">
          <label htmlFor="settings-search">Search engine</label>
          <select
            id="settings-search"
            value={searchEngine}
            onChange={(event) => onSearchEngineChange(event.target.value as SearchEngine)}
          >
            {Object.entries(SEARCH_ENGINE_LABELS).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label htmlFor="settings-glass">Glass intensity</label>
          <select
            id="settings-glass"
            value={glassIntensity}
            onChange={(event) => onGlassIntensityChange(event.target.value as GlassIntensity)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="settings-background">
          <div className="settings-background-copy">
            <span>Background</span>
            <small>{backgroundImage ? 'Custom image active' : 'Dark glass field'}</small>
          </div>
          <div className="settings-background-actions">
            <label className="background-button" htmlFor="background-image">Choose image</label>
            {backgroundImage && (
              <button className="background-clear" type="button" onClick={onBackgroundClear}>
                Remove
              </button>
            )}
          </div>
          <input
            className="sr-only"
            id="background-image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onBackgroundChange(file);
              event.currentTarget.value = '';
            }}
          />
        </div>

        <button className="reset-button" type="button" onClick={onReset}>
          Reset shortcuts
        </button>
      </GlassSurface>
    </div>
  );
}
