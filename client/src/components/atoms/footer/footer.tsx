import { ContactsBar } from '@/features/contacts-bar/contacts-bar';

import {
  FooterContainer,
  FooterContent,
  FooterGrid,
  FooterSection,
  FooterLink,
  FooterText,
  FooterBottom,
  Logo,
  LogoIcon,
  FooterContentWrapper,
} from './footer.style';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <FooterContainer className={className}>
      {/* <ContactSupport /> */}

      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo>
              <LogoIcon>D</LogoIcon>
              Dyson Group
            </Logo>
            <FooterText>
              Официальный магазин техники Dyson в России. Инновационные решения для дома с гарантией
              качества.
            </FooterText>
            <FooterText>
              📞 8 (800) 555-35-35
              <br />
              📧 dyson-group@yandex.com
            </FooterText>

            <ContactsBar />
          </FooterSection>

          <FooterContentWrapper>
            <FooterSection>
              <h3>Каталог</h3>
              <FooterLink href="/category/vacuum-cleaners">Пылесосы</FooterLink>
              <FooterLink href="/category/hair-care">Уход за волосами</FooterLink>
              <FooterLink href="/category/air-treatment">Очистители воздуха</FooterLink>
              <FooterLink href="/category/accessories">Аксессуары</FooterLink>
            </FooterSection>

            <FooterSection>
              <h3>Покупателям</h3>

              <FooterLink href="/delivery">Доставка</FooterLink>
              {/* <FooterLink href="/payment">Оплата</FooterLink> */}
              <FooterLink href="/warranty">Гарантия</FooterLink>
              <FooterLink href="/returns">Возврат</FooterLink>
              {/* <FooterLink href="/service">Сервис</FooterLink> */}
            </FooterSection>

            <FooterSection>
              <h3>О компании</h3>
              <FooterLink href="/about">О нас</FooterLink>
              <FooterLink href="/contacts">Контакты</FooterLink>
              {/* <FooterLink href="/news">Новости</FooterLink> */}
              {/* <FooterLink href="/reviews">Отзывы</FooterLink> */}
            </FooterSection>
          </FooterContentWrapper>
        </FooterGrid>

        <FooterBottom>
          <p>© 2024 DysonGroup. Все права защищены.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};
