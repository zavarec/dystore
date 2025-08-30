import React, { useState } from 'react';
import { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { useLocalStorage } from '@/utils/ssr';
import { safeLocalStorage } from '@/utils/ssr';
import { CartService, OrdersService } from '@/services';

import {
  CartPageContainer,
  CartHeader,
  CartTitle,
  CartItems,
  CartItem,
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
} from '@/styles/pages/cart.style';
import { NoSSR } from '@/components/atoms/no-ssr/no-ssr';

interface SimpleCartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Компонент загрузки корзины
const CartLoading = () => (
  <CartPageContainer>
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div>Загрузка корзины...</div>
    </div>
  </CartPageContainer>
);

// Основной компонент корзины
const CartContent: React.FC = () => {
  const router = useRouter();
  const [isLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comment, setComment] = useState('');

  // ✅ ИСПРАВЛЕНИЕ: Безопасная работа с корзиной
  const [items, setItems, isHydrated] = useLocalStorage('simpleCart', []);

  // Безопасные вычисления только после hydration
  const cartItems = isHydrated ? (items as SimpleCartItem[]) : [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (!isHydrated) return;

    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    setItems(updatedCart);

    // Уведомляем другие компоненты об обновлении
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    if (!isHydrated) return;

    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setItems(updatedCart);

    toast.info('Товар удален из корзины', {
      position: 'bottom-right',
      autoClose: 2000,
    });

    // Уведомляем другие компоненты об обновлении
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleClearCart = () => {
    if (!isHydrated) return;

    setItems([]);
    toast.info('Корзина очищена', {
      position: 'bottom-right',
      autoClose: 2000,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCheckout = async () => {
    if (!isHydrated || cartItems.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Проверка авторизации
      const token = safeLocalStorage.getItem('access_token');
      if (!token) {
        toast.error('Авторизуйтесь, чтобы оформить заказ');
        router.push('/login/login');
        return;
      }

      // Синхронизируем локальную корзину с серверной
      await Promise.all(
        cartItems.map(item =>
          CartService.addToCart({ productId: item.productId, quantity: item.quantity }),
        ),
      );

      // Создаем заказ
      const payload: { deliveryAddress: string; comment?: string } = {
        deliveryAddress: deliveryAddress || 'Адрес не указан',
      };
      const trimmedComment = comment.trim();
      if (trimmedComment) {
        payload.comment = trimmedComment;
      }
      await OrdersService.createOrder(payload);

      toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Очищаем корзину после успешного заказа
      handleClearCart();

      // Перенаправляем на главную страницу
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

  // Показываем пустую корзину
  if (isHydrated && cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>Корзина - DyStore</title>
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

  // Показываем корзину с товарами
  return (
    <>
      <Head>
        <title>Корзина ({totalItems} товаров) - DyStore</title>
        <meta
          name="description"
          content={`В корзине ${totalItems} товаров на сумму ${totalPrice.toLocaleString('ru-RU')} ₽. Оформите заказ с быстрой доставкой.`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <CartPageContainer>
        <CartHeader>
          <CartTitle>Корзина ({totalItems} товаров)</CartTitle>
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
                    src={item.imageUrl}
                    alt={item.name}
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain' }}
                  />
                </ItemImage>

                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>{item.price.toLocaleString('ru-RU')} ₽</ItemPrice>
                </ItemInfo>

                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={isLoading}
                  >
                    −
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    disabled={isLoading}
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>

                <RemoveButton
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isLoading}
                  aria-label={`Удалить ${item.name} из корзины`}
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
                  disabled={isCheckingOut || isLoading}
                  style={{ padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>Комментарий к заказу (необязательно)</span>
                <textarea
                  placeholder="Например: позвоните за 30 минут до доставки"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={isCheckingOut || isLoading}
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
              <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </SummaryRow>
            <SummaryRow>
              <span>Доставка</span>
              <span>Бесплатно</span>
            </SummaryRow>
            <TotalRow>
              <span>К оплате</span>
              <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </TotalRow>
            <CheckoutSection>
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}
                size="large"
                fullWidth
                variant={ButtonVariant.PRIMARY}
              >
                {isCheckingOut ? 'Оформляем заказ...' : 'Оформить заказ'}
              </Button>
              <div style={{ marginTop: '16px' }}>
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

const CartPage: NextPage = () => {
  return (
    <NoSSR fallback={<CartLoading />}>
      <CartContent />
    </NoSSR>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};

export default CartPage;
