import { Fragment } from 'react';

import Link from 'next/link';

import {
  AboutCompanyBlockTitle,
  AboutCompanyContainer,
  AboutCompanyCrumbLink,
  AboutCompanyCrumbSep,
  AboutCompanyFooterBar,
  AboutCompanyFooterInner,
  AboutCompanyHeadingInner,
  AboutCompanyHeadingRow,
  AboutCompanyList,
  AboutCompanyPageWrapper,
  AboutCompanySection,
  AboutCompanyText,
  AboutCompanyTitle,
} from '../about-company.style';

export const ReturnsPolicy: React.FC<{
  breadcrumbs?: Array<{ href: string; label: string }>;
}> = ({
  breadcrumbs = [
    { href: '/', label: 'Главная' },
    { href: '/returns', label: 'Возврат товара' },
  ],
}) => (
  <AboutCompanyPageWrapper>
    <AboutCompanyHeadingRow>
      <AboutCompanyHeadingInner>
        <AboutCompanyTitle>Условия возврата товара</AboutCompanyTitle>
      </AboutCompanyHeadingInner>
    </AboutCompanyHeadingRow>

    <AboutCompanyContainer>
      <AboutCompanySection>
        <AboutCompanyText>
          Мы стремимся, чтобы покупки приносили только положительные впечатления. Если товар вам не
          подошёл, вы можете оформить возврат в установленные сроки при соблюдении условий ниже.
        </AboutCompanyText>

        <AboutCompanyBlockTitle>Сроки и условия</AboutCompanyBlockTitle>
        <AboutCompanyList>
          <li>
            Возврат возможен в течение <strong>14 календарных дней</strong> с момента получения,
            если товар не был в использовании и сохранён товарный вид.
          </li>
          <li>
            Технически сложные товары подлежат возврату при наличии производственного дефекта либо в
            рамках гарантийного обслуживания.
          </li>
          <li>Упаковка, пломбы и комплектующие должны быть сохранены.</li>
        </AboutCompanyList>

        <AboutCompanyBlockTitle>Как оформить возврат</AboutCompanyBlockTitle>
        <AboutCompanyList>
          <li>
            Свяжитесь с нами: <strong>support@dystore.ru</strong> или{' '}
            <strong>+7 (495) 000-00-00</strong>.
          </li>
          <li>
            Укажите номер заказа, причину возврата и приложите фото/видео (при необходимости).
          </li>
          <li>
            Мы согласуем способ возврата: курьером, в пункт выдачи или самовывозом (если доступно).
          </li>
        </AboutCompanyList>

        <AboutCompanyBlockTitle>Возврат денежных средств</AboutCompanyBlockTitle>
        <AboutCompanyList>
          <li>Деньги возвращаются тем же способом оплаты, который использовался при покупке.</li>
          <li>
            Срок зачисления — от <strong>3 до 10 рабочих дней</strong> после приёмки и проверки
            товара.
          </li>
        </AboutCompanyList>

        <AboutCompanyText>
          Пожалуйста, сохраняйте документы и чек до завершения процедуры возврата.
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
