import { DragEvent, KeyboardEvent, useState } from 'react';
import { Globe2, Plus, X } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import { GlassSurface } from './GlassSurface';
import { Shortcut } from '../types';
import { brandIconForUrl } from '../utils';

const orbitAngles = [-90, -30, 30, 90, 150, 210];

interface OrbitProps {
  shortcuts: Shortcut[];
  isEditing: boolean;
  isSearching: boolean;
  offset: number;
  onRotate: (direction: 1 | -1) => void;
  onOpen: (shortcut: Shortcut) => void;
  onEnterEdit: () => void;
  onDelete: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onAdd: () => void;
}

function Favicon({ shortcut }: { shortcut: Shortcut }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iconUrl = brandIconForUrl(shortcut.url);
  const fallbackIcon = (
    <span className={`favicon-fallback${loaded ? ' favicon-fallback-hidden' : ''}`}>
      <MorphIcon icon={Globe2} size={21} strokeWidth={1.55} reducedMotion="user" />
    </span>
  );

  if (failed || !iconUrl) {
    return <span className="favicon-frame" aria-hidden="true">{fallbackIcon}</span>;
  }

  return (
    <span className="favicon-frame" aria-hidden="true">
      {fallbackIcon}
      <img
        className={`shortcut-favicon${loaded ? ' shortcut-favicon-loaded' : ''}`}
        src={iconUrl}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function Orbit({
  shortcuts,
  isEditing,
  isSearching,
  offset,
  onRotate,
  onOpen,
  onEnterEdit,
  onDelete,
  onMove,
  onAdd,
}: OrbitProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const hasRotation = shortcuts.length > 6;
  const visibleShortcuts = isEditing
    ? shortcuts.map((shortcut, index) => ({ shortcut, index }))
    : hasRotation
    ? orbitAngles.map((_, slot) => {
        const index = (slot + offset) % shortcuts.length;
        return { shortcut: shortcuts[index], index };
      })
    : shortcuts.map((shortcut, index) => ({ shortcut, index }));

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!hasRotation || isEditing) return;
    if (Math.abs(event.deltaY) < 2 && Math.abs(event.deltaX) < 2) return;
    event.preventDefault();
    onRotate(event.deltaY + event.deltaX > 0 ? 1 : -1);
  };

  const handleOrbitKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasRotation || isEditing) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      onRotate(-1);
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      onRotate(1);
    }
  };

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isEditing) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onDelete(index);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      onMove(index, Math.max(0, index - 1));
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      onMove(index, Math.min(shortcuts.length - 1, index + 1));
    }
  };

  const startDrag = (event: DragEvent<HTMLButtonElement>, index: number) => {
    if (!isEditing) return;
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const dropOnNode = (event: DragEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) onMove(draggedIndex, index);
    setDraggedIndex(null);
  };

  return (
    <div
      className={`orbit-layer${isSearching ? ' orbit-searching' : ''}${isEditing ? ' orbit-editing' : ''}`}
      onWheel={handleWheel}
      onKeyDown={handleOrbitKeyDown}
      tabIndex={hasRotation && !isEditing ? 0 : -1}
      aria-label="Shortcut orbit"
    >
      {shortcuts.length === 0 &&
        orbitAngles.slice(0, 4).map((angle, index) => (
          <div
            className="orbit-node orbit-placeholder"
            key={`empty-${angle}`}
            style={{ '--node-angle': angle } as React.CSSProperties}
          >
            <GlassSurface className="shortcut-surface" variant="shortcut" intensity="low" interactive>
              <button className="shortcut-button placeholder-button" type="button" onClick={onAdd} aria-label="Add shortcut">
                <MorphIcon icon={Plus} size={19} strokeWidth={1.7} reducedMotion="user" />
              </button>
            </GlassSurface>
          </div>
        ))}

      {visibleShortcuts.map(({ shortcut, index }, slot) => (
        <div
          className={`orbit-node${hoveredId && hoveredId !== shortcut.id ? ' node-dimmed' : ''}`}
          key={shortcut.id}
          style={{
            '--node-angle': isEditing
              ? (slot * (360 / Math.max(shortcuts.length, 1))) - 90
              : orbitAngles[slot],
          } as React.CSSProperties}
          onMouseEnter={() => setHoveredId(shortcut.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <GlassSurface className="shortcut-surface" variant="shortcut" intensity="low" interactive>
            <button
              className="shortcut-button"
              type="button"
              draggable={isEditing}
              onClick={() => onOpen(shortcut)}
              onContextMenu={(event) => {
                event.preventDefault();
                onEnterEdit();
              }}
              onKeyDown={(event) => handleNodeKeyDown(event, index)}
              onDragStart={(event) => startDrag(event, index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => dropOnNode(event, index)}
              aria-label={isEditing ? `${shortcut.title}. Use arrow keys to reorder or Delete to remove.` : shortcut.title}
            >
              <Favicon shortcut={shortcut} />
            </button>
          </GlassSurface>
          <span className="shortcut-tooltip" role="status">{shortcut.title}</span>
          {isEditing && (
            <button
              className="shortcut-delete"
              type="button"
              aria-label={`Delete ${shortcut.title}`}
              onClick={() => onDelete(index)}
            >
              <MorphIcon icon={X} size={13} strokeWidth={1.8} reducedMotion="user" />
            </button>
          )}
        </div>
      ))}

      {isEditing && shortcuts.length > 0 && shortcuts.length < 18 && (
        <div className="orbit-add-node" style={{ '--node-angle': 180 } as React.CSSProperties}>
          <GlassSurface className="shortcut-surface" variant="shortcut" intensity="low" interactive>
            <button className="shortcut-button add-node-button" type="button" onClick={onAdd} aria-label="Add shortcut">
              <MorphIcon icon={Plus} size={19} strokeWidth={1.7} reducedMotion="user" />
            </button>
          </GlassSurface>
        </div>
      )}
    </div>
  );
}
