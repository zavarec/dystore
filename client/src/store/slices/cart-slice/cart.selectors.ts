import { RootState } from '@/store';

export const selectCartItems = (state: RootState) => state.cartSlice.cart?.items ?? [];
export const selectIsCartLoading = (state: RootState) => state.cartSlice.isLoading;
export const selectCartError = (state: RootState) => state.cartSlice.error;
export const selectCartTotal = (state: RootState) => state.cartSlice.totalPrice;
export const selectCartTotalItems = (state: RootState) => state.cartSlice.cart?.items.length;
export const selectCartTotalPrice = (state: RootState) => state.cartSlice.totalPrice;
