import React, { useState, useEffect } from 'react';
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

interface SimpleCartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

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
  const [quantityInCart, setQuantityInCart] = useState(0);

  // Проверяем количество товара в корзине при загрузке
  useEffect(() => {
    const cartData = localStorage.getItem('simpleCart');
    if (cartData) {
      try {
        const cart: SimpleCartItem[] = JSON.parse(cartData);
        const existingItem = cart.find(item => item.productId === product.id);
        setQuantityInCart(existingItem?.quantity || 0);
      } catch (error) {
        console.error('Ошибка чтения корзины:', error);
      }
    }
  }, [product.id]);

  const handleAddToCart = async () => {
    const isInStock = product.stock > 0;

    if (!isInStock) {
      toast.error('Товар временно отсутствует в наличии');
      return;
    }

    setIsLoading(true);

    try {
      // Получаем текущую корзину из localStorage
      const cartData = localStorage.getItem('simpleCart');
      let cart: SimpleCartItem[] = [];

      if (cartData) {
        cart = JSON.parse(cartData);
      }

      // Ищем товар в корзине
      const existingItemIndex = cart.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0 && cart[existingItemIndex]) {
        // Увеличиваем количество
        cart[existingItemIndex].quantity += quantity;
      } else {
        console.log(product, 'product');

        // Добавляем новый товар
        const imageUrl = product.imageUrl ?? '/images/placeholder.webp';

        const newItem: SimpleCartItem = {
          id: Date.now(),
          productId: product.id,
          quantity: quantity,
          name: product.name,
          price: product.price,
          imageUrl: imageUrl,
        };
        cart.push(newItem);
      }

      // Сохраняем корзину в localStorage
      localStorage.setItem('simpleCart', JSON.stringify(cart));

      // Обновляем локальное состояние
      const updatedItem = cart.find(item => item.productId === product.id);
      if (updatedItem) {
        setQuantityInCart(updatedItem.quantity);
      }

      // Показываем уведомление
      toast.success(`${product.name} добавлен в корзину`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Обновляем глобальное состояние (для отображения счетчика в хедере)
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      toast.error('Произошла ошибка при добавлении товара');
    } finally {
      setIsLoading(false);
    }
  };

  const isInStock = product.stock > 0;

  return (
    <AddToCartButtonWrapper className={className} style={style}>
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        disabled={!isInStock || isLoading || disabled}
        fullWidth={true}
      >
        {!isInStock ? 'Нет в наличии' : quantityInCart > 0 ? 'Добавить ещё' : 'В корзину'}
      </Button>

      {showQuantity && quantityInCart > 0 && <QuantityBadge>{quantityInCart}</QuantityBadge>}
    </AddToCartButtonWrapper>
  );
};
