# Модальное окно аутентификации с кнопкой закрытия

## Описание

Реализовано модальное окно для аутентификации по номеру телефона с удобной кнопкой закрытия и автоматическим управлением состоянием.

## Компоненты

### 1. PhoneAuthForm

Основная форма аутентификации с опциональной кнопкой закрытия:

```typescript
interface PhoneAuthFormProps {
  onClose?: () => void; // Колбэк для закрытия
  showCloseButton?: boolean; // Показывать ли встроенную кнопку закрытия
}
```

**Использование:**

```typescript
// Как отдельная страница (без кнопки закрытия)
<PhoneAuthForm />

// В модальном окне с собственной кнопкой закрытия
<PhoneAuthForm
  onClose={handleClose}
  showCloseButton={true}
/>
```

### 2. PhoneAuthModal

Готовый компонент модального окна с формой аутентификации:

```typescript
interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Использование:**

```typescript
const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

<PhoneAuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
/>
```

### 3. Modal (базовый компонент)

Универсальное модальное окно с встроенной кнопкой закрытия:

```typescript
<Modal
  isOpen={isOpen}
  onClose={onClose}
  closeOnOverlayClick={true}  // Закрытие по клику на оверлей
  closeOnEsc={true}          // Закрытие по Escape
>
  {children}
</Modal>
```

## Логика работы в Header

### Умное поведение кнопки "Войти"

```typescript
const handleAuthClick = () => {
  if (isAuthenticated) {
    router.push('/profile');
  } else {
    // На главной странице открываем модальное окно
    if (router.pathname === '/') {
      setIsAuthModalOpen(true);
    } else {
      // На остальных страницах переходим на страницу авторизации
      router.push('/auth');
    }
  }
};
```

### Автоматическое закрытие после авторизации

```typescript
useEffect(() => {
  if (isAuthenticated && isAuthModalOpen) {
    setIsAuthModalOpen(false);
  }
}, [isAuthenticated, isAuthModalOpen]);
```

## Способы закрытия модального окна

### 1. Кнопка ✕ в правом верхнем углу

- Всегда видна в Modal компоненте
- Стилизована с hover эффектами
- Доступна с клавиатуры (tab навигация)

### 2. Клик по оверлею (фону)

- Включен по умолчанию
- Можно отключить через `closeOnOverlayClick={false}`

### 3. Клавиша Escape

- Включена по умолчанию
- Можно отключить через `closeOnEsc={false}`

### 4. Автоматическое закрытие

- После успешной авторизации
- При переходе между страницами (если нужно)

## Стили кнопки закрытия

```css
.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #e5e5e5;
  transform: scale(1.05);
}
```

## Accessibility (доступность)

- ✅ **ARIA метки**: `aria-label="Закрыть модальное окно"`
- ✅ **Клавиатурная навигация**: Tab, Enter, Escape
- ✅ **Focus trap**: Фокус остается внутри модального окна
- ✅ **Screen reader support**: Понятные описания для программ чтения с экрана
- ✅ **Блокировка скролла**: Предотвращает скролл фона

## Примеры использования

### 1. Простое модальное окно на главной странице

```typescript
const HomePage = () => {
  // Модальное окно откроется автоматически при клике "Войти"
  return (
    <div>
      <Header /> {/* Содержит PhoneAuthModal */}
      <main>Контент главной страницы</main>
    </div>
  );
};
```

### 2. Кастомное модальное окно

```typescript
const CustomAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Войти через модальное окно
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PhoneAuthForm
          onClose={() => setIsOpen(false)}
          showCloseButton={false} // Используем кнопку Modal
        />
      </Modal>
    </>
  );
};
```

### 3. Форма с собственной кнопкой закрытия

```typescript
const StandaloneAuthForm = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'relative' }}>
      <PhoneAuthForm
        onClose={() => setIsVisible(false)}
        showCloseButton={true} // Показываем встроенную кнопку
      />
    </div>
  );
};
```

## UX преимущества

1. **Быстрый доступ**: Не нужно покидать текущую страницу
2. **Интуитивность**: Кнопка ✕ в привычном месте
3. **Гибкость**: Несколько способов закрытия
4. **Responsiveness**: Адаптивный дизайн для мобильных
5. **Автоматизация**: Умное закрытие после авторизации

## Тестирование

### Чек-лист функциональности

- [ ] Модальное окно открывается при клике "Войти" на главной
- [ ] Кнопка ✕ закрывает модальное окно
- [ ] Клик по фону закрывает модальное окно
- [ ] Escape закрывает модальное окно
- [ ] Модальное окно закрывается после успешной авторизации
- [ ] Форма работает корректно внутри модального окна
- [ ] Анимации плавные и не прерываются
- [ ] На мобильных устройствах все элементы доступны
- [ ] Tab навигация работает корректно
- [ ] Screen readers корректно читают содержимое

### Сценарии тестирования

1. **Успешная авторизация через модальное окно**
2. **Отмена авторизации через кнопку ✕**
3. **Отмена авторизации через Escape**
4. **Отмена авторизации через клик по фону**
5. **Переключение между вводом номера и кода**
6. **Тестирование на разных размерах экрана**
