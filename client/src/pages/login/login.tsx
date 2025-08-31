'use client';
import { PhoneAuthForm } from '@/features/auth/forms/phone-auth-form';
import React from 'react';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
      <PhoneAuthForm />
    </div>
  );
}
