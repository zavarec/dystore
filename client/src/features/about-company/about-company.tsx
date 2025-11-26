import {
  AboutCompanyBlockTitle,
  AboutCompanyContainer,
  AboutCompanyEmail,
  AboutCompanyList,
  AboutCompanyPageWrapper,
  AboutCompanySection,
  AboutCompanyText,
} from './about-company.style';
import { PoliciesLayout } from '../policies/policies-layout';
import { LINKS } from '@/constants/links.constants';
import { COMPANY_INFO } from '@/constants/contacts.constants';

type CompanyInfo = {
  heading?: string;
  companyName: string;
  legalCompanyName?: string;
  addressLines: string[];
  companyNumberLabel?: string;
  companyNumber?: string;
  contactText?: string;
  contactEmailLabel?: string;
  contactEmail?: string;
  breadcrumbs?: Array<{ href: string; label: string }>;
};

export const AboutCompany: React.FC<CompanyInfo> = ({
  heading = 'О компании',
  companyName = 'Dyson-group',
  addressLines = ['Tetbury Hill', 'Malmesbury', 'Wiltshire', 'SN16 0RP'],
  companyNumberLabel = 'Company number (registered in England and Wales)',
  companyNumber = '01959090',
  contactText = 'If you have any questions, comments or concerns about how we use your personal information, please e-mail our Privacy Team at any time at',
  contactEmailLabel = 'privacy@dyson.com',
  contactEmail = 'privacy@dyson.com',
  legalCompanyName = 'ИП Мурсалов Хаял Ариф Оглы',
  breadcrumbs = [
    { href: '/', label: 'Главная' },
    { href: '/terms', label: 'Условия' },
  ],
}) => {
  return (
    <PoliciesLayout current="about" title={heading} breadcrumbsPrefix={breadcrumbs}>
      <AboutCompanyPageWrapper>
        <AboutCompanyContainer>
          <AboutCompanySection aria-labelledby="company-info">
            <AboutCompanyBlockTitle id="company-info">{heading}</AboutCompanyBlockTitle>
            <AboutCompanyText>
              <strong>{companyName}</strong> — это официальный онлайн-магазин премиальной техники
              Dyson в России. Мы создаём пространство, где инновации, дизайн и забота о доме
              объединяются в одно.
            </AboutCompanyText>

            <AboutCompanyText>
              Наш приоритет — честный сервис, прозрачные условия и оригинальная продукция Dyson,
              доставляемая напрямую от официальных партнёров.
            </AboutCompanyText>

            <AboutCompanyBlockTitle>Наша миссия</AboutCompanyBlockTitle>
            <AboutCompanyText>
              Сделать технологии Dyson доступными каждому дому, сохраняя идеальные стандарты
              обслуживания и подлинное качество бренда. Мы тщательно подбираем ассортимент, уделяя
              внимание каждой детали — от упаковки до постпродажной поддержки.
            </AboutCompanyText>

            <AboutCompanyBlockTitle>Почему выбирают нас</AboutCompanyBlockTitle>
            <AboutCompanyList>
              <li> Только оригинальная техника Dyson с официальной гарантией.</li>
              <li> Быстрая доставка по всей России и возможность самовывоза.</li>
              <li>Поддержка клиентов 7 дней в неделю — онлайн-чат, телефон, Telegram.</li>
              <li> Простая система возврата и обмена.</li>
              <li>Эксклюзивные предложения и акции на популярные модели.</li>
            </AboutCompanyList>

            <AboutCompanyBlockTitle>Юридическая информация</AboutCompanyBlockTitle>
            <AboutCompanyText>
              <strong>{legalCompanyName}</strong>
            </AboutCompanyText>
            {addressLines.map((line, i) => (
              <AboutCompanyText key={i}>{line}</AboutCompanyText>
            ))}

            {(companyNumberLabel || companyNumber) && (
              <AboutCompanyText>
                {companyNumberLabel} – {companyNumber}
              </AboutCompanyText>
            )}

            <AboutCompanyText>
              {contactText}{' '}
              <AboutCompanyEmail href={LINKS.SUPPORT_EMAIL_MAILTO}>
                {COMPANY_INFO.SUPPORT_EMAIL_ADRESS}
              </AboutCompanyEmail>
              .
            </AboutCompanyText>
          </AboutCompanySection>
        </AboutCompanyContainer>
      </AboutCompanyPageWrapper>
    </PoliciesLayout>
  );
};

export default AboutCompany;
