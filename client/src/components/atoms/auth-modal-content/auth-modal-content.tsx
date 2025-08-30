import React, { useState } from 'react';

import { UsernameAuthForm } from '@/components/atoms/username-auth-form';
import { AuthModeContainer, AuthModeSelector, AuthModeButton } from './auth-modal-content.style';
import { PhoneAuthForm } from '@/features/auth/forms/phone-auth-form';

interface AuthModalContentProps {
  onClose: () => void;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'username'>('username');

  return (
    <div>
      <AuthModeContainer>
        <AuthModeSelector>
          {/* <AuthModeButton onClick={() => setAuthMode('phone')} active={authMode === 'phone'}>
            По телефону
          </AuthModeButton> */}
          {/* <AuthModeButton onClick={() => setAuthMode('username')} active={authMode === 'username'}>
            По логину
          </AuthModeButton> */}
        </AuthModeSelector>
      </AuthModeContainer>

      {authMode === 'phone' ? (
        // <PhoneAuthForm onClose={onClose} />
        null
      ) : (
        <UsernameAuthForm onClose={onClose} />
      )}
    </div>
  );
};
