// src/components/integrations/AmoCrmWidget.tsx
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
};

export function AmoCrmWidget({ id, hash, color = '#000', userId, locale = 'ru' }: Props) {
  useEffect(() => {
    // чтобы не вставлять скрипт дважды
    if (document.getElementById('amo-crm-button-js')) return;

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
    }
  }
`;
    document.head.appendChild(style);

    // 1) конфиг виджета — ДО подключения скрипта
    window.amoSocialButtonConfig = {
      hidden: false,
      color,
      onlinechat: {
        mode: 'widget', // плавающий чат справа снизу
        ...(userId ? { user_id: userId } : {}),
        locale: {
          extends: 'ru',
          compose_placeholder: 'Напишите ваш вопрос…',
        },
        theme: {
          header: false,
        },
      },
    };

    // 2) сам скрипт

    const boot = document.createElement('script');
    boot.id = 'amo-crm-button-js';
    boot.type = 'text/javascript';
    boot.async = true;
    boot.innerHTML = `(function(a,m,o,c,r,m){a[m]={id:"${id}",hash:"${hash}",locale:"${locale}",inline:false,setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.amocrm.ru/js/button.js';d.head&&d.head.appendChild(s)}(window,0,'amoSocialButton',0,0,'amo_social_button'));`;

    document.head.appendChild(boot);

    // необязательно: пример колбэков
    const onReady = () => {
      try {
        window.amoSocialButton?.('onChatReady', () => {
          // можно, например, сразу показать чат:
          // window.amoSocialButton?.('runChatShow');
        });
      } catch {}
    };
    const t = setTimeout(onReady, 2000);
    return () => clearTimeout(t);
  }, [id, hash, color, userId]);

  return null;
}
