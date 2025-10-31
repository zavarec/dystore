import Head from 'next/head';
import Image from 'next/image';

import { FaqSection } from '@/components/sections/faq/faq';
import { COMPANY_INFO } from '@/constants/contacts.constants';
import {
  ContactsCard,
  ContactsCardContent,
  ContactsCardIcon,
  ContactsCardList,
  ContactsCardText,
  ContactsCardTitle,
  ContactsCTA,
  ContactsGrid,
  ContactsHero,
  ContactsHeroContent,
  ContactsHeroImage,
  ContactsHeroOverlay,
  ContactsHeroSubtitle,
  ContactsHeroTitle,
  ContactsPageContainer,
  ContactsSection,
} from '@/styles/pages/contacts.style';

const ContactsPage = () => {
  const org = {
    name: 'Dyson-group',
    url: 'https://dyson-group.ru',
    phone: COMPANY_INFO.COMPANY_PHONE_NUMBER,
    email: COMPANY_INFO.COMPANY_EMAIL_ADRESS,
    sameAs: ['https://youtube.com/@dyson', 'https://t.me/dystore'],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: org.phone,
        contactType: 'customer support',
        areaServed: 'RU',
        availableLanguage: ['ru', 'en'],
      },
    ],
    sameAs: org.sameAs,
  };

  return (
    <>
      <Head>
        <title>Contact us — {org.name}</title>
        <meta
          name="description"
          content="Expert customer service, 7 days a week. Chat, phone, email and social support."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ContactsPageContainer>
        <ContactsHero>
          <ContactsHeroImage
            src="https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/e42863cb-3fc4-4b54-9d17-ab59c0bce31c-Support-hero-RCC-hidden-mobile-tablet.jpg"
            alt="Dyson contact hero background"
            fill
            priority
          />
          <ContactsHeroOverlay />
          <ContactsHeroContent>
            <ContactsHeroTitle>Свяжитесь с нами</ContactsHeroTitle>
            <ContactsHeroSubtitle>Профессиональная поддержка, 7 дней в неделю</ContactsHeroSubtitle>
          </ContactsHeroContent>
        </ContactsHero>

        <ContactsSection>
          <ContactsGrid>
            <ContactsCard>
              <ContactsCardContent>
                <ContactsCardIcon>
                  <Image
                    src="/images/icons/contacts/phone.png"
                    alt="phone"
                    width={48}
                    height={48}
                  />
                </ContactsCardIcon>
                <ContactsCardTitle>Телефон</ContactsCardTitle>
                <ContactsCardText>
                  <p>Позвоните нам — специалисты на линии 7&nbsp;дней в&nbsp;неделю.</p>
                  <p>Мы ответим на вопросы о технике, заказах и сервисе.</p>
                  <p>Время работы: с&nbsp;9:00 до&nbsp;20:00 (Мск).</p>
                </ContactsCardText>
              </ContactsCardContent>

              <ContactsCTA href="tel:+78005501474">Позвоните</ContactsCTA>
            </ContactsCard>

            <ContactsCard>
              <ContactsCardContent>
                <ContactsCardIcon>
                  <Image
                    src="/images/icons/contacts/telegram.png"
                    alt="chat"
                    width={48}
                    height={48}
                  />
                </ContactsCardIcon>

                <ContactsCardTitle>Telegram</ContactsCardTitle>

                <ContactsCardText>
                  <p>
                    Напишите нам в <strong>Telegram</strong> — специалист ответит быстро и поможет
                    разобраться с любым вопросом.
                  </p>
                  <br />

                  <p>Мы всегда на связи: расскажем о товарах, подскажем с заказом и доставкой.</p>
                  <br />

                  <p>Нажмите «Открыть чат», чтобы начать общение прямо сейчас.</p>
                </ContactsCardText>
              </ContactsCardContent>

              <ContactsCTA href="tg://resolve?domain=dyson_group_bot">Открыть чат</ContactsCTA>
            </ContactsCard>

            <ContactsCard>
              <ContactsCardContent>
                <ContactsCardIcon>
                  <Image
                    src="/images/icons/contacts/email.png"
                    alt="email"
                    width={48}
                    height={48}
                  />
                </ContactsCardIcon>

                <ContactsCardTitle>Email</ContactsCardTitle>

                <ContactsCardText>
                  <p>Напишите нам — специалисты ответят в течение рабочего дня.</p>
                  <br />

                  <p>Мы поможем с выбором техники, заказом и решением любых вопросов.</p>
                  <br />

                  <p>Нажмите «Отправить письмо», чтобы связаться с нами по электронной почте.</p>
                </ContactsCardText>
              </ContactsCardContent>

              <ContactsCTA href="mailto:dyson-group@yandex.com">Отправить письмо</ContactsCTA>
            </ContactsCard>

            <ContactsCard>
              <ContactsCardContent>
                <ContactsCardIcon>
                  <Image src="/images/icons/contacts/chat.png" alt="chat" width={48} height={48} />
                </ContactsCardIcon>
                <ContactsCardTitle>Чат поддержки</ContactsCardTitle>

                <ContactsCardText as="div">
                  <p>
                    Наш цифровой ассистент <strong>Dyson</strong> доступен 24/7.
                  </p>
                  <br />
                  <p>
                    Если вы не нашли нужную информацию или вам требуется дополнительная помощь, вас
                    переведут к одному из наших экспертов.
                  </p>
                  <br />

                  <p>Время работы специалистов: с 7:00 до 00:00 по Московскому времени.</p>
                  <br />

                  <p>
                    Чтобы начать чат, нажмите на иконку чата
                    <br /> в правом нижнем углу экрана.
                  </p>
                </ContactsCardText>
              </ContactsCardContent>
            </ContactsCard>

            <ContactsCard>
              <ContactsCardContent>
                <ContactsCardIcon>
                  <Image
                    src="/images/icons/contacts/youtube.png"
                    alt="youtube"
                    width={48}
                    height={48}
                  />
                </ContactsCardIcon>
                <ContactsCardTitle>YouTube и социальные сети</ContactsCardTitle>
                <ContactsCardText>
                  <p>Следите за новинками и советами по уходу за техникой в наших соцсетях.</p>
                  <br />
                  <p>
                    На канале <strong>YouTube</strong> и в&nbsp;<strong>Telegram</strong> мы делимся
                    обзорами, инструкциями и полезными лайфхаками.
                  </p>
                </ContactsCardText>
                <ContactsCardList>
                  <li>
                    YouTube:{'  '}
                    <a href="https://youtube.com/dyson" target="_blank" rel="noreferrer">
                      youtube.com/dyson
                    </a>
                  </li>

                  <li>
                    *Instagram:{' '}
                    <a href="https://www.instagram.com/dyson" target="_blank" rel="noreferrer">
                      @dyson
                    </a>
                  </li>
                </ContactsCardList>
              </ContactsCardContent>
              *Запрещены на территории РФ
            </ContactsCard>
          </ContactsGrid>
        </ContactsSection>

        <FaqSection />
      </ContactsPageContainer>
    </>
  );
};

export default ContactsPage;
