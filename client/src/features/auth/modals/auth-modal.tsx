import React, { useEffect } from 'react';
import { Modal } from '@/components/atoms/modal';
import { AuthModalContent } from '@/features/auth/modals/auth-modal-content';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';

export const AuthModal: React.FC = () => {
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
    <Modal isOpen={isAuthModalOpen} onClose={handleClose} size="sm" variant="center" padding={20}>
      <AuthModalContent onClose={handleClose} />
    </Modal>
  );
};
