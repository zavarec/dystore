import { Modal } from '@/components/atoms/modal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setContactModalOpen } from '@/store/slices/uiSlice';

import { ContactRequestForm } from './contact-request-form';
import {
  CardDescription,
  CardLink,
  CardLinks,
  CardTitle,
  CardsGrid,
  InfoCard,
  ContactModalContent,
} from './contact-request-modal.style';

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

export const ContactRequestModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.uiSlice.isContactModalOpen);

  const handleClose = () => {
    dispatch(setContactModalOpen(false));
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
        <ContactRequestForm userContactMode="email" />

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
