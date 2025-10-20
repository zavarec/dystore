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

export const DeliveryAndPayment: React.FC<{
  breadcrumbs?: Array<{ href: string; label: string }>;
}> = ({
  breadcrumbs = [
    { href: '/', label: 'Главная' },
    { href: '/delivery', label: 'Доставка и оплата' },
  ],
}) => (
  <AboutCompanyPageWrapper>
    <AboutCompanyHeadingRow>
      <AboutCompanyHeadingInner>
        <AboutCompanyTitle>Условия доставки и оплаты</AboutCompanyTitle>
      </AboutCompanyHeadingInner>
    </AboutCompanyHeadingRow>

    <AboutCompanyContainer>
      <AboutCompanySection>
        <AboutCompanyBlockTitle>Доставка</AboutCompanyBlockTitle>
        <AboutCompanyText>
          Мы доставляем заказы по всей России курьерскими службами и в пункты выдачи. Срок и
          стоимость зависят от региона и будут рассчитаны на этапе оформления заказа.
        </AboutCompanyText>
        <AboutCompanyList>
          <li>
            <strong>Курьерская доставка.</strong> До двери в удобный день и время, по согласованию
            со службой доставки.
          </li>
          <li>
            <strong>Пункты выдачи.</strong> Выберите ближайший ПВЗ при оформлении.
          </li>
          <li>
            <strong>Самовывоз (если доступно).</strong> Адрес и режим работы точки самовывоза
            указаны на странице оформления.
          </li>
          <li>
            <strong>Упаковка.</strong> Товар отгружается в фирменной/транспортной упаковке с защитой
            от повреждений.
          </li>
        </AboutCompanyList>

        <AboutCompanyBlockTitle>Важная информация о доставке</AboutCompanyBlockTitle>
        <AboutCompanyList>
          <li>
            Проверьте целостность упаковки и комплектность при получении. В случае повреждений
            составьте акт с курьером и сразу свяжитесь с нами.
          </li>
          <li>Изменение адреса возможно до передачи заказа в службу доставки.</li>
          <li>Повторная доставка при отсутствии получателя может быть платной.</li>
        </AboutCompanyList>

        <AboutCompanyBlockTitle>Оплата</AboutCompanyBlockTitle>
        <AboutCompanyText>
          Мы поддерживаем безопасные способы оплаты. Данные банковских карт обрабатываются в
          соответствии с отраслевыми стандартами безопасности.
        </AboutCompanyText>
        <AboutCompanyList>
          <li>
            <strong>Банковские карты.</strong> Visa, MasterCard, «Мир».
          </li>
          <li>
            <strong>Онлайн-оплата.</strong> Быстрый платёж (СБП), интернет-банкинг (если доступно).
          </li>
          <li>
            <strong>Безналичный расчёт для юр. лиц.</strong> По счёту/договору, после подтверждения
            менеджером.
          </li>
        </AboutCompanyList>

        <AboutCompanyText>
          Квитанции и закрывающие документы отправляются на электронную почту, указанную при
          оформлении заказа.
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
