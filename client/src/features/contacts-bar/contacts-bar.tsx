import Image from 'next/image';
import Link from 'next/link';

import styled from '@emotion/styled';

import { useAppDispatch } from '@/hooks';
import { setContactModalOpen } from '@/store/slices/uiSlice';
import { media } from '@/styles/breakpoints';
import { tokens } from '@/styles/shared';
import { LINKS } from '@/constants/links.constants';

export const FooterContactsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  flex-wrap: wrap;
  padding: ${tokens.spacing.lg} 0;
  border-top: 1px solid #e5e5e5;

  ${media.down('tablet')} {
    gap: ${tokens.spacing.md};
    padding: ${tokens.spacing.md} 0;
    justify-content: center;
  }
`;

export const ContactItem = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 8px solid;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  ${media.down('tablet')} {
    width: 44px;
    height: 44px;
  }
`;

export const Icon = styled(Image)`
  object-fit: contain;
`;

export const ContactsBar = () => {
  const dispatch = useAppDispatch();

  const handleContactClick = (e: React.MouseEvent, name: string) => {
    if (name === 'Email') {
      e.preventDefault();
      dispatch(setContactModalOpen(true));
    }
  };
  const items = [
    {
      name: 'Telegram',
      href: 'tg://resolve?domain=dyson_group_bot',
      src: '/images/icons/contacts/telegram.png',
      alt: 'Telegram',
    },
    {
      name: 'Phone',
      href: LINKS.PHONE_TEL,
      src: '/images/icons/contacts/phone.png',
      alt: 'Позвонить',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@dystore',
      src: '/images/icons/contacts/youtube.png',
      alt: 'YouTube',
    },
    {
      name: 'Email',
      href: 'mailto:support@dyson-group.ru',
      src: '/images/icons/contacts/email.png',
      alt: 'Email',
    },
  ];

  return (
    <FooterContactsWrapper>
      {items.map(({ name, href, src, alt }) => (
        <ContactItem
          key={name}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          aria-label={alt}
          onClick={e => handleContactClick(e, name)}
        >
          <Icon src={src} alt={alt} fill sizes="32px" />
        </ContactItem>
      ))}
    </FooterContactsWrapper>
  );
};
