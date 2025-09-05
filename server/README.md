# DysonGroup Backend

Бэкенд для интернет-магазина DysonGroup, построенный на NestJS.

## Возможности

✅ **Аутентификация**

- Вход по номеру телефона с SMS-кодом
- JWT токены для авторизации
- Rate limiting (не чаще 1 раза в минуту)
- Хранение кодов в Redis с TTL

✅ **Управление пользователями**

- Сущность User с UUID, телефоном и именем
- Автоматическое создание пользователя при первом входе

✅ **Категории товаров**

- CRUD операции для категорий
- Поля: id, name, slug
- Связь один-ко-многим с товарами

✅ **Товары**

- CRUD операции для товаров
- Поля: id, name, description, price, stock, categoryId
- Валидация связи с категорией
- Связь многие-к-одному с категорией

✅ **Безопасность**

- Защищенные маршруты через JwtAuthGuard
- Валидация данных через class-validator
- Обработка ошибок с HTTP исключениями

## Технологии

- **NestJS** - фреймворк
- **TypeORM** - ORM для работы с БД
- **SQLite** - база данных (можно заменить на PostgreSQL)
- **Redis** - для хранения кодов верификации
- **JWT** - для авторизации
- **class-validator** - валидация DTO
- **bcrypt** - хеширование паролей
- **Throttler** - rate limiting

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env` (см. `.env.example`):

```env
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. Запустите проект:

```bash
# Режим разработки
npm run start:dev

# Production режим
npm run build
npm run start:prod
```

4. API будет доступен по адресу: `http://localhost:3000`

## Структура проекта

```
src/
├── auth/           # Модуль аутентификации
├── users/          # Модуль пользователей
├── categories/     # Модуль категорий
├── products/       # Модуль товаров
├── common/         # Общие компоненты (guards, decorators)
└── database/       # Настройки БД и seeds
```

## API Documentation

Подробная документация доступна в файле [API_DOCS.md](./API_DOCS.md).

### Основные эндпоинты:

- `POST /auth/send-code` - Отправка SMS-кода
- `POST /auth/verify-code` - Верификация кода
- `GET /auth/profile` - Получение профиля пользователя
- `GET /categories` - Список категорий
- `GET /products` - Список товаров
- `POST /categories` - Создание категории (требует авторизации)
- `POST /products` - Создание товара (требует авторизации)

## Разработка

```bash
# Линтинг
npm run lint

# Тесты
npm run test
npm run test:e2e

# Отладка
npm run start:debug
```

## Примечания

- В режиме разработки используется mock для SMS-отправки
- SQLite БД создается автоматически
- Redis используется как заглушка, если не настроен
- Для продакшена рекомендуется настроить PostgreSQL и Redis
