import React, { useState, useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { Button } from '@/components/atoms/button';
import {
  AuthFormTitle,
  AuthFormSubtitle,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  FormActions,
  // CloseButton,
  SwitchModeButton,
} from './username-auth-form.style';
import { loginWithPassword, registerWithPassword } from '@/store/slices/auth-slice/auth.thunks';
import { clearError } from '@/store/slices/auth-slice/auth.slice';
import {
  LoginFormData,
  RegisterFormData,
  loginValidationSchema,
  registerValidationSchema,
} from './username-auth-form.schema';

interface UsernameAuthFormProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  redirectTo?: string;
}

export const UsernameAuthForm: React.FC<UsernameAuthFormProps> = ({
  onClose,

  redirectTo = '/',
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.authSlice);

  const isAdminPath = router.pathname.startsWith('/admin');

  useEffect(() => {
    console.log(isAdminPath, 'isAdminPath');
  }, [isAdminPath]);

  const [isLoginMode, setIsLoginMode] = useState(true);

  // Форма для логина
  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginValidationSchema),
    mode: 'onSubmit',
  });

  // Форма для регистрации
  const registerForm = useForm<RegisterFormData>({
    resolver: yupResolver(registerValidationSchema) as Resolver<RegisterFormData>,
    mode: 'onSubmit',
  });

  // Очистка ошибок при изменении формы
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, dispatch]);

  // Закрытие модалки или перенаправление после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      if (onClose) {
        onClose();
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, onClose, router, redirectTo]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginWithPassword(data)).unwrap();
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const { ...registerData } = data;
      await dispatch(registerWithPassword(registerData)).unwrap();
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    loginForm.reset();
    registerForm.reset();
    dispatch(clearError());
  };

  return (
    <div style={{ padding: '48px', position: 'relative' }}>
      {/* {showCloseButton && onClose && (
        <CloseButton onClick={onClose} aria-label="Закрыть форму авторизации" type="button">
          ✕
        </CloseButton>
      )} */}

      <AuthFormTitle>{isLoginMode ? 'Вход в аккаунт' : 'Регистрация'}</AuthFormTitle>
      <AuthFormSubtitle>
        {isLoginMode ? 'Введите email и пароль для входа' : 'Создайте новый аккаунт'}
      </AuthFormSubtitle>

      {isLoginMode ? (
        // Форма входа
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} noValidate>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...loginForm.register('email')}
              placeholder="Введите email"
              error={!!loginForm.formState.errors.email}
              aria-invalid={!!loginForm.formState.errors.email}
              autoComplete="email"
            />
            {loginForm.formState.errors.email && (
              <ErrorMessage role="alert">{loginForm.formState.errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register('password')}
              placeholder="Введите пароль"
              error={!!loginForm.formState.errors.password}
              aria-invalid={!!loginForm.formState.errors.password}
              autoComplete="current-password"
            />
            {loginForm.formState.errors.password && (
              <ErrorMessage role="alert">
                {loginForm.formState.errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <FormActions>
            <Button type="submit" size="large" fullWidth disabled={isLoading}>
              {isLoading ? 'Входим...' : 'Войти'}
            </Button>
          </FormActions>
        </form>
      ) : (
        // Форма регистрации
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} noValidate>
          <FormGroup>
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              {...registerForm.register('email')}
              placeholder="Введите email"
              error={!!registerForm.formState.errors.email}
              aria-invalid={!!registerForm.formState.errors.email}
              autoComplete="email"
            />
            {registerForm.formState.errors.email && (
              <ErrorMessage role="alert">
                {registerForm.formState.errors.email.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="reg-name">Имя</Label>
            <Input
              id="reg-name"
              type="text"
              {...registerForm.register('name')}
              placeholder="Введите ваше имя"
              error={!!registerForm.formState.errors.name}
              aria-invalid={!!registerForm.formState.errors.name}
              autoComplete="name"
            />
            {registerForm.formState.errors.name && (
              <ErrorMessage role="alert">{registerForm.formState.errors.name.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="reg-password">Пароль</Label>
            <Input
              id="reg-password"
              type="password"
              {...registerForm.register('password')}
              placeholder="Введите пароль"
              error={!!registerForm.formState.errors.password}
              aria-invalid={!!registerForm.formState.errors.password}
              autoComplete="new-password"
            />
            {registerForm.formState.errors.password && (
              <ErrorMessage role="alert">
                {registerForm.formState.errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirm-password">Подтвердите пароль</Label>
            <Input
              id="confirm-password"
              type="password"
              {...registerForm.register('confirmPassword')}
              placeholder="Повторите пароль"
              error={!!registerForm.formState.errors.confirmPassword}
              aria-invalid={!!registerForm.formState.errors.confirmPassword}
              autoComplete="new-password"
            />
            {registerForm.formState.errors.confirmPassword && (
              <ErrorMessage role="alert">
                {registerForm.formState.errors.confirmPassword.message}
              </ErrorMessage>
            )}
          </FormGroup>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <FormActions>
            <Button type="submit" size="large" fullWidth disabled={isLoading}>
              {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
            </Button>
          </FormActions>
        </form>
      )}
      {!isAdminPath && (
        <SwitchModeButton onClick={toggleMode} type="button">
          {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </SwitchModeButton>
      )}
    </div>
  );
};
