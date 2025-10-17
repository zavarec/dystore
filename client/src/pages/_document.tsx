import type { DocumentContext, DocumentInitialProps } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';

import createEmotionServer from '@emotion/server/create-instance';

import { createEmotionCache } from '@/utils/emotion';
import { AppType } from 'next/app';

interface MyDocumentProps extends DocumentInitialProps {
  emotionStyleTags: JSX.Element[];
}

export default class MyDocument extends Document<MyDocumentProps> {
  static override async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map(style => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  override render() {
    return (
      <Html lang="ru">
        <Head>
          {/* Preconnect только к сервисам шрифтов */}
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

          {/* Emotion стили */}
          {this.props.emotionStyleTags}

          {/* DNS prefetch для внешних ресурсов */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          <link rel="icon" href="/favicon.ico?v=2" />

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
    (
      function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { 
            return; 
          }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104687310', 'ym');

    ym(104687310, 'init', {
    ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true
    })
  `,
            }}
          >
            ;
          </script>
          <noscript>
            <div>
              <img
                src="https://mc.yandex.ru/watch/104687310"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                }}
                alt=""
              />
            </div>
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
