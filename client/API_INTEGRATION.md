# Интеграция API - DyStore Frontend

## Обзор

Фронтенд полностью интегрирован с бэкенд API. Все сервисы готовы к использованию.

## Структура сервисов

### 📁 `src/services/`

- `api.ts` - базовый API клиент с axios
- `auth.service.ts` - авторизация и аутентификация
- `products.service.ts` - работа с продуктами
- `categories.service.ts` - работа с категориями
- `cart.service.ts` - работа с корзиной
- `orders.service.ts` - работа с заказами
- `index.ts` - общий экспорт всех сервисов

### 📁 `src/types/`

- `api.types.ts` - типы данных для API
- `models/auth.model.ts` - типы авторизации
- `models/user.model.ts` - типы пользователя

### 📁 `src/store/slices/`

- `products-slice/` - управление продуктами
- `categories-slice/` - управление категориями
- `cart-slice/` - управление корзиной
- `orders-slice/` - управление заказами
- `auth-slice/` - управление авторизацией

## Примеры использования

### Работа с продуктами

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductById } from '@/store/slices/products-slice/products.thunks';

// В компоненте
const dispatch = useDispatch();
const { items, isLoading, error } = useSelector(state => state.products);

// Загрузка всех продуктов
useEffect(() => {
  dispatch(fetchProducts());
}, [dispatch]);

// Загрузка конкретного продукта
const loadProduct = (id: number) => {
  dispatch(fetchProductById(id));
};
```

### Работа с корзиной

```typescript
import { addToCart, fetchCart } from '@/store/slices/cart-slice/cart.thunks';

// Добавление товара в корзину
const handleAddToCart = async (productId: number, quantity: number) => {
  try {
    await dispatch(addToCart({ productId, quantity })).unwrap();
    // Показать уведомление об успехе
  } catch (error) {
    // Обработать ошибку
  }
};

// Загрузка корзины
useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchCart());
  }
}, [dispatch, isAuthenticated]);
```

### Работа с заказами

```typescript
import { createOrder, fetchOrderHistory } from '@/store/slices/orders-slice/orders.slice';

// Создание заказа
const handleCreateOrder = async orderData => {
  try {
    const order = await dispatch(createOrder(orderData)).unwrap();
    // Перенаправить на страницу успеха
    router.push(`/order/${order.id}`);
  } catch (error) {
    // Показать ошибку
  }
};

// Загрузка истории заказов
useEffect(() => {
  dispatch(fetchOrderHistory());
}, [dispatch]);
```

### Авторизация

```typescript
import { AuthService } from '@/services';

// Отправка кода
const sendCode = async (phone: string) => {
  try {
    await AuthService.sendCode({ phone });
    // Показать форму ввода кода
  } catch (error) {
    // Обработать ошибку
  }
};

// Верификация кода
const verifyCode = async (phone: string, code: string) => {
  try {
    const response = await AuthService.verifyCode({ phone, code });
    AuthService.saveToken(response.access_token);
    // Перенаправить в приложение
  } catch (error) {
    // Показать ошибку
  }
};
```

## Настройка окружения

### Environment Variables

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## API Endpoints

### Продукты

- `GET /products` - получить все продукты
- `GET /products/:id` - получить продукт по ID
- `POST /products` - создать продукт (требует авторизации)
- `PUT /products/:id` - обновить продукт (требует авторизации)
- `DELETE /products/:id` - удалить продукт (требует авторизации)

### Категории

- `GET /categories` - получить все категории
- `GET /categories/:id` - получить категорию по ID
- `POST /categories` - создать категорию (требует авторизации)
- `PUT /categories/:id` - обновить категорию (требует авторизации)
- `DELETE /categories/:id` - удалить категорию (требует авторизации)

### Корзина (требует авторизации)

- `GET /cart` - получить корзину
- `POST /cart/add` - добавить товар в корзину
- `DELETE /cart/remove/:productId` - удалить товар из корзины
- `GET /cart/total` - получить общую стоимость

### Заказы (требует авторизации)

- `POST /order` - создать заказ
- `GET /order/history` - получить историю заказов
- `GET /order/:id` - получить детали заказа

### Авторизация

- `POST /auth/send-code` - отправить код верификации
- `POST /auth/verify-code` - проверить код
- `GET /auth/profile` - получить профиль пользователя

## Обработка ошибок

Все сервисы включают автоматическую обработку ошибок:

```typescript
// Перехватчик ошибок в api.ts
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Удаляем токен и перенаправляем на авторизацию
      localStorage.removeItem('access_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);
```

## TypeScript типы

Все типы данных описаны в `src/types/api.types.ts`:

- `Product` - продукт
- `Category` - категория
- `Cart` - корзина
- `CartItem` - элемент корзины
- `Order` - заказ
- `OrderItem` - элемент заказа
- `OrderStatus` - статус заказа

## Состояние загрузки

Каждый slice включает состояние загрузки:

```typescript
interface State extends LoadingState {
  // ... другие поля
}

// LoadingState включает:
// isLoading: boolean
// error: string | null
```

## Redux DevTools

Для отладки включены Redux DevTools в режиме разработки.

## Заключение

Все API эндпоинты полностью интегрированы с фронтендом. Система готова к использованию и включает:

✅ TypeScript типизацию  
✅ Обработку ошибок  
✅ Состояние загрузки  
✅ Авторизацию JWT  
✅ Redux для управления состоянием  
✅ Документацию API
