// src/components/integrations/AmoCrmWidget.tsx
import { tokens } from '@/styles/shared';
import { useEffect } from 'react';

declare global {
  interface Window {
    amoSocialButtonConfig?: any;
    amoSocialButton?: (...args: any[]) => void;
  }
}

type Props = {
  id: string; // из amoCRM (id виджета)
  hash: string; // хэш из amoCRM
  color?: string; // цвет кнопки (опционально)
  userId?: string; // свой идентификатор пользователя (опционально)
  locale?: string; // "ru" по умолчанию
  inline?: boolean; // соответствует параметру inline из скрипта
  containerSelector?: string; // по умолчанию 'custom_chat_holder'
  hideBubble?: boolean;
};

export function AmoCrmWidget({
  id,
  hash,
  color,
  userId,
  locale = 'ru',
  inline = false,
  containerSelector,
}: Props) {
  useEffect(() => {
    if (document.getElementById('amo-crm-button-js')) return;

    const CHAT_THEME = {
      header: false,
      background: '#FFFFFF',
      system_color: tokens.colors.semantic.text.primary,
      message: {
        outgoing_background: `!important #F3F3F3`, // фон сообщений пользователя
        outgoing_color: tokens.colors.semantic.text.primary, // текст пользователя
        incoming_background: '#F3F3F3', // фон ответов оператора
        incoming_color: tokens.colors.semantic.text.primary, // текст ответов
      },
    };

    if (!inline) {
      const style = document.createElement('style');
      style.innerHTML = `
    /* только мобилки */
    @media (max-width: 767px){
      /* контейнер кнопки — прижать вправо-вниз */
      [id^="amo_button"] {
        position: fixed !important;
        right: 10px !important;
        left: auto !important;
        bottom: 16px !important;
        transform: none !important;
        z-index: 2147483000 !important;
        background:#000
      }
    }
  `;
      document.head.appendChild(style);
    }

    window.amoSocialButtonConfig = {
      hidden: false, // фирменный баббл показываем
      onlinechat: {
        mode: 'frame',
        container: containerSelector,
        ...(userId ? { user_id: userId } : {}),
        locale: { extends: locale, compose_placeholder: 'Напишите ваш вопрос…' },
        theme: CHAT_THEME,
      },
    };

    const boot = document.createElement('script');
    boot.id = 'amo-crm-button-js';
    boot.type = 'text/javascript';
    boot.async = true;
    boot.innerHTML = `(function(a,m,o,c,r,m){a[m]={id:"${id}",hash:"${hash}",locale:"${locale}",inline:${inline},setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.amocrm.ru/js/button.js';d.head&&d.head.appendChild(s)}(window,0,'amoSocialButton',0,0,'amo_social_button'));`;

    document.head.appendChild(boot);

    // const bind = () => {
    //   try {
    //     window.amoSocialButton?.('onChatShow', () => {
    //       document.body.classList.add('amochat-open');
    //     });
    //     window.amoSocialButton?.('onChatHide', () => {
    //       document.body.classList.remove('amochat-open');
    //     });
    //   } catch {}
    // };
    // const t = setTimeout(bind, 1500);

    // return () => {
    //   clearTimeout(t);
    //   document.body.classList.remove('amochat-open');
    //   try {
    //     window.amoSocialButton?.('runDestroy');
    //   } catch {}
    //   document.getElementById('amo-crm-button-js')?.remove();
    //   document.getElementById('0_script')?.remove();
    // };

    // необязательно: пример колбэков
    const onReady = () => {
      try {
        window.amoSocialButton?.('onChatReady', () => {
          window.amoSocialButton?.('setMeta', { theme: CHAT_THEME });
          // можно, например, сразу показать чат:
          window.amoSocialButton?.('onChatShow', () => {
            window.amoSocialButton?.('runHide'); // скрыть баббл, когда чат открыт
          });
          window.amoSocialButton?.('onChatHide', () => {
            window.amoSocialButton?.('runShow'); // показать обратно
          });
        });
      } catch {}
    };
    const t = setTimeout(onReady, 2000);
    return () => clearTimeout(t);
  }, [id, hash, color, userId, inline, locale]);

  return null;
}
