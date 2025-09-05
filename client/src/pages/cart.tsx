import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { CartService, OrdersService } from '@/services';

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

import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '@/store/slices/cart-slice/cart.selectors';
import { formatNumberRu } from '@/utils/format';
import { Cart, CartItem as CartItemType } from '@/types/models/cart.model';
import { clearCart, removeFromCart } from '@/store/slices/cart-slice/cart.thunks';
import axios from 'axios';

type CartPateProps = {
  initialCart: Cart | null;
};

// Основной компонент корзины
const CartContent: React.FC<CartPateProps> = ({ initialCart }) => {
  const router = useRouter();
  const [isLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comment, setComment] = useState('');

  const dispatch = useAppDispatch();
  // Redux-данные (после гидрации попадут сюда)
  const storeItems = useAppSelector(selectCartItems);
  const storeTotalItems = useAppSelector(selectCartTotalItems);
  const storeTotalPrice = useAppSelector(selectCartTotalPrice);

  // SSR-фоллбек
  const ssrItems = (initialCart?.items ?? []) as CartItemType[];
  const ssrTotalItems = ssrItems.reduce((s, it) => s + (it.quantity || 0), 0);
  const ssrTotalPrice = ssrItems.reduce((s, it) => s + Number(it.product.price) * it.quantity, 0);

  // финальные источники данных: если в сторе уже есть – берём их, иначе SSR
  const cartItems = storeItems && storeItems.length ? storeItems : ssrItems;
  const totalItems = storeItems && storeItems.length ? storeTotalItems : ssrTotalItems;
  const totalPrice = storeItems && storeItems.length ? storeTotalPrice : ssrTotalPrice;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const product = cartItems.find((i: CartItemType) => i.id === itemId);
    if (!product) return;
    // dispatch(setQuantity({ productId: product.productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: number) => {
    const product = cartItems.find((i: CartItemType) => i.id === itemId);
    if (!product) return;
    dispatch(removeFromCart(product.productId));

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
    if (cartItems.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Проверка авторизации: пробуем создать заказ, сервер вернет 401 при отсутствии куки

      // Синхронизируем локальную корзину с серверной
      await Promise.all(
        cartItems.map((item: CartItemType) =>
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
  if (cartItems.length === 0) {
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

  // Показываем корзину с товарами
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
          <CartTitle suppressHydrationWarning>
            Корзина ({mounted ? totalItems : 0} товаров)
          </CartTitle>
        </CartHeader>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
          }}
        >
          <CartItems>
            {cartItems.map((item: CartItemType) => (
              <CartItem key={item.id}>
                <ItemImage>
                  <Image
                    src={item.product.imageUrl ?? '/images/placeholder.webp'}
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
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>

                <RemoveButton
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isLoading}
                  aria-label={`Удалить ${item.product.name} из корзины`}
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

const CartPage: NextPage<CartPateProps> = ({ initialCart }) => {
  return (
    // <NoSSR fallback={<CartLoading />}>
    <CartContent initialCart={initialCart} />
    // </NoSSR>
  );
};

function appendSetCookies(res: any, ...cookieSets: Array<string[] | undefined>) {
  const list = cookieSets.flat().filter(Boolean) as string[];
  if (list.length) {
    // если уже были set-cookie – склеим
    const existed = res.getHeader('Set-Cookie') as string[] | undefined;
    const all = [...(existed ?? []), ...list];
    res.setHeader('Set-Cookie', all);
  }
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, res, locale } = ctx;

  const cookie = req.headers.cookie ?? '';

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
    // важно: нам нужны сырые заголовки и тело как есть
    validateStatus: () => true,
  });

  // 1) тянем корзину гостя (GET /cart). Это не требует CSRF.
  const cartResp = await api.get('/cart', {
    headers: { Cookie: cookie },
  });
  // Пробрасываем ВСЕ Set-Cookie от API обратно клиенту (cart_id и т.п.)
  appendSetCookies(res, cartResp.headers['set-cookie']);
  // Если API вернул не OK — можно показать пустую корзину
  const initialCart = cartResp.status === 200 ? (cartResp.data ?? null) : null;
  // 2) сразу выдадим и CSRF (GET /csrf), чтобы первый POST прошёл без ошибки
  const csrfResp = await api.get('/csrf', {
    headers: { Cookie: cookie },
  });
  appendSetCookies(res, csrfResp.headers['set-cookie']);

  const i18n = await serverSideTranslations(locale ?? 'ru', ['common']);

  return {
    props: {
      initialCart,
      ...i18n,
    },
  };
};

export default CartPage;
