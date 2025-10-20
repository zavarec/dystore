import { PoliciesLayout } from '@/features/policies/policies-layour';

import {
  AboutCompanyBlockTitle,
  AboutCompanyContainer,
  AboutCompanyList,
  AboutCompanyPageWrapper,
  AboutCompanySection,
  AboutCompanyText,
} from '../about-company.style';

export const WarrantyService: React.FC<{
  breadcrumbs?: Array<{ href: string; label: string }>;
}> = () => (
  <PoliciesLayout current="warranty" title="Гарантийное обслуживание">
    <AboutCompanyPageWrapper>
      <AboutCompanyContainer>
        <div
          style={{
            padding: '0px',
          }}
        >
          <AboutCompanySection>
            <AboutCompanyText>
              На всю оригинальную продукцию распространяется официальная гарантия производителя.
              Срок и условия зависят от категории товара и указываются в гарантийном талоне/на
              странице товара.
            </AboutCompanyText>

            <AboutCompanyBlockTitle>Что покрывает гарантия</AboutCompanyBlockTitle>
            <AboutCompanyList>
              <li>Заводские дефекты материалов и/или сборки.</li>
              <li>Бесплатный ремонт или замена узлов в авторизованных сервисных центрах.</li>
              <li>Консультации по диагностике и эксплуатации.</li>
            </AboutCompanyList>

            <AboutCompanyBlockTitle>Что не является гарантийным случаем</AboutCompanyBlockTitle>
            <AboutCompanyList>
              <li>Следы механических повреждений, попадание влаги, следы вскрытия.</li>
              <li>
                Нарушение правил эксплуатации, использование неоригинальных расходников/аксессуаров.
              </li>
              <li>Естественный износ расходных материалов (фильтры, щётки и т.п.).</li>
            </AboutCompanyList>

            <AboutCompanyBlockTitle>Как обратиться по гарантии</AboutCompanyBlockTitle>
            <AboutCompanyList>
              <li>Подготовьте: товар, гарантийный талон и документ, подтверждающий покупку.</li>
              <li>
                Свяжитесь с нами: <strong>support@dystore.ru</strong> или{' '}
                <strong>+7 (495) 000-00-00</strong>. Мы подскажем ближайший авторизованный сервис.
              </li>
              <li>Передайте устройство в сервисный центр согласно инструкции оператора.</li>
            </AboutCompanyList>

            <AboutCompanyText>
              Сроки диагностики и ремонта устанавливаются сервисным центром и зависят от характера
              неисправности и наличия запчастей.
            </AboutCompanyText>
          </AboutCompanySection>
        </div>
      </AboutCompanyContainer>
    </AboutCompanyPageWrapper>
  </PoliciesLayout>
);
