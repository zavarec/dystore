import { useEffect, useId } from 'react';

import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
} from './modal.style';

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'center' | 'sheet';
type ScrollStrategy = 'content' | 'page' | 'modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // не обязателен
  size?: Size; // пресеты ширины
  maxWidth?: string; // кастом ширины, перекрывает size
  variant?: Variant; // 'center' | 'sheet'
  padding?: number; // внутренний отступ
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  scrollStrategy?: ScrollStrategy; // 'content' | 'page'
  fullHeight?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  maxWidth,
  variant = 'center',
  padding = 24,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  scrollStrategy,
  fullHeight,
}) => {
  const titleId = useId();
  const isSheet = variant === 'sheet';

  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (scrollStrategy === 'content' || scrollStrategy === 'modal') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen, scrollStrategy]);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          $scrollStrategy={scrollStrategy}
          $alignStart={scrollStrategy === 'modal' ? false : isSheet} // важно!
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-modal="true"
          role="dialog"
          {...(title ? { 'aria-labelledby': titleId } : {})}
        >
          <ModalContainer
            $size={size}
            {...(maxWidth ? { $maxWidth: maxWidth } : {})}
            $isSheet={isSheet}
            $fullHeight={fullHeight}
            initial={isSheet ? { y: 24, opacity: 0 } : { y: 12, scale: 0.98, opacity: 0 }}
            animate={isSheet ? { y: 0, opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
            exit={isSheet ? { y: 16, opacity: 0 } : { y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            $scrollStrategy={scrollStrategy}
          >
            {title && (
              <ModalHeader>
                <ModalTitle id={titleId}>{title}</ModalTitle>
                <ModalCloseButton onClick={onClose} aria-label="Закрыть">
                  ✕
                </ModalCloseButton>
              </ModalHeader>
            )}
            <ModalContent
              $padding={padding}
              $scrollStrategy={scrollStrategy}
              $hasHeader={Boolean(title)}
            >
              {!title && (
                <div style={{ position: 'absolute', right: 16, top: 16, zIndex: 1000 }}>
                  <ModalCloseButton onClick={onClose} aria-label="Закрыть">
                    ✕
                  </ModalCloseButton>
                </div>
              )}
              {children}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body,
  );
};
