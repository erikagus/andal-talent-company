import { useRef, useEffect, useId } from 'react';
import './Checkbox.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  /** Shows a dash instead of a checkmark — sets input.indeterminate */
  indeterminate?: boolean;
  /** Error state — applies error color palette to box and ripple */
  error?: boolean;
  /** Optional visible label */
  label?: React.ReactNode;
  id?: string;
}

export function Checkbox({
  indeterminate = false,
  error = false,
  label,
  id: idProp,
  disabled,
  className = '',
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const id = idProp ?? autoId;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={['checkbox', className].filter(Boolean).join(' ')}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      htmlFor={id}
    >
      <span className="checkbox__control">
        <input
          {...rest}
          ref={inputRef}
          id={id}
          type="checkbox"
          className="checkbox__input"
          disabled={disabled}
        />
        <span className="checkbox__ripple" aria-hidden="true" />
        <span className="checkbox__box" aria-hidden="true">
          {/* Checkmark — visible when :checked */}
          <svg className="checkbox__icon checkbox__icon--check" viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Dash — visible when indeterminate */}
          <svg className="checkbox__icon checkbox__icon--dash" viewBox="0 0 10 2" fill="none">
            <path
              d="M1 1H9"
              stroke="currentColor"
              strokeWidth="1.67"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      {label != null && <span className="checkbox__label">{label}</span>}
    </label>
  );
}
