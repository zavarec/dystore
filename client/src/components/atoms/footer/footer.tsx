import { COMPANY_INFO } from '@/constants/contacts.constants';
import { ContactsBar } from '@/features/contacts-bar/contacts-bar';
import { useAppDispatch } from '@/hooks/redux';
import { setContactModalOpen } from '@/store/slices/uiSlice';

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
  FooterEmailButton,
} from './footer.style';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const dispatch = useAppDispatch();

  const handleContactClick = () => {
    dispatch(setContactModalOpen(true));
  };

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
              📞 {COMPANY_INFO.COMPANY_PHONE_NUMBER}
              <br />
              📧{' '}
              <FooterEmailButton
                type="button"
                onClick={handleContactClick}
                aria-label="Открыть форму обратной связи"
              >
                {COMPANY_INFO.COMPANY_EMAIL_ADRESS}
              </FooterEmailButton>
            </FooterText>

            <ContactsBar />
          </FooterSection>

          <FooterContentWrapper>
            <FooterSection>
              <h3>Каталог</h3>
              <FooterLink href="/category/vacuum-cleaners">Пылесосы</FooterLink>
              <FooterLink href="/category/hair-care">Уход за волосами</FooterLink>
              <FooterLink href="/category/climate-tech">Климатическая техника</FooterLink>
              <FooterLink href="/category/headphones">Наушники</FooterLink>
              {/* <FooterLink href="/category/accessories">Аксессуары</FooterLink> */}
            </FooterSection>

            <FooterSection>
              <h3>Покупателям</h3>

              <FooterLink href="/delivery">Доставка</FooterLink>
              <FooterLink href="/warranty">Гарантия</FooterLink>
              {/* <FooterLink href="/payment">Оплата</FooterLink> */}
              <FooterLink href="/returns">Возврат</FooterLink>
              {/* <FooterLink href="/service">Сервис</FooterLink> */}
              <FooterLink href="/privacy">Политика конфиденциальности</FooterLink>
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
          <p>© 2025 DysonGroup. Все права защищены.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};
