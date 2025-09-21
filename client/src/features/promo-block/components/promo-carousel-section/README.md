# PromoCarouselSection - Стилизованные компоненты

## Новые компоненты

### Title

Стилизованный компонент для заголовков слайдов с возможностью настройки:

**Пропсы:**

- `$color?: string` - цвет текста
- `$fontSize?: string` - размер шрифта (по умолчанию: '28px')
- `$fontWeight?: string | number` - вес шрифта
- `$lineHeight?: string` - высота строки (по умолчанию: '1.2')
- `$margin?: string` - отступы (по умолчанию: '0 0 8px')

### Subtitle

Стилизованный компонент для подзаголовков слайдов с возможностью настройки:

**Пропсы:**

- `$color?: string` - цвет текста
- `$fontSize?: string` - размер шрифта (по умолчанию: '16px')
- `$fontWeight?: string | number` - вес шрифта
- `$lineHeight?: string` - высота строки (по умолчанию: '1.5')
- `$margin?: string` - отступы (по умолчанию: '0 0 12px')
- `$opacity?: number` - прозрачность (по умолчанию: 0.95)

## Использование в данных карусели

```typescript
const carouselData = {
  kind: 'carousel',
  slides: [
    {
      id: 'slide-1',
      title: 'Заголовок слайда',
      subtitle: 'Подзаголовок слайда',
      // Стили для заголовка
      titleColor: '#ffffff',
      titleSize: '32px',
      titleWeight: 'bold',
      titleLineHeight: '1.1',
      titleMargin: '0 0 16px',
      // Стили для подзаголовка
      subtitleColor: '#f0f0f0',
      subtitleSize: '18px',
      subtitleWeight: 'normal',
      subtitleLineHeight: '1.4',
      subtitleMargin: '0 0 20px',
      subtitleOpacity: 0.9,
    },
  ],
};
```

## Примеры стилизации

### Большой заголовок с жирным шрифтом

```typescript
titleSize: '48px',
titleWeight: 'bold',
titleColor: '#ffffff'
```

### Маленький подзаголовок с прозрачностью

```typescript
subtitleSize: '14px',
subtitleOpacity: 0.8,
subtitleColor: '#cccccc'
```

### Кастомные отступы

```typescript
titleMargin: '20px 0 10px 0',
subtitleMargin: '0 0 30px 0'
```

## DropdownWithContentSection

Если в JSON вместо `kind: 'carousel'` указать `kind: 'dropdown'`, будет отрисован
компонент с выпадающим списком и карточками.

```json
{
  "kind": "dropdown",
  "bgColor": "#050505",
  "options": [
    {
      "id": "wet",
      "label": "Discover wet cleaning",
      "title": "Discover wet cleaning",
      "subtitle": "Explore attachments engineered for wet messes.",
      "cards": [
        {
          "id": "card-1",
          "title": "Motorised Submarine™ wet roller head",
          "description": "Removes liquid spills, debris and tough stains from hard floors...",
          "media": { "type": "image", "src": "https://..." }
        },
        {
          "id": "card-2",
          "title": "Removes the dirt others leave behind",
          "description": "Some wet cleaners leave marks and streaks behind...",
          "media": { "type": "image", "src": "https://..." }
        }
      ]
    }
  ]
}
```

В выпадающем списке используются значения `label`, а блок ниже обновляется в зависимости от выбранной опции.

## MachineHighlightsSection

Для секции вида «Machine highlights» используйте `kind: 'highlights'` и перечислите карточки
в массиве `items`:

```json
{
  "kind": "highlights",
  "heading": "Machine highlights",
  "subheading": "Key engineering details at a glance.",
  "items": [
    {
      "id": "h1",
      "title": "Deep cleans debris and pet hair",
      "description": "Dyson Motorbar™ cleaner head sucks up dirt and dust...",
      "media": { "type": "image", "src": "https://…" }
    },
    {
      "id": "h2",
      "title": "Low-profile hard floor cleaning",
      "description": "Illuminated cleaner head reaches further under furniture.",
      "media": { "type": "image", "src": "https://…" }
    }
  ]
}
```

Опционально можно задать `columns` (по умолчанию 3), `bgColor` и `textColor` для кастомизации внешнего вида.
