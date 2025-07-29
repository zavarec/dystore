import { RootState } from '@/store';

export const selectIsAuthenticated = (state: RootState) => state.authSlice.isAuthenticated;
export const selectUser = (state: RootState) => state.authSlice.user;
export const selectIsLoading = (state: RootState) => state.authSlice.isLoading;
export const selectError = (state: RootState) => state.authSlice.error;
export const selectCodeSent = (state: RootState) => state.authSlice.codeSent;
export const selectCodeSentTo = (state: RootState) => state.authSlice.codeSentTo;
export const selectCanResendCodeAt = (state: RootState) => state.authSlice.canResendCodeAt;
