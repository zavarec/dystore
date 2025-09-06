import React, { useEffect } from 'react';
import { PhoneAuthForm } from '@/features/auth/forms/phone-auth-form';
// import { UsernameAuthForm } from '@/features/auth/forms/username-auth-form';
// import { AuthModeButton, AuthModeContainer, AuthModeSelector } from './auth-modal-content.style';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { Modal } from '@/components/atoms/modal';

interface AuthModalProps {
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = () => {
  const dispatch = useAppDispatch();
  const isAuthModalOpen = useAppSelector(state => state.uiSlice.isAuthModalOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Закрываем модалку при успешной авторизации
  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      dispatch(setAuthModalOpen(false));
    }
  }, [isAuthenticated, isAuthModalOpen, dispatch]);

  const handleClose = () => {
    dispatch(setAuthModalOpen(false));
  };

  return (
    <div>
      <Modal isOpen={isAuthModalOpen} onClose={handleClose} size="sm" variant="center" padding={20}>
        {/* Только вход по телефону в обычном режиме */}
        <PhoneAuthForm />
      </Modal>
    </div>
  );
};
