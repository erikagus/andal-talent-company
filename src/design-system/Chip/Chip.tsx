import React from 'react';
import { X, Check } from '@phosphor-icons/react';
import './Chip.css';

export type ChipKind = 'input' | 'filter' | 'suggestion' | 'assist';
export type ChipStyle = 'outlined' | 'elevated';

export interface ChipProps {
  /** The chip variant — determines available features and interaction model */
  kind: ChipKind;
  /** Visible label text */
  label: string;
  /**
   * Visual style. Outlined has a border, Elevated has a drop shadow.
   * Does not apply to Input chips.
   */
  chipStyle?: ChipStyle;
  /** Selected / active state — Input, Filter, and Suggestion chips */
  selected?: boolean;
  disabled?: boolean;
  /**
   * Leading icon (Phosphor icon element or any ReactNode).
   * - Input chip: shown when passed alongside a label
   * - Filter/Suggestion chip: shown at left (Filter hides it when selected)
   * - Assist chip: icon configuration
   */
  leadingIcon?: React.ReactNode;
  /**
   * Trailing icon — Filter chip dropdown arrow or any icon on the right edge.
   */
  trailingIcon?: React.ReactNode;
  /** Avatar image URL — Input chip only. Renders a 24px circular image at the leading edge. */
  avatar?: string;
  /** Alt text for the avatar */
  avatarAlt?: string;
  /** Favicon image URL — Assist chip only. Renders a 16px image at the leading edge. */
  favicon?: string;
  /** Branded / custom colored icon — Assist chip only. */
  brandedIcon?: React.ReactNode;
  /** Shows an × remove button at the trailing edge — typically used with Input chips */
  removable?: boolean;
  /** Called when the × remove button is clicked */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Main click handler (fires for all chip kinds) */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when selected state changes — Filter and Suggestion chips */
  onChange?: (selected: boolean) => void;
  className?: string;
}

export function Chip({
  kind,
  label,
  chipStyle = 'outlined',
  selected = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  avatar,
  avatarAlt = '',
  favicon,
  brandedIcon,
  removable = false,
  onRemove,
  onClick,
  onChange,
  className = '',
}: ChipProps) {
  const isToggleable = kind === 'filter' || kind === 'suggestion';

  function activate(e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (isToggleable) onChange?.(!selected);
    onClick?.(e as React.MouseEvent<HTMLDivElement>);
  }

  // ── Leading slot ──────────────────────────────────────────────────────
  let leadingEl: React.ReactNode = null;

  if (kind === 'input') {
    if (avatar) {
      leadingEl = <img className="chip__avatar" src={avatar} alt={avatarAlt} />;
    } else if (leadingIcon) {
      leadingEl = <span className="chip__icon chip__icon--leading" aria-hidden="true">{leadingIcon}</span>;
    }
  } else if (kind === 'filter') {
    // When selected, replace leading icon with a checkmark
    if (selected) {
      leadingEl = (
        <span className="chip__icon chip__icon--leading" aria-hidden="true">
          <Check size={18} weight="bold" />
        </span>
      );
    } else if (leadingIcon) {
      leadingEl = <span className="chip__icon chip__icon--leading" aria-hidden="true">{leadingIcon}</span>;
    }
  } else if (kind === 'suggestion') {
    if (leadingIcon) {
      leadingEl = <span className="chip__icon chip__icon--leading" aria-hidden="true">{leadingIcon}</span>;
    }
  } else if (kind === 'assist') {
    if (favicon) {
      leadingEl = <img className="chip__favicon" src={favicon} alt="" aria-hidden="true" />;
    } else if (brandedIcon) {
      leadingEl = <span className="chip__branded-icon" aria-hidden="true">{brandedIcon}</span>;
    } else if (leadingIcon) {
      leadingEl = <span className="chip__icon chip__icon--leading" aria-hidden="true">{leadingIcon}</span>;
    }
  }

  const hasLeading = leadingEl !== null;
  const hasTrailing = removable || trailingIcon != null;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={['chip', className].filter(Boolean).join(' ')}
      data-kind={kind}
      data-chip-style={kind !== 'input' ? chipStyle : undefined}
      data-selected={selected || undefined}
      data-has-leading={hasLeading || undefined}
      data-has-trailing={hasTrailing || undefined}
      data-avatar={avatar ? true : undefined}
      data-disabled={disabled || undefined}
      aria-pressed={isToggleable ? selected : undefined}
      aria-disabled={disabled || undefined}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(e);
        }
      }}
    >
      {leadingEl}
      <span className="chip__label">{label}</span>
      {trailingIcon && (
        <span className="chip__icon chip__icon--trailing" aria-hidden="true">{trailingIcon}</span>
      )}
      {removable && (
        <button
          type="button"
          className="chip__remove"
          aria-label={`Remove ${label}`}
          tabIndex={disabled ? -1 : 0}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
