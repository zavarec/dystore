import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types/common';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
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
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
