import { useState } from 'react';

import { PhoneAuthForm } from '@/features/auth/forms/phone-auth-form';
import { UsernameAuthForm } from '@/features/auth/forms/username-auth-form';

import { AuthModeButton, AuthModeContainer, AuthModeSelector } from './auth-modal-content.style';

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
