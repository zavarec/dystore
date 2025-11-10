import { useState } from 'react';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { toast } from 'react-toastify';

import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { CartService, OrdersService } from '@/services';
import { selectIsAuthenticated } from '@/store/slices/auth-slice/auth.selectors';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectIsCartLoading,
} from '@/store/slices/cart-slice/cart.selectors';
import { setQuantity } from '@/store/slices/cart-slice/cart.slice';
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/store/slices/cart-slice/cart.thunks';
import { setAuthModalOpen } from '@/store/slices/uiSlice';
import {
  CartPageContainer,
  CartHeader,
  CartTitle,
  CartItems,
  ItemImage,
  ItemInfo,
  ItemName,
  ItemPrice,
  QuantityControls,
  QuantityButton,
  QuantityInput,
  RemoveButton,
  CartSummary,
  SummaryRow,
  TotalRow,
  CheckoutSection,
  EmptyCart,
  EmptyCartIcon,
  EmptyCartTitle,
  EmptyCartDescription,
  CartItem,
} from '@/styles/pages/cart.style';
import type { CartItem as CartItemType } from '@/types/models/cart.model';
import { formatNumberRu } from '@/utils/format';

const CartPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comment, setComment] = useState('');

  const cartItems = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const isCartLoading = useAppSelector(selectIsCartLoading);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    if (newQuantity < 1) {
      handleRemoveByProductId(productId);
      return;
    }

    const nextQuantity = Math.max(1, newQuantity);
    if (item.quantity === nextQuantity) return;

    const previousQuantity = item.quantity;
    dispatch(setQuantity({ productId, quantity: nextQuantity }));

    void dispatch(
      updateCartItemQuantity({
        productId,
        quantity: nextQuantity,
      }),
    )
      .unwrap()
      .catch(error => {
        const message = typeof error === 'string' ? error : 'Не удалось обновить количество';
        dispatch(setQuantity({ productId, quantity: previousQuantity }));
        toast.error(message);
      });
  };

  const handleRemoveByProductId = (productId: number) => {
    dispatch(removeFromCart(productId));
    toast.info('Товар удален из корзины', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info('Корзина очищена', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleCheckout = async () => {
    if (!cartItems.length) {
      toast.error('Корзина пуста');
      return;
    }

    if (!isAuth) {
      dispatch(setAuthModalOpen(true));
      return;
    }

    setIsCheckingOut(true);
    try {
      await Promise.all(
        cartItems.map((item: CartItemType) =>
          CartService.addToCart({
            productId: item.productId,
            quantity: item.quantity,
          }),
        ),
      );

      const payload: { deliveryAddress: string; comment?: string } = {
        deliveryAddress: (deliveryAddress || 'Адрес не указан').trim(),
      };
      const trimmedComment = comment.trim();
      if (trimmedComment) payload.comment = trimmedComment;

      await OrdersService.createOrder(payload);

      toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', {
        position: 'top-center',
        autoClose: 5000,
      });

      handleClearCart();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      toast.error('Произошла ошибка при оформлении заказа. Попробуйте еще раз.', {
        position: 'top-center',
        autoClose: 4000,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!cartItems.length) {
    return (
      <>
        <Head>
          <title>Корзина - DysonGroup</title>
          <meta
            name="description"
            content="Ваша корзина пуста. Выберите товары из нашего каталога техники Dyson."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <CartPageContainer>
          <EmptyCart>
            <EmptyCartIcon>🛒</EmptyCartIcon>
            <EmptyCartTitle>Ваша корзина пуста</EmptyCartTitle>
            <EmptyCartDescription>
              Добавьте товары из нашего каталога, чтобы оформить заказ
            </EmptyCartDescription>
            <Link href="/" passHref legacyBehavior>
              <Button>Перейти к покупкам</Button>
            </Link>
          </EmptyCart>
        </CartPageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Корзина ({totalItems} товаров) - DysonGroup</title>
        <meta
          name="description"
          content={`В корзине ${totalItems} товаров на сумму ${totalPrice.toLocaleString('ru-RU')} ₽. Оформите заказ с быстрой доставкой.`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <CartPageContainer>
        <CartHeader>
          <CartTitle>Корзина ({totalItems} товаров)</CartTitle>

          {/* <Button variant={ButtonVariant.OUTLINE} onClick={handleClearCart}>Очистить корзину</Button> */}
        </CartHeader>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
          }}
        >
          <CartItems>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ItemImage>
                  <Image
                    src={item.product.mainImage?.url ?? '/images/placeholder.webp'}
                    alt={item.product.name}
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg=="
                  />
                </ItemImage>

                <ItemInfo>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemPrice>{formatNumberRu(item.product.price)} ₽</ItemPrice>
                </ItemInfo>

                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={isCartLoading}
                  >
                    −
                  </QuantityButton>

                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={e =>
                      handleQuantityChange(
                        item.productId,
                        Number.isNaN(e.currentTarget.valueAsNumber)
                          ? 1
                          : Math.max(1, e.currentTarget.valueAsNumber),
                      )
                    }
                    min={1}
                    disabled={isCartLoading}
                    inputMode="numeric"
                  />

                  <QuantityButton
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={isCartLoading}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>

                <RemoveButton
                  onClick={() => handleRemoveByProductId(item.productId)}
                  disabled={isCartLoading}
                  aria-label={`Удалить ${item.product.name} из корзины`}
                  title="Удалить из корзины"
                >
                  ✕
                </RemoveButton>
              </CartItem>
            ))}
          </CartItems>

          <CartSummary>
            <h3>Итого</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Адрес доставки</span>
                <input
                  type="text"
                  placeholder="Город, улица, дом, квартира"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  disabled={isCheckingOut || isCartLoading}
                  style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Комментарий к заказу (необязательно)</span>
                <textarea
                  placeholder="Например: позвоните за 30 минут до доставки"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={isCheckingOut || isCartLoading}
                  rows={3}
                  style={{
                    padding: 10,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    resize: 'vertical',
                  }}
                />
              </label>
            </div>

            <SummaryRow>
              <span>Товары ({totalItems})</span>
              <span>{formatNumberRu(totalPrice)} ₽</span>
            </SummaryRow>

            <SummaryRow>
              <span>Доставка</span>
              <span>Бесплатно</span>
            </SummaryRow>

            <TotalRow>
              <span>К оплате</span>
              <span>{formatNumberRu(totalPrice)} ₽</span>
            </TotalRow>

            <CheckoutSection>
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || isCartLoading}
                size="large"
                fullWidth
                variant={ButtonVariant.PRIMARY}
              >
                {isCheckingOut ? 'Оформляем заказ...' : 'Оформить заказ'}
              </Button>

              <div style={{ marginTop: 16 }}>
                <Link href="/" passHref legacyBehavior>
                  <Button variant={ButtonVariant.OUTLINE} size="medium" fullWidth>
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </CheckoutSection>
          </CartSummary>
        </div>
      </CartPageContainer>
    </>
  );
};

// Полностью отключаем SSR для страницы корзины
export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
