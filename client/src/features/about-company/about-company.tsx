import { Fragment } from 'react';

import Link from 'next/link';

import {
  AboutCompanyBlockTitle,
  AboutCompanyContainer,
  AboutCompanyCrumbLink,
  AboutCompanyCrumbSep,
  AboutCompanyEmail,
  AboutCompanyFooterBar,
  AboutCompanyFooterInner,
  AboutCompanyHeadingInner,
  AboutCompanyHeadingRow,
  AboutCompanyList,
  AboutCompanyPageWrapper,
  AboutCompanySection,
  AboutCompanyText,
  AboutCompanyTitle,
} from './about-company.style';

type CompanyInfo = {
  heading?: string;
  companyName: string;
  addressLines: string[];
  companyNumberLabel?: string;
  companyNumber?: string;
  contactText?: string;
  contactEmailLabel?: string;
  contactEmail?: string;
  breadcrumbs?: Array<{ href: string; label: string }>;
};

export const AboutCompany: React.FC<CompanyInfo> = ({
  heading = 'Company information',
  companyName = 'Dyson-group',
  addressLines = ['Tetbury Hill', 'Malmesbury', 'Wiltshire', 'SN16 0RP'],
  companyNumberLabel = 'Company number (registered in England and Wales)',
  companyNumber = '01959090',
  contactText = 'If you have any questions, comments or concerns about how we use your personal information, please e-mail our Privacy Team at any time at',
  contactEmailLabel = 'privacy@dyson.com',
  contactEmail = 'privacy@dyson.com',
  breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/inside', label: 'Inside Dyson' },
    { href: '/terms', label: 'Terms' },
  ],
}) => {
  return (
    <AboutCompanyPageWrapper>
      <AboutCompanyHeadingRow>
        <AboutCompanyHeadingInner>
          <AboutCompanyTitle>{heading}</AboutCompanyTitle>
        </AboutCompanyHeadingInner>
      </AboutCompanyHeadingRow>

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
            <strong>{companyName}</strong>
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
            <AboutCompanyEmail href={`mailto:${contactEmail}`}>
              {contactEmailLabel}
            </AboutCompanyEmail>
            .
          </AboutCompanyText>
        </AboutCompanySection>
      </AboutCompanyContainer>

      <AboutCompanyFooterBar>
        <AboutCompanyFooterInner>
          {breadcrumbs.map((b, i) => (
            <Fragment key={b.href + i}>
              {i > 0 && <AboutCompanyCrumbSep>/</AboutCompanyCrumbSep>}
              <Link href={b.href} passHref legacyBehavior>
                <AboutCompanyCrumbLink>{b.label}</AboutCompanyCrumbLink>
              </Link>
            </Fragment>
          ))}
        </AboutCompanyFooterInner>
      </AboutCompanyFooterBar>
    </AboutCompanyPageWrapper>
  );
};

export default AboutCompany;
