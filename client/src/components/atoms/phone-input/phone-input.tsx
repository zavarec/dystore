import { forwardRef } from 'react';

import { Masked } from './phone-input.style';

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  id?: string;
  errorText?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      id = 'phone',
      errorText,
      fullWidth = true,
      placeholder = '+7 (___) ___-__-__',
    },
    ref,
  ) => {
    return (
      <div>
        <Masked
          /* mask */
          mask="+{7} (000) 000-00-00"
          lazy={true} /* маска появляется только при вводе */
          /* управление значением */
          value={value ?? ''}
          onAccept={val => onChange(String(val))}
          onBlur={onBlur}
          inputRef={ref}
          /* a11y/attrs */
          id={id}
          type="tel"
          inputMode="tel"
          placeholder={placeholder}
          aria-invalid={!!errorText}
          aria-describedby={errorText ? `${id}-error` : undefined}
          /* стили */
          hasError={!!errorText}
          fullWidth={fullWidth}
        />
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
