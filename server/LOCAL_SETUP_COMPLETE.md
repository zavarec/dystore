# 🚀 Локальная настройка dystore сервера

## ✅ Выполненные шаги

### 1. 🗑️ Удаление Docker

- Удален `docker-compose.yml`
- Приложение полностью переведено на локальную PostgreSQL

### 2. 🐘 PostgreSQL настройка

- Используется локальный PostgreSQL@14 (Homebrew)
- База данных: `dystore`
- Подключение: `postgresql://mac@localhost:5432/dystore`

### 3. 🗂️ Конфигурация

- Создан файл `.env` с настройками для локальной БД
- Настроены переменные окружения для JWT, Redis, SMS

### 4. 🔄 Prisma миграции

- Статус миграций: ✅ База данных схема актуальна
- Prisma клиент сгенерирован
- Все таблицы созданы и готовы к работе

### 5. 🌱 Тестовые данные

- База данных заполнена тестовыми данными через seed
- Добавлены категории и продукты для тестирования

## 🛠️ Команды для работы

### Запуск сервера

```bash
cd server
npm run start:dev
```

### Работа с базой данных

```bash
# Статус миграций
npx prisma migrate status

# Новая миграция
npx prisma migrate dev --name название_миграции

# Генерация Prisma клиента
npx prisma generate

# Веб-интерфейс для БД
npx prisma studio

# Заполнение тестовыми данными
curl -X POST http://localhost:3000/seed/database
```

### Управление PostgreSQL

```bash
# Статус сервиса
brew services list | grep postgresql

# Запуск/остановка PostgreSQL
brew services start postgresql@14
brew services stop postgresql@14

# Подключение к БД
psql -U mac -d dystore
```

## 🌐 API Endpoints

Сервер запущен на: **http://localhost:3000**

### Основные endpoints:

- `GET /` - Hello World
- `GET /products` - Список продуктов
- `GET /categories` - Список категорий
- `POST /seed/database` - Заполнение тестовыми данными

### Аутентификация:

- `POST /auth/send-code` - Отправка SMS кода
- `POST /auth/verify-code` - Подтверждение кода
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/profile` - Профиль пользователя

### Продукты:

- `GET /products` - Все продукты
- `GET /products/:id` - Продукт по ID
- `POST /products` - Создать продукт
- `PUT /products/:id` - Обновить продукт
- `DELETE /products/:id` - Удалить продукт

### Корзина:

- `GET /cart` - Корзина пользователя
- `POST /cart/add` - Добавить в корзину
- `DELETE /cart/remove/:productId` - Удалить из корзины
- `GET /cart/total` - Общая сумма корзины

### Заказы:

- `POST /order` - Создать заказ
- `GET /order/history` - История заказов
- `GET /order/:id` - Заказ по ID

## 📊 Проверка работоспособности

```bash
# Проверка основного API
curl http://localhost:3000
# Ответ: Hello World!

# Проверка продуктов
curl http://localhost:3000/products
# Ответ: массив продуктов

# Проверка категорий
curl http://localhost:3000/categories
# Ответ: массив категорий
```

## 🎯 Статус системы

- ✅ PostgreSQL@14 запущен локально
- ✅ База данных `dystore` создана
- ✅ Prisma миграции применены
- ✅ NestJS сервер запущен на порту 3000
- ✅ API endpoints работают
- ✅ Тестовые данные загружены
- ✅ Все зависимости очищены от TypeORM/Docker

## 🔧 Конфигурация .env

```env
# Database
DATABASE_URL="postgresql://mac@localhost:5432/dystore?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"

# Redis (для SMS кодов)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# App
NODE_ENV=development
PORT=3000
```

## 🎉 Готово к разработке!

Сервер полностью настроен и готов к использованию. База данных PostgreSQL работает локально, все API endpoints доступны, и система готова для разработки frontend приложения.
