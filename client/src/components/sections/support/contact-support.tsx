import {
  ContactSupportBody,
  ContactSupportCard,
  ContactSupportContainer,
  ContactSupportLead,
  ContactSupportSchedule,
  ContactSupportSection,
  ContactSupportTitle,
} from './contact-support.style';

export const ContactSupport: React.FC = () => {
  return (
    <ContactSupportSection>
      <ContactSupportContainer>
        <ContactSupportCard>
          <ContactSupportTitle>
            Поможем выбрать и настроить — просто напишите нам
          </ContactSupportTitle>
          <ContactSupportLead>
            Есть вопрос по устройству или нужен совет? Загляните на страницу поддержки или свяжитесь
            с нами удобным способом: мессенджеры, e-mail или звонок.
          </ContactSupportLead>
          <ContactSupportSchedule>
            <strong>Мы на связи:</strong>
            <br />
            Пн–Пт: 08:00–20:00 · Сб–Вс: 08:00–18:00
          </ContactSupportSchedule>
          <ContactSupportBody>
            Оформление заказов — круглосуточно в мессенджерах и по почте. Отвечаем быстро и по
            порядку обращений.
          </ContactSupportBody>
        </ContactSupportCard>
      </ContactSupportContainer>
    </ContactSupportSection>
  );
};
