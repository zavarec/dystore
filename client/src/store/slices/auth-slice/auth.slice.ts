import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState } from './auth.types';
import AuthService from '@/services/auth.service';
import {
  loadUserProfile,
  loginWithPassword,
  logout,
  registerWithPassword,
  sendCode,
  verifyCode,
} from './auth.thunks';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  codeSent: false,
  codeSentTo: null,
  error: null,
  canResendCodeAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCodeSent: state => {
      state.codeSent = false;
      state.codeSentTo = null;
      state.canResendCodeAt = null;
    },
    setCanResendCodeAt: (state, action: PayloadAction<number>) => {
      state.canResendCodeAt = action.payload;
    },
    initializeAuth: state => {
      // Проверяем авторизацию при инициализации
      const isAuthenticated = AuthService.isAuthenticated();
      state.isAuthenticated = isAuthenticated;
    },
  },
  extraReducers: builder => {
    // Send Code
    builder
      .addCase(sendCode.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.codeSent = true;
        state.codeSentTo = action.payload.phone;
        state.error = null;
        // Устанавливаем таймер на 1 минуту для повторной отправки
        state.canResendCodeAt = Date.now() + 60000;
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify Code
    builder
      .addCase(verifyCode.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.codeSent = false;
        state.codeSentTo = null;
        state.canResendCodeAt = null;
        state.error = null;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load User Profile
    builder
      .addCase(loadUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        // Удаляем недействительный токен
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
      });

    // Logout
    builder.addCase(logout.fulfilled, state => {
      state.user = null;
      state.isAuthenticated = false;
      state.codeSent = false;
      state.codeSentTo = null;
      state.canResendCodeAt = null;
      state.error = null;
    });

    // Login with Password
    builder
      .addCase(loginWithPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register with Password
    builder
      .addCase(registerWithPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCodeSent, setCanResendCodeAt, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
