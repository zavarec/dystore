'use client';

import { useEffect, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { tokens } from '@/styles/shared';

import { BreadcrumbArrow } from '../atoms/breadcrumb-arrow/breadcrumb-arrow';

const PANEL_Z = 2147483000; // выше большинства оверлеев

export const CHAT_CONTAINER_ID = 'dystore-chat-container';

const panelCommon = css`
  position: fixed;
  inset: auto 24px 24px auto; /* bottom-right */
  width: 420px;
  height: 560px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  background: #111; /* подложка на момент монтирования iframe */
  z-index: ${PANEL_Z};
`;

// на мобильных — «окно» с отступами со всех сторон
const mobile = css`
  @media (max-width: 767px) {
    inset: max(env(safe-area-inset-top), 15%) max(env(safe-area-inset-right), 16px)
      max(env(safe-area-inset-bottom), 16px) max(env(safe-area-inset-left), 16px);
    width: auto;
    height: auto;
    border-radius: 4px;
  }
`;

const Panel = styled.div<{ open: boolean }>`
  ${panelCommon};
  ${mobile};
  display: ${({ open }) => (open ? 'block' : 'none')};

  /* плавное появление контейнера при открытии чата */
  opacity: 1;
  transition: opacity 0.2s ease;
`;

const Header = styled.div`
  position: absolute;
  inset: 0 0 auto 0;
  background-color: ${tokens.colors.semantic.background.primary};
  height: 44px;
  margin-bottom: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${tokens.colors.semantic.text.muted};
  /* background: linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0)); */
  z-index: ${PANEL_Z + 1};
  pointer-events: none; /* не перекрывать поле ввода в iframe */
`;

const ChatIframeHolder = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 44px; /* место под заголовок */

  /* стили для дочерних элементов (amo вставит iframe внутрь) */
  > div,
  > iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    display: block !important;
  }

  /* можно даже задать общий фон, пока чат грузится */
  background-color: ${tokens.colors.semantic.background.primary} !important;

  @global {
    div[class*='styles_message__2NxOH styles_message_outgoing__3Iu4e'] {
      background: #f3f3f3 !important;
      color: #222 !important;
    }
  }
`;

/** Панель-контейнер, в которую AmoCRM врежет iframe чата (mode: 'frame') */
export default function ChatPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const bind = () => {
      try {
        window.amoSocialButton?.('onChatShow', () => setOpen(true));
        window.amoSocialButton?.('onChatHide', () => setOpen(false));
      } catch {}
    };
    // Вешаем обработчики после инициализации amo
    const t = setTimeout(bind, 1500);
    return () => clearTimeout(t);
  }, []);

  const onClose = () => window.amoSocialButton?.('runChatHide');

  return (
    <Panel id="dystore-chat-panel" aria-label="Чат поддержки Dyson Group" open={open}>
      {/* Заголовка у amo можно не рисовать — свой «крестик» оставим поверх */}
      <Header>
        Чат поддержки Dyson Group
        <BreadcrumbArrow
          style={{
            transform: 'rotate(90deg)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
          }}
          fill={tokens.colors.semantic.text.primary}
          width="20px"
          height="20px"
          onClick={onClose}
        />
        {/* </CloseBtn> */}
      </Header>
      {/* В ЭТОТ div amoCRM вставит свой iframe */}
      <ChatIframeHolder
        id={CHAT_CONTAINER_ID}
        // style={{ width: '100%', height: '100%', paddingTop: '44px' }}
      />
    </Panel>
  );
}
