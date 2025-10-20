import { AboutCompany } from '@/features/about-company/about-company';

const AboutPage = () => (
  <AboutCompany
    heading="Сведения о компании"
    companyName="Dyson-Group LLC"
    addressLines={['ул. Примерная, 10', 'Москва', 'Россия', '101000']}
    companyNumberLabel="ОГРН/регистрационный номер"
    companyNumber="1234567890123"
    contactText="По вопросам конфиденциальности свяжитесь с нами по адресу"
    contactEmailLabel="privacy@dyson-group.ru"
    contactEmail="privacy@dyson-group.ru"
    breadcrumbs={[
      { href: '/', label: 'Главная' },
      { href: '/inside', label: 'О нас' },
      { href: '/terms', label: 'Условия' },
    ]}
  />
);

export default AboutPage;
