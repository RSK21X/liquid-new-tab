import { CSSProperties, MouseEventHandler, ReactNode } from 'react';

type GlassVariant = 'lens' | 'menu' | 'shortcut' | 'tooltip';
type GlassIntensity = 'low' | 'normal' | 'high';

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
  variant?: GlassVariant;
  intensity?: GlassIntensity;
  interactive?: boolean;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
}

/**
 * A CSS-only web approximation of the Liquid Glass material described in the PRD.
 * The layers keep the material reusable without moving the glass renderer into JS.
 */
export function GlassSurface({
  children,
  className = '',
  variant = 'menu',
  intensity = 'normal',
  interactive = false,
  onMouseDown,
}: GlassSurfaceProps) {
  const materialStyle = {
    '--corner-radius': variant === 'lens' || variant === 'tooltip' ? '999px' : '24px',
  } as CSSProperties;

  return (
    <div
      className={`GlassContainer glass-surface glass-${variant} glass-intensity-${intensity}${
        interactive ? ' glass-interactive' : ''
      } ${className}`}
      style={materialStyle}
      onMouseDown={onMouseDown}
    >
      <div className="GlassContent">{children}</div>
      <div className="GlassMaterial" aria-hidden="true">
        <div className="GlassEdgeReflection" />
        <div className="GlassEmbossReflection" />
        <div className="GlassRefraction" />
        <div className="GlassBlur" />
        <div className="BlendLayers" />
        <div className="BlendEdge" />
        <div className="Highlight" />
        <div className="Tint" />
        <div className="Contrast" />
        <div className="Brightness" />
      </div>
    </div>
  );
}
