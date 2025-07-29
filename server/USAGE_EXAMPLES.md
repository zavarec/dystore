# Примеры использования API

## Полный пример использования корзины и заказов

### 1. Получение токена авторизации

#### Способ 1: Регистрация и вход по email

```bash
# Регистрируемся с email и паролем
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Иван Иванов"
  }'

# Или входим, если уже зарегистрированы
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Получаем токен в ответе:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": "uuid",
#     "email": "user@example.com",
#     "name": "Иван Иванов"
#   }
# }
```

#### Способ 2: Авторизация через SMS

```bash
# Отправляем код на телефон
curl -X POST http://localhost:3000/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+79001234567"}'

# Подтверждаем код (в реальности код придет по SMS)
curl -X POST http://localhost:3000/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+79001234567", "code": "123456"}'

# Получаем токен в ответе:
# {"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### 2. Создание тестовых данных

```bash
# Устанавливаем токен в переменную (замените на свой)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Создаем категорию
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Электроника", "slug": "electronics"}'

# Создаем товары
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Последний iPhone",
    "price": 99999.99,
    "stock": 10,
    "categoryId": 1
  }'

curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "description": "Мощный ноутбук",
    "price": 199999.99,
    "stock": 5,
    "categoryId": 1
  }'
```

### 3. Работа с корзиной

```bash
# Получаем пустую корзину
curl -X GET http://localhost:3000/cart \
  -H "Authorization: Bearer $TOKEN"

# Добавляем товары в корзину
curl -X POST http://localhost:3000/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'

curl -X POST http://localhost:3000/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 2, "quantity": 1}'

# Проверяем корзину
curl -X GET http://localhost:3000/cart \
  -H "Authorization: Bearer $TOKEN"

# Получаем общую стоимость
curl -X GET http://localhost:3000/cart/total \
  -H "Authorization: Bearer $TOKEN"

# Удаляем товар из корзины
curl -X DELETE http://localhost:3000/cart/remove/2 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Создание заказа

```bash
# Создаем заказ на основе корзины
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddress": "Москва, ул. Примерная, 123",
    "comment": "Оставить у двери"
  }'

# Проверяем, что корзина очистилась
curl -X GET http://localhost:3000/cart \
  -H "Authorization: Bearer $TOKEN"

# Получаем историю заказов
curl -X GET http://localhost:3000/order/history \
  -H "Authorization: Bearer $TOKEN"

# Получаем детали заказа по ID
curl -X GET http://localhost:3000/order/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Просмотр всех товаров и категорий

```bash
# Получаем все категории
curl -X GET http://localhost:3000/categories

# Получаем все товары
curl -X GET http://localhost:3000/products

# Получаем конкретную категорию
curl -X GET http://localhost:3000/categories/1

# Получаем конкретный товар
curl -X GET http://localhost:3000/products/1
```

## Тестирование ошибок

### Попытка добавить больше товара, чем есть на складе

```bash
curl -X POST http://localhost:3000/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 50}'
# Ожидаемый ответ: 400 "Недостаточно товара на складе"
```

### Создание заказа с пустой корзиной

```bash
# Если корзина пуста
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
# Ожидаемый ответ: 400 "Корзина пуста"
```

### Обращение к несуществующему товару

```bash
curl -X DELETE http://localhost:3000/cart/remove/999 \
  -H "Authorization: Bearer $TOKEN"
# Ожидаемый ответ: 404 "Товар не найден в корзине"
```

## Примеры ответов

### Корзина с товарами

```json
{
  "id": 1,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "cartId": 1,
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "iPhone 15",
        "description": "Последний iPhone",
        "price": "99999.99",
        "stock": 8,
        "categoryId": 1
      }
    }
  ]
}
```

### Заказ

```json
{
  "id": 1,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "totalPrice": "199999.98",
  "status": "PENDING",
  "createdAt": "2024-01-01T11:00:00.000Z",
  "items": [
    {
      "id": 1,
      "orderId": 1,
      "productId": 1,
      "quantity": 2,
      "priceAtPurchase": "99999.99",
      "product": {
        "id": 1,
        "name": "iPhone 15",
        "description": "Последний iPhone"
      }
    }
  ]
}
```
