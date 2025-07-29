# DyStore API Documentation

## Обзор

REST API для интернет-магазина DyStore, построенный на NestJS.

## Аутентификация

### Регистрация по email

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов"
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов"
  }
}
```

### Вход по email

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов"
  }
}
```

### Отправка кода верификации (альтернативный способ через SMS)

```http
POST /auth/send-code
Content-Type: application/json

{
  "phone": "+79001234567"
}
```

**Ответ:**

```json
{
  "message": "Код отправлен"
}
```

**Ограничения:** Не чаще 1 раза в минуту с одного номера телефона.

### Верификация кода (альтернативный способ через SMS)

```http
POST /auth/verify-code
Content-Type: application/json

{
  "phone": "+79001234567",
  "code": "123456"
}
```

**Ответ:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Получение профиля

```http
GET /auth/profile
Authorization: Bearer {token}
```

**Ответ:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "+79001234567",
  "name": "Иван Иванов",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Категории

### Получить все категории

```http
GET /categories
```

**Ответ:**

```json
[
  {
    "id": 1,
    "name": "Электроника",
    "slug": "electronics",
    "products": [...]
  }
]
```

### Получить категорию по ID

```http
GET /categories/{id}
```

### Создать категорию (требует авторизации)

```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Электроника",
  "slug": "electronics"
}
```

### Обновить категорию (требует авторизации)

```http
PUT /categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Обновленное название",
  "slug": "updated-slug"
}
```

### Удалить категорию (требует авторизации)

```http
DELETE /categories/{id}
Authorization: Bearer {token}
```

## Товары

### Получить все товары

```http
GET /products
```

**Ответ:**

```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "description": "Последний iPhone",
    "price": "99999.99",
    "stock": 10,
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Электроника",
      "slug": "electronics"
    }
  }
]
```

### Получить товар по ID

```http
GET /products/{id}
```

### Создать товар (требует авторизации)

```http
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Последний iPhone",
  "price": 99999.99,
  "stock": 10,
  "categoryId": 1
}
```

### Обновить товар (требует авторизации)

```http
PUT /products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Обновленное название",
  "price": 89999.99,
  "stock": 5
}
```

### Удалить товар (требует авторизации)

```http
DELETE /products/{id}
Authorization: Bearer {token}
```

## Корзина (требует авторизации)

### Получить корзину

```http
GET /cart
Authorization: Bearer {token}
```

**Ответ:**

```json
{
  "id": 1,
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "iPhone 15",
        "price": "99999.99",
        "stock": 10
      }
    }
  ]
}
```

### Добавить товар в корзину

```http
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

**Ответ:** Возвращает обновленную корзину.

### Удалить товар из корзины

```http
DELETE /cart/remove/{productId}
Authorization: Bearer {token}
```

**Ответ:** Возвращает обновленную корзину.

### Получить общую стоимость корзины

```http
GET /cart/total
Authorization: Bearer {token}
```

**Ответ:**

```json
{
  "total": 199999.98
}
```

## Заказы (требует авторизации)

### Создать заказ

```http
POST /order
Authorization: Bearer {token}
Content-Type: application/json

{
  "deliveryAddress": "Москва, ул. Примерная, 123",
  "comment": "Оставить у двери"
}
```

**Ответ:**

```json
{
  "id": 1,
  "userId": "uuid",
  "totalPrice": "199999.98",
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "priceAtPurchase": "99999.99",
      "product": {
        "id": 1,
        "name": "iPhone 15"
      }
    }
  ]
}
```

**Примечание:** Заказ создается на основе текущей корзины. После создания заказа корзина очищается.

### Получить историю заказов

```http
GET /order/history
Authorization: Bearer {token}
```

**Ответ:**

```json
[
  {
    "id": 1,
    "totalPrice": "199999.98",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "items": [...]
  }
]
```

### Получить детали заказа

```http
GET /order/{id}
Authorization: Bearer {token}
```

**Ответ:** Полная информация о заказе включая товары.

## Статусы заказа

- `PENDING` - В ожидании оплаты
- `PAID` - Оплачен
- `SHIPPED` - Отправлен
- `DELIVERED` - Доставлен

## Коды ошибок

- `400` - Неверные данные запроса
- `401` - Необходима авторизация
- `404` - Ресурс не найден
- `429` - Превышен лимит запросов
- `500` - Внутренняя ошибка сервера

## Валидация

Все DTO валидируются с помощью class-validator:

- Номера телефонов должны быть в российском формате
- Цены должны быть положительными числами
- Количества должны быть больше 0
- Обязательные поля не могут быть пустыми
- Slug категории должен быть уникальным

## Бизнес-логика

- При добавлении товара в корзину проверяется наличие на складе
- При создании заказа пересчитывается стоимость по актуальным ценам
- Если товара недостаточно на складе, заказ не создается
- У каждого пользователя может быть только одна активная корзина
- После создания заказа корзина автоматически очищается

## Настройка окружения

Создайте файл `.env` со следующими переменными:

```env
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=sqlite://database.sqlite
```
