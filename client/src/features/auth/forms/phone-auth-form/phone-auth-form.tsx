import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearError } from '@/store/slices/auth-slice/auth.slice';
import { Button } from '@/components/atoms/button';
import {
  AuthFormTitle,
  AuthFormSubtitle,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  FormActions,
  ResendButton,
  TimerText,
  CloseButton,
} from './phone-auth-form.style';
import { codeValidationSchema, phoneValidationSchema } from './phone-auth-form.schema';
import { sendCode, verifyCode } from '@/store/slices/auth-slice/auth.thunks';
import {
  selectCanResendCodeAt,
  selectCodeSent,
  selectCodeSentTo,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
} from '@/store/slices/auth-slice/auth.selectors';

interface PhoneFormData {
  phone: string;
}

interface CodeFormData {
  code: string;
}

interface PhoneAuthFormProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({
  onClose,
  showCloseButton = false,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoading = useAppSelector(selectIsLoading);
  const codeSent = useAppSelector(selectCodeSent);
  const codeSentTo = useAppSelector(selectCodeSentTo);
  const error = useAppSelector(selectError);
  const canResendCodeAt = useAppSelector(selectCanResendCodeAt);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [timeLeft, setTimeLeft] = useState(0);

  // Форма для ввода номера телефона
  const phoneForm = useForm<PhoneFormData>({
    resolver: yupResolver(phoneValidationSchema),
    mode: 'onSubmit',
  });

  // Форма для ввода кода
  const codeForm = useForm<CodeFormData>({
    resolver: yupResolver(codeValidationSchema),
    mode: 'onSubmit',
  });

  // Таймер для повторной отправки кода
  useEffect(() => {
    if (canResendCodeAt) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((canResendCodeAt - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [canResendCodeAt]);

  // Очистка ошибок при изменении формы
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Закрытие модалки или перенаправление после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      if (onClose) {
        // Если есть обработчик закрытия (модальное окно), закрываем его
        onClose();
      } else {
        // Если мы на странице авторизации, перенаправляем на главную
        router.push('/');
      }
    }
  }, [isAuthenticated, onClose, router]);

  const onPhoneSubmit = async (data: PhoneFormData) => {
    try {
      await dispatch(sendCode({ phone: data.phone })).unwrap();
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
    }
  };

  const onCodeSubmit = async (data: CodeFormData) => {
    if (!codeSentTo) return;

    try {
      await dispatch(
        verifyCode({
          phone: codeSentTo,
          code: data.code,
        }),
      ).unwrap();
    } catch (error) {
      console.error('Ошибка проверки кода:', error);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0 || !codeSentTo) return;

    try {
      await dispatch(sendCode({ phone: codeSentTo })).unwrap();
    } catch (error) {
      console.error('Ошибка повторной отправки кода:', error);
    }
  };

  const handleBackToPhone = () => {
    phoneForm.reset();
    codeForm.reset();
    dispatch(clearError());
  };

  if (!codeSent) {
    // Форма ввода номера телефона
    return (
      <div style={{ padding: '48px', position: 'relative' }}>
        {showCloseButton && onClose && (
          <CloseButton onClick={onClose} aria-label="Закрыть форму аутентификации" type="button">
            ✕
          </CloseButton>
        )}
        <AuthFormTitle>Вход по номеру телефона</AuthFormTitle>
        <AuthFormSubtitle>Введите номер телефона для получения кода подтверждения</AuthFormSubtitle>

        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} noValidate>
          <FormGroup>
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              type="tel"
              {...phoneForm.register('phone')}
              placeholder="+7XXXXXXXXXX"
              error={!!phoneForm.formState.errors.phone}
              aria-invalid={!!phoneForm.formState.errors.phone}
              aria-describedby={phoneForm.formState.errors.phone ? 'phone-error' : undefined}
              autoComplete="tel"
            />
            {phoneForm.formState.errors.phone && (
              <ErrorMessage id="phone-error" role="alert">
                {phoneForm.formState.errors.phone.message}
              </ErrorMessage>
            )}
          </FormGroup>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <FormActions>
            <Button
              type="submit"
              size="large"
              fullWidth
              disabled={isLoading}
              aria-label="Отправить код подтверждения"
            >
              {isLoading ? 'Отправляем...' : 'Получить код'}
            </Button>
          </FormActions>
        </form>
      </div>
    );
  }

  // Форма ввода кода подтверждения
  return (
    <div style={{ padding: '48px', position: 'relative' }}>
      {showCloseButton && onClose && (
        <CloseButton onClick={onClose} aria-label="Закрыть форму аутентификации" type="button">
          ✕
        </CloseButton>
      )}
      <AuthFormTitle>Введите код подтверждения</AuthFormTitle>
      <AuthFormSubtitle>Код отправлен на номер {codeSentTo}</AuthFormSubtitle>

      <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} noValidate>
        <FormGroup>
          <Label htmlFor="code">Код подтверждения</Label>
          <Input
            id="code"
            type="text"
            {...codeForm.register('code')}
            placeholder="000000"
            error={!!codeForm.formState.errors.code}
            aria-invalid={!!codeForm.formState.errors.code}
            aria-describedby={codeForm.formState.errors.code ? 'code-error' : undefined}
            autoComplete="one-time-code"
            maxLength={6}
          />
          {codeForm.formState.errors.code && (
            <ErrorMessage id="code-error" role="alert">
              {codeForm.formState.errors.code.message}
            </ErrorMessage>
          )}
        </FormGroup>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <FormActions>
          <Button
            type="submit"
            size="large"
            fullWidth
            disabled={isLoading}
            aria-label="Подтвердить код"
          >
            {isLoading ? 'Проверка...' : 'Подтвердить'}
          </Button>

          {timeLeft > 0 ? (
            <TimerText>Повторная отправка через {timeLeft} сек</TimerText>
          ) : (
            <ResendButton type="button" onClick={handleResendCode} disabled={isLoading}>
              Отправить код повторно
            </ResendButton>
          )}

          <ResendButton type="button" onClick={handleBackToPhone} disabled={isLoading}>
            Изменить номер телефона
          </ResendButton>
        </FormActions>
      </form>
    </div>
  );
};
