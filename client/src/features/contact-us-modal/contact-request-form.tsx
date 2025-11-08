import { useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { PhoneInput } from '@/components/atoms/phone-input/phone-input';
import { COMPANY_INFO } from '@/constants/contacts.constants';
import { useAppDispatch } from '@/hooks/redux';
import { sendContactRequest } from '@/services/contact.service';
import { setContactModalOpen } from '@/store/slices/uiSlice';

import type { ContactFormValues } from './contact-requset-form.schema';

import {
  ActionsRow,
  ContactForm,
  ContactModalContent,
  ErrorMessage,
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
} from './contact-request-modal.style';
import { getContactRequestValidationSchema } from './contact-requset-form.schema';

export type ContactMode = 'phone' | 'email';

interface ContactRequestFormProps {
  title?: string;
  description?: string;
  userContactMode?: ContactMode;
}

export const ContactRequestForm: React.FC<ContactRequestFormProps> = ({
  title = 'Свяжитесь с нами',
  description = `Расскажите нам, с чем помочь. Команда поддержки ответит в течение рабочего дня
   с 9:00 до 20:00 (Мск) и предложит лучшее решение.`,
  userContactMode,
}) => {
  const dispatch = useAppDispatch();

  const schema = useMemo(
    () => getContactRequestValidationSchema(userContactMode),
    [userContactMode],
  );

  const formMethods = useForm<ContactFormValues>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: 'onTouched',
    shouldUnregister: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    // setFocus,
    control,
    formState: { errors, isSubmitting },
  } = formMethods;

  const showEmail = userContactMode !== 'phone';
  const showPhone = userContactMode !== 'email';
  const modeUnSelected = showEmail && showPhone;

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

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await sendContactRequest(data);
      toast.success('Спасибо! Мы свяжемся с вами в течение рабочего дня.');
      reset();
      handleClose();
    } catch (error) {
      console.error('Contact form submission failed', error);
      toast.error('Не удалось отправить обращение. Попробуйте ещё раз.');
    }
  };

  return (
    <ContactModalContent>
      <ContactForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormHeader>
          <FormTitle>{title}</FormTitle>
          <FormSubtitle>{description}</FormSubtitle>
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
            <ErrorMessage id="fullName-error" role="alert">
              {errors.fullName.message}
            </ErrorMessage>
          )}
        </FieldGroup>

        {modeUnSelected && (
          <FieldLabel>Введите номер телефона или адрес электронной почты</FieldLabel>
        )}

        {showEmail && (
          <FieldGroup>
            <FieldLabel htmlFor="contact-email">
              Ваш email {userContactMode === 'email' && <RequiredMark>*</RequiredMark>}
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
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FieldGroup>
        )}

        {showPhone && (
          <FieldGroup>
            <FieldLabel htmlFor="phone">Номер телефона</FieldLabel>

            <Controller
              control={control}
              defaultValue=""
              name="phone"
              render={({ field, fieldState }) => (
                <PhoneInput
                  ref={field.ref as unknown as React.RefObject<HTMLInputElement>}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message ?? ''}
                  fullWidth
                />
              )}
            />
            {errors.phone && (
              <ErrorMessage id="phone-error" role="alert">
                {errors.phone.message}
              </ErrorMessage>
            )}
          </FieldGroup>
        )}

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
            <ErrorMessage id="message-error" role="alert">
              {errors.message.message}
            </ErrorMessage>
          )}
        </FieldGroup>

        <ActionsRow>
          <LegalNote>
            Нажимая «Отправить», вы соглашаетесь на обработку персональных данных и получение ответа
            на {COMPANY_INFO.COMPANY_EMAIL_ADRESS}.
          </LegalNote>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправляем...' : 'Отправить'}
          </SubmitButton>
        </ActionsRow>
      </ContactForm>
    </ContactModalContent>
  );
};
