import React, { useEffect } from 'react';
import { Modal } from '@/components/atoms/modal';
import { AuthModalContent } from '@/components/atoms/auth-modal-content';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';

export const GlobalAuthModal: React.FC = () => {
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
    <Modal isOpen={isAuthModalOpen} onClose={handleClose}>
      <AuthModalContent onClose={handleClose} />
    </Modal>
  );
};
