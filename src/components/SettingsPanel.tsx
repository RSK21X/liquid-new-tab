import { GlassSurface } from './GlassSurface';
import { X } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { GlassIntensity, SearchEngine, ThemeMode, SEARCH_ENGINE_LABELS } from '../types';

interface SettingsPanelProps {
  theme: ThemeMode;
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  onThemeChange: (theme: ThemeMode) => void;
  onSearchEngineChange: (engine: SearchEngine) => void;
  onGlassIntensityChange: (intensity: GlassIntensity) => void;
  onReset: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  theme,
  searchEngine,
  glassIntensity,
  onThemeChange,
  onSearchEngineChange,
  onGlassIntensityChange,
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
          <label htmlFor="settings-theme">Appearance</label>
          <select
            id="settings-theme"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value as ThemeMode)}
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
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

        <button className="reset-button" type="button" onClick={onReset}>
          Reset shortcuts
        </button>
      </GlassSurface>
    </div>
  );
}
