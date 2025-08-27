import React, { useState } from 'react';
// import { PhoneAuthForm } from '@/components/atoms/phone-auth-form';
import { UsernameAuthForm } from '@/components/atoms/username-auth-form';
import { AuthModeContainer, AuthModeSelector, AuthModeButton } from './auth-modal-content.style';

interface AuthModalContentProps {
  onClose: () => void;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'phone' | 'username'>('username');

  return (
    <div>
      <AuthModeContainer>
        {/* <AuthModeSelector>
          <AuthModeButton onClick={() => setAuthMode('phone')} active={authMode === 'phone'}>
            По телефону
          </AuthModeButton>
          <AuthModeButton onClick={() => setAuthMode('username')} active={authMode === 'username'}>
            По логину
          </AuthModeButton>
        </AuthModeSelector> */}
      </AuthModeContainer>

      {/* {authMode === 'phone' ? (
        <PhoneAuthForm onClose={onClose} />
      ) : ( */}
      <UsernameAuthForm onClose={onClose} />
      {/* )} */}
    </div>
  );
};
