import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// Создание кэша для Emotion - потому что стили должны быть быстрыми как Dyson
export function createEmotionCache() {
  let insertionPoint: HTMLElement | undefined;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache(
    insertionPoint
      ? {
          key: 'css',
          prepend: true,
          insertionPoint,
        }
      : {
          key: 'css',
          prepend: true,
        },
  );
}

export const clientSideEmotionCache = createEmotionCache();
