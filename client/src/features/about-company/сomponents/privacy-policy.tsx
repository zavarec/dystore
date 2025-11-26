// src/features/policies/privacy-policy.tsx

import Head from 'next/head';
import Link from 'next/link';

import { COMPANY_INFO } from '@/constants/contacts.constants';
import { PoliciesLayout } from '@/features/policies/policies-layout';

import {
  AboutCompanyBlockTitle,
  AboutCompanyContainer,
  AboutCompanyList,
  AboutCompanyPageWrapper,
  AboutCompanySection,
  AboutCompanyText,
} from '../about-company.style';
import { LINKS } from '@/constants/links.constants';

const TocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      style={{
        textDecoration: 'underline',
      }}
    >
      {children}
    </a>
  </li>
);

export const PrivacyPolicy: React.FC<{
  breadcrumbs?: Array<{ href: string; label: string }>;
}> = ({
  breadcrumbs = [
    { href: '/', label: 'Главная' },
    { href: '/environment', label: 'Экологическая политика' },
  ],
}) => (
  <>
    <Head>
      <title>Политика конфиденциальности | Dyson-Group</title>
      <meta
        name="description"
        content="Политика конфиденциальности интернет-магазина DyStore: какие данные мы собираем, зачем, как защищаем и кому передаём."
      />
      <script
        type="application/ld+json"
        // schema.org для SEO
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PrivacyPolicy',
            name: 'Политика конфиденциальности DyStore',
            url: 'https://dyson-group.ru/privacy',
            publisher: {
              '@type': 'Organization',
              name: 'DyStore',
            },
          }),
        }}
      />
    </Head>

    <PoliciesLayout
      current="privacy-policy"
      title="Политика конфиденциальности"
      breadcrumbsPrefix={breadcrumbs}
    >
      <AboutCompanyPageWrapper as="article">
        <AboutCompanyContainer>
          {/* Заголовок страницы */}
          <AboutCompanySection>
            <AboutCompanyBlockTitle as="h1">Политика конфиденциальности</AboutCompanyBlockTitle>

            {/* Оглавление с якорями */}
            <AboutCompanyText as="nav" aria-label="Оглавление">
              <strong>Содержание</strong>
              <AboutCompanyList as="ol">
                <TocLink href="#general">1. Общие положения</TocLink>
                <TocLink href="#terms">2. Термины и определения</TocLink>
                <TocLink href="#operator-rights">3. Права и обязанности Оператора</TocLink>
                <TocLink href="#subject-rights">4. Права и обязанности субъектов ПДн</TocLink>
                <TocLink href="#principles">5. Принципы обработки ПДн</TocLink>
                <TocLink href="#purposes">6. Цели, состав данных и основания</TocLink>
                <TocLink href="#conditions">7. Условия обработки</TocLink>
                <TocLink href="#order">8. Порядок обработки и защита</TocLink>
                <TocLink href="#actions">9. Действия с ПДн</TocLink>
                <TocLink href="#crossborder">10. Трансграничная передача</TocLink>
                <TocLink href="#confidentiality">11. Конфиденциальность</TocLink>
                <TocLink href="#final">12. Заключительные положения</TocLink>
              </AboutCompanyList>
            </AboutCompanyText>
          </AboutCompanySection>

          {/* 1. Общие положения */}
          <AboutCompanySection id="general">
            <AboutCompanyBlockTitle as="h2">1. Общие положения</AboutCompanyBlockTitle>
            <AboutCompanyText as="p">
              Настоящая Политика составлена в соответствии с Федеральным законом от 27.07.2006 №
              152-ФЗ «О персональных данных» и определяет порядок обработки и меры по обеспечению
              безопасности персональных данных, предпринимаемые ИП МУРСАЛОВ ХАЯЛ АРИФ ОГЛЫ (далее —
              «Оператор»).
            </AboutCompanyText>
            <AboutCompanyList as="ul">
              <li>
                Оператор соблюдает права и свободы человека и гражданина при обработке персональных
                данных, включая право на неприкосновенность частной жизни, личную и семейную тайну.
              </li>
              <li>
                Политика применяется ко всей информации, которую Оператор может получить о
                посетителях веб-сайта{' '}
                <Link href="https://dyson-group.ru" target="_blank">
                  dyson-group.ru
                </Link>
                .
              </li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 2. Термины */}
          <AboutCompanySection id="terms">
            <AboutCompanyBlockTitle as="h2">2. Термины и определения</AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>
                <strong>Автоматизированная обработка</strong> — обработка с помощью средств
                вычислительной техники.
              </li>
              <li>
                <strong>Блокирование</strong> — временное прекращение обработки (кроме случаев
                уточнения).
              </li>
              <li>
                <strong>Веб-сайт</strong> — совокупность материалов и ПО по адресу dyson-group.ru.
              </li>
              <li>
                <strong>Информационная система ПДн</strong> — базы ПДн и обеспечивающие их обработку
                средства.
              </li>
              <li>
                <strong>Обезличивание</strong> — действия, исключающие без доп. информации
                определение субъекта.
              </li>
              <li>
                <strong>Обработка ПДн</strong> — любые действия с ПДн (сбор, хранение, передача,
                удаление и т.д.).
              </li>
              <li>
                <strong>Оператор</strong> — лицо, которое определяет цели и состав обработки ПДн.
              </li>
              <li>
                <strong>Персональные данные</strong> — любая информация о Пользователе сайта.
              </li>
              <li>
                <strong>Пользователь</strong> — посетитель веб-сайта.
              </li>
              <li>
                <strong>Трансграничная передача</strong> — передача ПДн на территорию иностранного
                государства.
              </li>
              <li>
                <strong>Уничтожение</strong> — безвозвратное уничтожение ПДн или носителей.
              </li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 3. Права/обязанности оператора */}
          <AboutCompanySection id="operator-rights">
            <AboutCompanyBlockTitle as="h2">
              3. Права и обязанности Оператора
            </AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>Получать достоверные документы, содержащие ПДн.</li>
              <li>Продолжать обработку без согласия при основаниях, предусмотренных законом.</li>
              <li>Определять состав мер для выполнения требований №152-ФЗ.</li>
              <li>
                Предоставлять субъекту ПДн информацию об обработке, отвечать на запросы и
                уведомления уполномоченного органа.
              </li>
              <li>Обеспечивать защиту ПДн и прекращать их обработку в предусмотренных случаях.</li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 4. Права/обязанности субъектов */}
          <AboutCompanySection id="subject-rights">
            <AboutCompanyBlockTitle as="h2">
              4. Права и обязанности субъектов персональных данных
            </AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>
                Получать сведения об обработке своих ПДн; требовать уточнения, блокирования или
                уничтожения.
              </li>
              <li>Отозвать согласие, выдвигать условие предварительного согласия на маркетинг.</li>
              <li>Обжаловать действия (бездействие) Оператора в уполномоченный орган или суд.</li>
              <li>Обязанности: предоставлять достоверные данные и сообщать об их актуализации.</li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 5. Принципы */}
          <AboutCompanySection id="principles">
            <AboutCompanyBlockTitle as="h2">
              5. Принципы обработки персональных данных
            </AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>Законность и справедливость обработки.</li>
              <li>Соответствие операций заранее определённым и законным целям.</li>
              <li>Недопустимость объединения несовместимых баз.</li>
              <li>Минимизация и актуальность данных относительно целей.</li>
              <li>Хранение не дольше необходимого срока.</li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 6. Цели/состав/основания — адаптировано под твой кейс */}
          <AboutCompanySection id="purposes">
            <AboutCompanyBlockTitle as="h2">
              6. Цели обработки, состав данных и правовые основания
            </AboutCompanyBlockTitle>

            <AboutCompanyText as="h3">6.1 Цели</AboutCompanyText>
            <AboutCompanyList as="ul">
              <li>Оформление и исполнение заказов, обратная связь, сервисная поддержка.</li>
              <li>Отправка уведомлений о статусе заказа и информационных писем.</li>
              <li>Улучшение качества сервиса и аналитика использования сайта.</li>
            </AboutCompanyList>

            <AboutCompanyText as="h3">6.2 Состав данных</AboutCompanyText>
            <AboutCompanyList as="ul">
              <li>ФИО, телефон, электронная почта (при оформлении заказа/обращении).</li>
              <li>Технические данные: IP-адрес, cookies, сведения о браузере.</li>
              <li>Адрес доставки (если требуется для договора купли-продажи).</li>
            </AboutCompanyList>

            <AboutCompanyText as="h3">6.3 Правовые основания</AboutCompanyText>
            <AboutCompanyList as="ul">
              <li>Договор (публичная оферта) с Пользователем.</li>
              <li>Федеральный закон № 152-ФЗ «О персональных данных».</li>
            </AboutCompanyList>

            <AboutCompanyText as="h3">6.4 Виды обработки</AboutCompanyText>
            <AboutCompanyList as="ul">
              <li>Сбор, запись, систематизация, хранение, обезличивание, уничтожение.</li>
              <li>Отправка информационных писем на e-mail.</li>
              <li>
                Передача третьим лицам: службы доставки, SMS-провайдеры, платёжные системы, CRM.
              </li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 7. Условия обработки */}
          <AboutCompanySection id="conditions">
            <AboutCompanyBlockTitle as="h2">
              7. Условия обработки персональных данных
            </AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>Обработка с согласия субъекта ПДн.</li>
              <li>Обработка для исполнения договора или требований закона.</li>
              <li>Обработка для защиты прав и законных интересов при соблюдении прав субъекта.</li>
              <li>Обработка общедоступных ПДн и подлежащих раскрытию по закону.</li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 8. Порядок/защита */}
          <AboutCompanySection id="order">
            <AboutCompanyBlockTitle as="h2">
              8. Порядок сбора, хранения, передачи и защита ПДн
            </AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>Оператор принимает правовые, организационные и технические меры защиты ПДн.</li>
              <li>
                Передача третьим лицам — только по закону или при согласии субъекта/для исполнения
                договора.
              </li>
              <li>
                Актуализация ПДн и отзыв согласия:{' '}
                <a style={{ textDecoration: 'underline' }} href={LINKS.SUPPORT_EMAIL_MAILTO}>
                  {COMPANY_INFO.SUPPORT_EMAIL_ADRESS}
                </a>{' '}
                .
              </li>
              <li>
                Срок обработки определяется целями; по достижении целей ПДн
                уничтожаются/обезличиваются.
              </li>
              <li>
                Информация, собираемая сторонними сервисами (платёжные системы, средства связи, CRM
                и т.п.), обрабатывается ими по их Политикам конфиденциальности; Оператор не отвечает
                за действия третьих лиц.
              </li>
            </AboutCompanyList>
          </AboutCompanySection>

          {/* 9. Действия с ПДн */}
          <AboutCompanySection id="actions">
            <AboutCompanyBlockTitle as="h2">
              9. Перечень действий с персональными данными
            </AboutCompanyBlockTitle>
            <AboutCompanyText as="p">
              Сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение),
              извлечение, использование, передача (распространение, предоставление, доступ),
              обезличивание, блокирование, удаление, уничтожение; в том числе автоматизированная
              обработка.
            </AboutCompanyText>
          </AboutCompanySection>

          {/* 10. Трансграничная передача */}
          <AboutCompanySection id="crossborder">
            <AboutCompanyBlockTitle as="h2">
              10. Трансграничная передача персональных данных
            </AboutCompanyBlockTitle>
            <AboutCompanyText as="p">
              Оператор, при необходимости трансграничной передачи ПДн, соблюдает требования
              законодательства РФ, включая уведомление уполномоченного органа в установленных
              случаях.
            </AboutCompanyText>
          </AboutCompanySection>

          {/* 11. Конфиденциальность */}
          <AboutCompanySection id="confidentiality">
            <AboutCompanyBlockTitle as="h2">
              11. Конфиденциальность персональных данных
            </AboutCompanyBlockTitle>
            <AboutCompanyText as="p">
              Оператор и иные получившие доступ лица обязуются не раскрывать третьим лицам и не
              распространять ПДн без согласия субъекта, если иное не предусмотрено федеральным
              законом.
            </AboutCompanyText>
          </AboutCompanySection>

          {/* 12. Заключительные положения */}
          <AboutCompanySection id="final">
            <AboutCompanyBlockTitle as="h2">12. Заключительные положения</AboutCompanyBlockTitle>
            <AboutCompanyList as="ul">
              <li>
                Вопросы по обработке ПДн:{' '}
                <a style={{ textDecoration: 'underline' }} href={LINKS.SUPPORT_EMAIL_MAILTO}>
                  {COMPANY_INFO.SUPPORT_EMAIL_ADRESS}
                </a>{' '}
                .
              </li>
              <li>
                Политика действует бессрочно до замены новой версией. Актуальная версия:
                https://dyson-group.ru/privacy
              </li>
              <li>
                <li>
                  Компания имеет право отправлять Пользователю уведомления о новых продуктах и
                  услугах, специальных предложениях и различных событиях. <br />
                  Пользователь может отказаться от получения сообщений, направив Компании письмо на
                  адрес электронной почты {''}
                  <a style={{ textDecoration: 'underline' }} href={LINKS.SUPPORT_EMAIL_MAILTO}>
                    {COMPANY_INFO.SUPPORT_EMAIL_ADRESS}
                  </a>{' '}
                  с пометкой «Отказ от уведомлений».
                </li>
              </li>
            </AboutCompanyList>
          </AboutCompanySection>
        </AboutCompanyContainer>
      </AboutCompanyPageWrapper>
    </PoliciesLayout>
  </>
);
