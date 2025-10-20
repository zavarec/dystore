import type { MotionStyle } from 'framer-motion';

import { StyledButton, LoadingSpinner, ButtonVariant } from './button.style';
type NativeButtonProps = React.ComponentProps<typeof StyledButton>;

interface ButtonProps extends Omit<NativeButtonProps, 'variant' | 'size'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  style?: MotionStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = ButtonVariant.PRIMARY,
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  style,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      {...(style ? ({ style } as { style: MotionStyle }) : {})}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};
