import React, { useState } from 'react';
import { PhoneAuthForm } from '@/features/auth/forms/phone-auth-form';
import { UsernameAuthForm } from '@/features/auth/forms/username-auth-form';
import { AuthModeButton, AuthModeContainer, AuthModeSelector } from './auth-modal-content.style';

interface AuthModalContentProps {
  onClose: () => void;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'username'>('phone');

  return (
    <div>
      <AuthModeContainer>
        <AuthModeSelector>
          <AuthModeButton onClick={() => setAuthMode('phone')} active={authMode === 'phone'}>
            По телефону
          </AuthModeButton>
          <AuthModeButton onClick={() => setAuthMode('username')} active={authMode === 'username'}>
            По логину
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
