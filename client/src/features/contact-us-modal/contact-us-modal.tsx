import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Modal } from '@/components/atoms/modal';
import { COMPANY_INFO } from '@/constants/contacts.constants';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { sendContactRequest } from '@/services/contact.service';
import { setContactModalOpen } from '@/store/slices/uiSlice';

import {
  ActionsRow,
  CardDescription,
  CardLink,
  CardLinks,
  CardTitle,
  CardsGrid,
  InfoCard,
  ContactForm,
  ContactModalContent,
  FieldGroup,
  FieldLabel,
  FormHeader,
  FormSubtitle,
  FormTitle,
  LegalNote,
  RequiredMark,
  SubmitButton,
  TextArea,
  TextInput,
} from './contact-us-modal.style';

type ContactFormState = {
  fullName: string;
  email: string;
  message: string;
};

const INITIAL_STATE: ContactFormState = {
  fullName: '',
  email: '',
  message: '',
};

const SUPPORT_CARDS = [
  {
    title: 'Доставка и возвраты',
    description: 'Ответы на популярные вопросы о доставке, сроках и возврате техники.',
    links: [
      { label: 'Условия доставки', href: '/delivery' },
      { label: 'Возврат и обмен', href: '/returns' },
      { label: 'Гарантийное обслуживание', href: '/warranty' },
    ],
  },
  // {
  //   title: 'Регистрация устройства',
  //   description:
  //     'Зарегистрируйте свою технику, чтобы получать персональные рекомендации и поддержку.',
  //   links: [
  //     { label: 'Личный кабинет', href: '/profile' },
  //     { label: 'Гарантия Dyson', href: '/warranty' },
  //     { label: 'FAQ по регистрации', href: '/contacts#faq' },
  //   ],
  // },
];

export const ContactUsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.uiSlice.isContactModalOpen);

  const {
    register,
    handleSubmit,
    reset,
    // setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormState>({
    defaultValues: INITIAL_STATE,
    mode: 'onTouched',
  });

  // Сбрасываем форму и ставим фокус при открытии
  // useEffect(() => {
  //   if (isOpen) {
  //     reset(INITIAL_STATE);
  //     // небольшой таймаут, чтобы модалка успела отрендериться
  //     setTimeout(() => setFocus('fullName'), 0);
  //   }
  // }, [isOpen, reset, setFocus]);

  const handleClose = () => {
    dispatch(setContactModalOpen(false));
  };

  const onSubmit = async (data: ContactFormState) => {
    try {
      await sendContactRequest(data);
      toast.success('Спасибо! Мы свяжемся с вами в течение рабочего дня.');
      reset(INITIAL_STATE);
      handleClose();
    } catch (error) {
      console.error('Contact form submission failed', error);
      toast.error('Не удалось отправить обращение. Попробуйте ещё раз.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="860px"
      padding={0}
      fullHeight
      scrollStrategy="modal"
    >
      <ContactModalContent>
        <ContactForm onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormHeader>
            <FormTitle>Свяжитесь с нами</FormTitle>
            <FormSubtitle>
              Расскажите нам, с чем помочь. Команда поддержки ответит в течение рабочего дня с 9:00
              до 20:00 (Мск) и предложит лучшее решение.
            </FormSubtitle>
          </FormHeader>

          <FieldGroup>
            <FieldLabel htmlFor="contact-fullName">Как к вам обращаться</FieldLabel>
            <TextInput
              id="contact-fullName"
              placeholder="Ваше имя"
              autoComplete="name"
              aria-invalid={!!errors.fullName || undefined}
              data-invalid={!!errors.fullName || undefined}
              {...register('fullName', {
                maxLength: { value: 120, message: 'Слишком длинное имя' },
              })}
            />
            {errors.fullName && (
              <small role="alert" style={{ color: '#c00', marginTop: 6 }}>
                {errors.fullName.message}
              </small>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="contact-email">
              Ваш email <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <TextInput
              id="contact-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              aria-invalid={!!errors.email || undefined}
              data-invalid={!!errors.email || undefined}
              {...register('email', {
                required: 'Укажите email',
                pattern: {
                  // достаточно лояльная проверка
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Некорректный email',
                },
              })}
            />
            {errors.email && (
              <small role="alert" style={{ color: '#c00', marginTop: 6 }}>
                {errors.email.message}
              </small>
            )}
          </FieldGroup>

          {/* <FieldGroup>
            <FieldLabel htmlFor="contact-order">Номер заказа или серийный номер</FieldLabel>
            <TextInput
              id="contact-order"
              placeholder="AB1-RU-123456"
              autoComplete="off"
              aria-invalid={!!errors.orderNumber || undefined}
              data-invalid={!!errors.orderNumber || undefined}
              {...register('orderNumber', {
                maxLength: { value: 64, message: 'Слишком длинный номер' },
              })}
            />
            <HelperLink href="/contacts#faq">Как найти серийный номер?</HelperLink>
            {errors.orderNumber && (
              <small role="alert" style={{ color: '#c00', marginTop: 6 }}>
                {errors.orderNumber.message}
              </small>
            )}
          </FieldGroup> */}

          <FieldGroup>
            <FieldLabel htmlFor="contact-message">
              Опишите вопрос <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <TextArea
              id="contact-message"
              placeholder="Поделитесь деталями, чтобы мы быстрее помогли"
              required
              rows={5}
              aria-invalid={!!errors.message || undefined}
              data-invalid={!!errors.message || undefined}
              {...register('message', {
                required: 'Опишите вопрос',
                minLength: { value: 8, message: 'Добавьте чуть больше деталей' },
                maxLength: { value: 5000, message: 'Слишком длинное сообщение' },
              })}
            />
            {errors.message && (
              <small role="alert" style={{ color: '#c00', marginTop: 6 }}>
                {errors.message.message}
              </small>
            )}
          </FieldGroup>

          <ActionsRow>
            <LegalNote>
              Нажимая «Отправить», вы соглашаетесь на обработку персональных данных и получение
              ответа на {COMPANY_INFO.COMPANY_EMAIL_ADRESS}.
            </LegalNote>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправляем...' : 'Отправить'}
            </SubmitButton>
          </ActionsRow>
        </ContactForm>

        <CardsGrid>
          {SUPPORT_CARDS.map(card => (
            <InfoCard key={card.title}>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardLinks>
                {card.links.map(link => (
                  <li key={link.href} onClick={handleClose}>
                    <CardLink href={link.href}>{link.label}</CardLink>
                  </li>
                ))}
              </CardLinks>
            </InfoCard>
          ))}
        </CardsGrid>
      </ContactModalContent>
    </Modal>
  );
};
