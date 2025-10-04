import { useState } from 'react';

import { toast } from 'react-toastify';

import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';

// Заменить импорты
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectCartItems } from '@/store/slices/cart-slice/cart.selectors';
import { addToCart } from '@/store/slices/cart-slice/cart.thunks';
import type { CartItem } from '@/types/models/cart.model';
import type { Product, ProductWithDetails } from '@/types/models/product.model';

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

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  // Вычисляем количество только после hydration
  const quantityInCart =
    cartItems.find((item: CartItem) => item.productId === product.id)?.quantity || 0;

  const handleAddToCart = async () => {
    const isInStock = product.stock > 0;
    if (!isInStock) {
      toast.error('Товар временно отсутствует в наличии');
      return;
    }

    setIsLoading(true);

    const cartData = {
      productId: product.id,
      quantity,
    };
    try {
      dispatch(addToCart(cartData));

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
        disabled={disabled || !product.stock || isLoading}
        fullWidth={true}
      >
        {!product.stock ? 'Нет в наличии' : quantityInCart > 0 ? 'Добавить ещё' : 'В корзину'}
      </Button>

      {showQuantity && quantityInCart > 0 && <QuantityBadge>{quantityInCart}</QuantityBadge>}
    </AddToCartButtonWrapper>
  );
};
