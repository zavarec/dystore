import React, { useState } from 'react';
import { PhoneAuthForm } from '@/components/atoms/phone-auth-form';
import { UsernameAuthForm } from '@/components/atoms/username-auth-form';
import { AuthModeContainer, AuthModeSelector, AuthModeButton } from './auth-modal-content.style';

interface AuthModalContentProps {
  onClose: () => void;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');

  return (
    <div>
      <AuthModeContainer>
        <AuthModeSelector>
          <AuthModeButton active={authMode === 'phone'} onClick={() => setAuthMode('phone')}>
            По телефону
          </AuthModeButton>
          <AuthModeButton active={authMode === 'email'} onClick={() => setAuthMode('email')}>
            Email/Пароль
          </AuthModeButton>
        </AuthModeSelector>
      </AuthModeContainer>

      {authMode === 'phone' ? (
        <PhoneAuthForm onClose={onClose} />
      ) : (
        <UsernameAuthForm onClose={onClose} />
      )}
    </div>
  );
};
