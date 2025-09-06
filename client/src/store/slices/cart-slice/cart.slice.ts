import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoadingState } from '@/types/common';
import { fetchCart, addToCart, removeFromCart, fetchCartTotal, clearCart } from './cart.thunks';
import { Cart } from '@/types/models/cart.model';

interface CartState extends LoadingState {
  cart: Cart | null;
  totalPrice: number;
}

const initialState: CartState = {
  cart: null,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      if (!state.cart) return;

      const { productId, quantity } = action.payload;
      const nextQ = Math.max(1, Number.isFinite(quantity) ? quantity : 1);

      const item = state.cart.items.find(it => it.productId === productId);
      if (!item) return;

      item.quantity = nextQ;
    },
  },
  extraReducers: builder => {
    builder
      // Получение корзины
      .addCase(fetchCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Добавление в корзину
      .addCase(addToCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Удаление из корзины
      .addCase(removeFromCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Получение общей стоимости корзины
      .addCase(fetchCartTotal.fulfilled, (state, action) => {
        state.totalPrice = action.payload.total;
      })
      // Очистка корзины
      .addCase(clearCart.fulfilled, state => {
        state.cart = null;
        state.totalPrice = 0;
      });
  },
});

export const { clearError, setQuantity } = cartSlice.actions;

export default cartSlice.reducer;
