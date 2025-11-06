import { createSlice } from '@reduxjs/toolkit';

import type { Notification } from '@/types/common';

import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  isContactModalOpen: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
  isContactModalOpen: false,
  notifications: [],
  theme: 'light',
  isLoading: false,
  loadingMessage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: state => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSearch: state => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    toggleAuthModal: state => {
      state.isAuthModalOpen = !state.isAuthModalOpen;
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    toggleContactModal: state => {
      state.isContactModalOpen = !state.isContactModalOpen;
    },
    setContactModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isContactModalOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload,
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  toggleAuthModal,
  setAuthModalOpen,
  toggleContactModal,
  setContactModalOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
