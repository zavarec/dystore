import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { COMPANY_INFO } from '@/constants/contacts.constants';

import {
  FaqAnswer,
  FaqHeading,
  FaqItem,
  FaqList,
  FaqQuestion,
  FaqSectionWrapper,
} from './faq.style';

interface Question {
  id: number;
  question: string;
  answer: string | React.ReactNode;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Как оформить заказ?',
    answer:
      'Выберите нужный товар, добавьте его в корзину и заполните короткую форму с контактными данными. После подтверждения мы свяжемся с вами для уточнения деталей доставки.',
  },
  {
    id: 2,
    question: 'Сколько длится доставка?',
    answer:
      'Доставка по Москве и области обычно занимает 1–2 дня. В регионы России — от 3 до 7 дней в зависимости от службы доставки.',
  },
  {
    id: 3,
    question: 'Можно оплатить при получении?',
    answer:
      'Да, вы можете оплатить заказ наличными или картой при получении. Также доступны онлайн-оплата и рассрочка.',
  },
  {
    id: 4,
    question: 'Есть ли гарантия на технику?',
    answer:
      'Да, на всю технику Dyson предоставляется официальная гарантия — 2 года. Мы также помогаем с регистрацией продукта на сайте Dyson.',
  },
  {
    id: 5,
    question: 'Как связаться со службой поддержки?',
    answer: (
      <>
        Вы можете написать нам в <strong>Telegram</strong>, позвонить по телефону{' '}
        <a href="tel:+78005501474">{COMPANY_INFO.COMPANY_PHONE_NUMBER}</a> или отправить письмо на{' '}
        <a href="mailto:dyson-group@yandex.com">{COMPANY_INFO.COMPANY_EMAIL_ADRESS}</a>.
      </>
    ),
  },
];

export const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <FaqSectionWrapper>
      <FaqHeading>Часто задаваемые вопросы</FaqHeading>
      <FaqList>
        {questions.map(({ id, question, answer }) => (
          <FaqItem key={id} onClick={() => toggle(id)}>
            <FaqQuestion>
              {' '}
              {question}
              <span>{openId === id ? '−' : '+'}</span>
            </FaqQuestion>

            <AnimatePresence initial={false}>
              {openId === id && (
                <FaqAnswer
                  key="faq_answer"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {answer}
                </FaqAnswer>
              )}
            </AnimatePresence>
          </FaqItem>
        ))}
      </FaqList>
    </FaqSectionWrapper>
  );
};
