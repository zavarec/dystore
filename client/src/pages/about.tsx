import { COMPANY_INFO } from '@/constants/contacts.constants';
import { AboutCompany } from '@/features/about-company/about-company';

const AboutPage = () => (
  <AboutCompany
    heading="Сведения о компании"
    companyName="Dyson-Group"
    legalCompanyName="ИП Мурсалов Хаял Ариф Оглы"
    addressLines={['ул. Воронежская, 46', 'Москва', 'Россия', '115597']}
    companyNumberLabel="ОГРН/регистрационный номер"
    companyNumber="322774600478526"
    contactText="По вопросам конфиденциальности свяжитесь с нами по адресу"
    contactEmailLabel={COMPANY_INFO.COMPANY_EMAIL_ADRESS}
    contactEmail={COMPANY_INFO.COMPANY_EMAIL_ADRESS}
    breadcrumbs={[
      { href: '/', label: 'Главная' },
      { href: '/terms', label: 'Условия' },
    ]}
  />
);

export default AboutPage;
