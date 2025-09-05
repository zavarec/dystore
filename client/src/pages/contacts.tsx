import React from 'react';

const ContactsPage = () => (
  <main
    style={{
      maxWidth: 800,
      margin: '40px auto',
      padding: 24,
      background: '#222',
      color: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    }}
  >
    <h1 style={{ fontSize: 32, marginBottom: 16 }}>Контакты</h1>
    <p style={{ fontSize: 18, lineHeight: 1.7 }}>
      Вы всегда можете связаться с нами:
      <br />
      <br />
      <b>Email:</b>{' '}
      <a href="mailto:support@dyson-group.ru" style={{ color: '#007bff' }}>
        support@dyson-group.ru
      </a>
      <br />
      <b>Телефон:</b>{' '}
      <a href="tel:+78001234567" style={{ color: '#007bff' }}>
        8 800 123-45-67
      </a>
      <br />
      <b>Адрес:</b> г. Москва, ул. Примерная, д. 1<br />
      <br />
      Мы работаем ежедневно с 9:00 до 21:00.
    </p>
  </main>
);

export default ContactsPage;
