import { GlassSurface } from './GlassSurface';
import { X } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { GlassIntensity, Language, SearchEngine } from '../types';
import { UiCopy } from '../i18n';

interface SettingsPanelProps {
  copy: UiCopy;
  searchEngine: SearchEngine;
  glassIntensity: GlassIntensity;
  language: Language;
  onSearchEngineChange: (engine: SearchEngine) => void;
  onGlassIntensityChange: (intensity: GlassIntensity) => void;
  onLanguageChange: (language: Language) => void;
  backgroundImage: string | null;
  onBackgroundChange: (file: File) => void;
  onBackgroundClear: () => void;
  onReset: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  searchEngine,
  glassIntensity,
  language,
  onSearchEngineChange,
  onGlassIntensityChange,
  onLanguageChange,
  backgroundImage,
  onBackgroundChange,
  onBackgroundClear,
  onReset,
  onClose,
  copy,
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
            <span className="panel-kicker">{copy.preferences}</span>
            <h2>{copy.settings}</h2>
          </div>
          <button className="icon-button" type="button" aria-label={copy.closeSettings} onClick={onClose}>
            <MorphIcon icon={X} size={16} strokeWidth={1.8} reducedMotion="user" />
          </button>
        </div>

        <div className="settings-row">
          <label htmlFor="settings-search">{copy.searchEngine}</label>
          <select
            id="settings-search"
            value={searchEngine}
            onChange={(event) => onSearchEngineChange(event.target.value as SearchEngine)}
          >
            {Object.entries(copy.searchEngineNames).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label htmlFor="settings-glass">{copy.glassIntensity}</label>
          <select
            id="settings-glass"
            value={glassIntensity}
            onChange={(event) => onGlassIntensityChange(event.target.value as GlassIntensity)}
          >
            <option value="low">{copy.low}</option>
            <option value="normal">{copy.normal}</option>
            <option value="high">{copy.high}</option>
          </select>
        </div>

        <div className="settings-row">
          <label htmlFor="settings-language">{copy.language}</label>
          <select
            id="settings-language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as Language)}
          >
            <option value="en">{copy.english}</option>
            <option value="zh">{copy.chinese}</option>
          </select>
        </div>

        <div className="settings-background">
          <div className="settings-background-copy">
            <span>{copy.background}</span>
            <small>{backgroundImage ? copy.customImageActive : copy.darkGlassField}</small>
          </div>
          <div className="settings-background-actions">
            <label className="background-button" htmlFor="background-image">{copy.chooseImage}</label>
            {backgroundImage && (
              <button className="background-clear" type="button" onClick={onBackgroundClear}>
                {copy.remove}
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
          {copy.resetShortcuts}
        </button>
      </GlassSurface>
    </div>
  );
}
