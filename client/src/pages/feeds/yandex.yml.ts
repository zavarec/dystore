import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  // Ходим через внутренний Next API proxy, чтобы избежать внешних сетевых/SSL ограничений
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = req.headers['host'] as string;
  const proxyUrl = `${proto}://${host}/api/proxy/feeds/yandex.yml`;

  try {
    const upstream = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'accept-language': (req.headers['accept-language'] as string) || '',
        'user-agent': (req.headers['user-agent'] as string) || '',
      },
    });

    // Пробрасываем ключевые заголовки
    res.statusCode = upstream.status;
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(lower))
        return;
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
  } catch (e: any) {
    console.error('YML feed proxy error', {
      message: e?.message,
      code: e?.code,
    });
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
