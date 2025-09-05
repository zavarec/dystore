import React from 'react';

const AboutPage = () => (
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
    <h1 style={{ fontSize: 32, marginBottom: 16 }}>О нас</h1>
    <p style={{ fontSize: 18, lineHeight: 1.7 }}>
      Добро пожаловать в Dyson Group!
      <br />
      <br />
      Мы — команда, которая любит инновации и заботится о вашем комфорте. В нашем магазине вы
      найдете только оригинальную технику Dyson, а также профессиональную поддержку и быструю
      доставку.
      <br />
      <br />
      Наша миссия — сделать ваш дом чище, а жизнь — проще и приятнее.
    </p>
  </main>
);

export default AboutPage;
