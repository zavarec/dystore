import { useState } from 'react';

import Image from 'next/image';

import {
  BenefitsSection,
  BenefitsContainer,
  BenefitsList,
  BenefitItem,
  BenefitContent,
  BenefitIcon,
  BenefitTitle,
} from './benefits.style';
import { Modal } from '../../atoms/modal/modal';

interface Benefit {
  id: string;
  iconUrl: string;
  title: string;
  description?: string;
}

const BENEFITS: Benefit[] = [
  {
    id: '3',
    iconUrl:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/658c6873-1180-4064-bbf5-7b345cc60006-money-back-dollar2 (2).png',
    title: 'Гарантия лучшей цены',
    description: 'Мы гарантируем лучшую цену на рынке',
  },
  {
    id: '1',
    iconUrl:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/6a332e26-0e36-4952-a846-97b1ca09e184-jp_free-shipping_black.png',
    title: 'Бесплатная доставка',
    description:
      'Курьерская доставка по Москве осуществляется бесплатно до Вашей двери. Бесплатная доставка до двери в регионы РФ транспортной компанией.',
  },
  {
    id: '2',
    iconUrl:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/aa142c89-5287-411c-8f98-fe2282ca6873-Price Promise.png',
    title: 'Гарантия на товар',
    description:
      'Возврат товара осуществляется в строгом соответствии с законодательством Российской Федерации. Чтобы избежать возможных недоразумений, мы рекомендуем тщательно осмотреть товар перед оплатой: проверить его комплектацию, наличие документов и убедиться в отсутствии повреждений или дефектов.\nДля оформления возврата или обмена, пожалуйста, свяжитесь с нашей службой поддержки и передайте товар для проверки. Для оформления возврата или обмена, пожалуйста, свяжитесь с нашей службой поддержки и передайте товар для проверки.',
  },
  {
    id: '4',
    iconUrl:
      'https://s3.twcstorage.ru/49dbf9e8-45b07930-284b-4614-95f5-5a9bdcbd9f92/uploads/7d2215b2-7ea7-4f50-99dc-1d91aff62c1b-icon-warranty information.png',
    title: 'Безопасная оплата',
    description:
      'При доставке техники Dyson вы имеете возможность осмотреть товар перед оплатой. Оплата может быть произведена любым из следующих способов: наличными, картой или онлайн переводом.',
  },
];

interface Props {
  variant?: 'cart' | 'default';
}

export const Benefits: React.FC<Props> = ({ variant = 'default' }) => {
  const [activeBenefit, setActiveBenefit] = useState<Benefit | null>(null);

  const handleBenefitClick = (benefit: Benefit) => {
    setActiveBenefit(benefit);
  };

  const handleClose = () => setActiveBenefit(null);

  if (variant === 'cart') {
    return (
      <BenefitsList variant="cart">
        {BENEFITS.map(benefit => {
          return (
            <BenefitItem key={benefit.id} variant="cart">
              <BenefitContent variant="cart">
                <BenefitIcon variant="cart">
                  <Image src={benefit.iconUrl} alt={benefit.title} width={16} height={16} />
                </BenefitIcon>
                <BenefitTitle variant="cart">{benefit.title}</BenefitTitle>
              </BenefitContent>
            </BenefitItem>
          );
        })}
      </BenefitsList>
    );
  }

  return (
    <BenefitsSection>
      <BenefitsContainer>
        <BenefitsList>
          {BENEFITS.map((benefit, index) => {
            return (
              <BenefitItem
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleBenefitClick(benefit)}
              >
                <BenefitContent>
                  <BenefitIcon>
                    <Image src={benefit.iconUrl} alt={benefit.title} width={40} height={40} />
                  </BenefitIcon>
                  <BenefitTitle>{benefit.title}</BenefitTitle>
                </BenefitContent>
              </BenefitItem>
            );
          })}
        </BenefitsList>
      </BenefitsContainer>
      <Modal
        isOpen={activeBenefit != null}
        onClose={handleClose}
        title={activeBenefit?.title ?? ''}
        size="sm"
      >
        <p>{activeBenefit?.description}</p>
      </Modal>
    </BenefitsSection>
  );
};
