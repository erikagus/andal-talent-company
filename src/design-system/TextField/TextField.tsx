import { useId } from 'react';
import { Info, CaretDown, WarningCircle } from '@phosphor-icons/react';
import './TextField.css';

export type TextFieldSize = 'md' | 'lg';
export type TextFieldState = 'default' | 'active' | 'error' | 'disabled';

export interface TextFieldProps {
  /** Field height — md (40px), lg (56px) */
  size?: TextFieldSize;
  /**
   * Visual state override. In production, focus is handled natively via :focus-within;
   * this prop is primarily for Storybook demos.
   */
  state?: TextFieldState;
  /**
   * Shows the input with pre-filled value text instead of placeholder.
   * Renders a `defaultValue` of "Input text" when no `value` is provided.
   */
  filled?: boolean;
  /** Show the label above the field */
  showLabel?: boolean;
  /** Show the ⓘ info icon next to the label */
  showInfoTooltip?: boolean;
  /** Append "(optional)" after the label text */
  optional?: boolean;
  /** Append a red * mandatory indicator after the label text */
  mandatory?: boolean;
  /** Show a leading icon inside the field (left edge) */
  showLeadingIcon?: boolean;
  /**
   * Custom leading icon element. Defaults to a User icon when
   * `showLeadingIcon` is true and no override is provided.
   */
  leadingIcon?: React.ReactNode;
  /** Show a trailing caret-down icon inside the field (right edge) */
  showTrailingIcon?: boolean;
  /**
   * Show the support row below the field.
   * In error state renders the warning icon + supportText in red.
   * In other states renders supportText as a hint in gray-500.
   * Also renders the character counter when `maxCount` is set.
   */
  showSupport?: boolean;
  /** Label string */
  labelText?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Error / hint text shown in the support row */
  supportText?: string;
  /** Controlled value */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Character limit — shows `x/maxCount` counter in the support row */
  maxCount?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Overrides the auto-generated id */
  id?: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
}

export function TextField({
  size = 'lg',
  state = 'default',
  filled = false,
  showLabel = true,
  showInfoTooltip = false,
  optional = false,
  mandatory = false,
  showLeadingIcon = false,
  leadingIcon,
  showTrailingIcon = false,
  showSupport = false,
  labelText = 'Label',
  placeholder = 'Placeholder',
  supportText = 'Error message',
  value,
  defaultValue,
  maxCount,
  onChange,
  onFocus,
  onBlur,
  id: idProp,
  name,
  type = 'text',
  className = '',
}: TextFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const isDisabled = state === 'disabled';

  // When `filled` is true and no value/defaultValue is provided, seed the field
  const resolvedDefaultValue =
    filled && value === undefined && defaultValue === undefined
      ? 'Input text'
      : defaultValue;

  // Icon sizes scale with field size
  const iconSize = size === 'lg' ? 20 : 16;

  // Resolve the leading icon — user override or default User silhouette
  const leadingEl = leadingIcon ?? (
    // Inline SVG fallback: a simple person silhouette matching Figma
    <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const showSupportRow =
    showSupport && (supportText != null || maxCount != null);

  return (
    <div
      className={['text-field', className].filter(Boolean).join(' ')}
      data-size={size}
      data-state={state}
    >
      {/* ── Label row ───────────────────────────────────────── */}
      {showLabel && (
        <div className="text-field__label-row">
          <label htmlFor={id} className="text-field__label">
            {labelText}
          </label>
          {showInfoTooltip && (
            <span
              className="text-field__info-icon"
              title="More information"
              aria-label="More information"
            >
              <Info size={14} weight="fill" />
            </span>
          )}
          {optional && (
            <span className="text-field__optional">(optional)</span>
          )}
          {mandatory && (
            <span className="text-field__mandatory" aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}

      {/* ── Input box ───────────────────────────────────────── */}
      <div className="text-field__box">
        <div className="text-field__state-layer">
          {showLeadingIcon && (
            <span className="text-field__icon text-field__icon--leading">
              {leadingEl}
            </span>
          )}

          <input
            id={id}
            name={name}
            type={type}
            className="text-field__input"
            placeholder={placeholder}
            value={value}
            defaultValue={resolvedDefaultValue}
            disabled={isDisabled}
            maxLength={maxCount}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />

          {showTrailingIcon && (
            <span className="text-field__icon text-field__icon--trailing">
              <CaretDown size={iconSize} />
            </span>
          )}
        </div>
      </div>

      {/* ── Support row ─────────────────────────────────────── */}
      {showSupportRow && (
        <div className="text-field__support">
          {supportText && (
            <>
              <span className="text-field__support-icon">
                <WarningCircle size={14} weight="fill" />
              </span>
              <span className="text-field__support-text">{supportText}</span>
            </>
          )}
          {maxCount != null && (
            <span className="text-field__counter">
              {(value?.length ?? (resolvedDefaultValue?.length ?? 0))}/{maxCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
