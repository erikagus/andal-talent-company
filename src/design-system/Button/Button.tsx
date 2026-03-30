import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import './Button.css';

export type ButtonVariant = 'Solid' | 'Outline' | 'Tonal' | 'Plain';
export type ButtonSize = 'Small' | 'Medium' | 'Large';
export type ButtonColor = 'Primary' | 'Secondary' | 'Error';

/** Any Phosphor icon component, or any component accepting size/weight/color props */
export type IconComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.ComponentPropsWithRef<typeof PhosphorIcon>>
>;

const ICON_SIZE: Record<ButtonSize, number> = {
  Small: 20,  /* Figma: 20×20 icon instances */
  Medium: 24, /* Figma: 24×24 icon instances */
  Large: 24,  /* Figma: 24×24 icon instances */
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Visual style — matches Figma "Type" axis */
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  /** Phosphor icon component rendered before the label */
  leftIcon?: IconComponent;
  /** Phosphor icon component rendered after the label */
  rightIcon?: IconComponent;
  children?: React.ReactNode;
}

export function Button({
  variant = 'Solid',
  size = 'Medium',
  color = 'Primary',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const iconSize = ICON_SIZE[size];

  return (
    <button
      {...rest}
      className={['btn', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-color={color}
    >
      {LeftIcon && (
        <span className="btn__icon" aria-hidden="true">
          <LeftIcon size={iconSize} />
        </span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {RightIcon && (
        <span className="btn__icon" aria-hidden="true">
          <RightIcon size={iconSize} />
        </span>
      )}
    </button>
  );
}
