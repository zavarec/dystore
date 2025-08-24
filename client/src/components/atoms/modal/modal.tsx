// modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { ModalOverlay, ModalContainer, ModalContent, ModalCloseButton } from './modal.style';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key listener
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          ref={modalRef}
        >
          <ModalContainer
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ModalContent>
              <ModalCloseButton onClick={onClose} aria-label="Закрыть модальное окно">
                ✕
              </ModalCloseButton>
              {children}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body,
  );
};
