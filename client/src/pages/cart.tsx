import React, { useEffect, useState } from 'react';
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

interface SimpleCartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

const CartPage: NextPage = () => {
  const router = useRouter();
  const [items, setItems] = useState<SimpleCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Загружаем корзину из localStorage
  const loadCart = () => {
    const cartData = localStorage.getItem('simpleCart');
    if (cartData) {
      try {
        const cart: SimpleCartItem[] = JSON.parse(cartData);
        setItems(cart);
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  // Сохраняем корзину в localStorage
  const saveCart = (cart: SimpleCartItem[]) => {
    localStorage.setItem('simpleCart', JSON.stringify(cart));
    setItems(cart);
    // Обновляем счетчик в хедере
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const updatedCart = items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    saveCart(updatedCart);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedCart = items.filter(item => item.id !== itemId);
    saveCart(updatedCart);

    toast.info('Товар удален из корзины', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleClearCart = () => {
    saveCart([]);
    toast.info('Корзина очищена', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Имитация отправки заказа
      await new Promise(resolve => setTimeout(resolve, 1500));

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

  if (items.length === 0) {
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
              {/* <ContinueShoppingButton as="a">Перейти к покупкам</ContinueShoppingButton> */}
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
            {items.map(item => (
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
};

export default CartPage;
