import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { TopHeaderContainer, TopHeaderContent, TopLogo, TopNav } from './top-header.style';

export const TopHeader: React.FC = () => {
  return (
    <TopHeaderContainer>
      <TopHeaderContent>
        <TopLogo href="/" aria-label="Домой">
          <Image
            src="https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/2fa45b9c-691a-4027-aa83-3e800e2a35a4-dyson-logo.svg"
            alt="DysonGroup"
            width={74}
            height={28}
            sizes="(max-width: 768px) 40vw, 20vw"
            priority
          />
        </TopLogo>

        <TopNav>
          <Link href="/delivery">Доставка</Link>
          <Link href="/delivery">Оплата</Link>
          <Link href="/about">О нас</Link>
          <Link href="/contacts">Контакты</Link>
        </TopNav>
      </TopHeaderContent>
    </TopHeaderContainer>
  );
};
