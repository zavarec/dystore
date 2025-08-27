import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Product, ProductWithDetails } from '@/types/models/product.model';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { AddToCartButtonWrapper, QuantityBadge } from './add-to-cart-button.style';

export enum AddToCartButtonVariant {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface AddToCartButtonProps {
  product: Product | ProductWithDetails;
  variant?: ButtonVariant;
  size?: AddToCartButtonVariant;
  showQuantity?: boolean;
  className?: string;
  productId?: number;
  quantity?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
}

// Заменить импорты
import { useLocalStorage } from '@/utils/ssr';

// Заменить в компоненте AddToCartButton:
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = ButtonVariant.PRIMARY,
  size = AddToCartButtonVariant.MEDIUM,
  showQuantity = false,
  className,
  quantity = 1,
  disabled = false,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ ИСПРАВЛЕНИЕ: Используем безопасный хук
  const [cartItems, setCartItems, isHydrated] = useLocalStorage('simpleCart', []);

  // Вычисляем количество только после hydration
  const quantityInCart = isHydrated
    ? cartItems.find((item: any) => item.productId === product.id)?.quantity || 0
    : 0;

  const handleAddToCart = async () => {
    if (!isHydrated) return; // Не позволяем добавлять до hydration

    const isInStock = product.stock > 0;
    if (!isInStock) {
      toast.error('Товар временно отсутствует в наличии');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = [...cartItems];
      const existingItemIndex = updatedCart.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          id: Date.now(),
          productId: product.id,
          quantity: quantity,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl ?? '/images/placeholder.webp',
        };
        updatedCart.push(newItem);
      }

      setCartItems(updatedCart);

      // Уведомляем другие компоненты об обновлении
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }

      toast.success(`${product.name} добавлен в корзину`);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      toast.error('Произошла ошибка при добавлении товара');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddToCartButtonWrapper className={className} style={style}>
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        disabled={disabled || !product.stock || isLoading || !isHydrated} // Блокируем до hydration
        fullWidth={true}
      >
        {!isHydrated
          ? 'Загрузка...'
          : !product.stock
            ? 'Нет в наличии'
            : quantityInCart > 0
              ? 'Добавить ещё'
              : 'В корзину'}
      </Button>

      {showQuantity && isHydrated && quantityInCart > 0 && (
        <QuantityBadge>{quantityInCart}</QuantityBadge>
      )}
    </AddToCartButtonWrapper>
  );
};
