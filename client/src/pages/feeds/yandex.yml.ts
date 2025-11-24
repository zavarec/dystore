import type { GetServerSideProps } from 'next';

const BACKEND_API_URL = process.env.API_URL_SERVER || 'http://localhost:3001/api';

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const url = `${BACKEND_API_URL}/feeds/yandex.yml`;

  try {
    const upstream = await fetch(url, {
      method: 'GET',
      headers: {
        // Пробрасываем язык/локаль и user-agent — иногда полезно для бэкенда
        'accept-language': req.headers['accept-language'] || '',
        'user-agent': req.headers['user-agent'] || '',
      },
      // кеширование реализуем через заголовки ответа
    });

    // Пробрасываем ключевые заголовки
    res.statusCode = upstream.status;
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(lower)) return;
      res.setHeader(key, value);
    });

    // Гарантируем корректный Content-Type и кэширование
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    }
    if (!res.getHeader('Cache-Control')) {
      res.setHeader('Cache-Control', 'public, max-age=900');
    }

    const xml = await upstream.text();
    res.write(xml);
    res.end();
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.write('Failed to fetch YML feed');
    res.end();
  }

  return { props: {} };
};

// Ничего не рендерим — ответ формируется выше
export default function YandexYmlFeed() {
  return null;
}




