import React, { useState } from 'react';
import {
  BenefitsSection,
  BenefitsContainer,
  BenefitsList,
  BenefitItem,
  BenefitContent,
  BenefitIcon,
  BenefitTitle,
} from './benefits.style';
import Image from 'next/image';
import { Modal } from '../../atoms/modal/modal';

interface Benefit {
  id: string;
  iconUrl: string;
  title: string;
  description?: string;
}

const benefits: Benefit[] = [
  {
    id: '3',
    iconUrl: 'https://www.dyson.com/content/dam/dyson/adobetarget/icons/money-back-dollar2.png',
    title: 'Гарантия лучшей цены',
    description: 'Мы гарантируем лучшую цену на рынке',
  },
  {
    id: '1',
    iconUrl:
      'https://www.dyson.com/content/dam/dyson/oe-team-email-assets/market-icons/jp/jp_free-shipping_black.png',
    title: 'Бесплатная доставка',
    description:
      'Курьерская доставка по Москве осуществляется бесплатно до Вашей двери. Бесплатная доставка до двери в регионы РФ транспортной компанией.',
  },
  {
    id: '2',
    iconUrl: ' https://www.dyson.com/content/dam/dyson/icons/reasons-to-buy/Price%20Promise.png',
    title: 'Гарантия на товар',
    description:
      'Возврат товара осуществляется в строгом соответствии с законодательством Российской Федерации. Чтобы избежать возможных недоразумений, мы рекомендуем тщательно осмотреть товар перед оплатой: проверить его комплектацию, наличие документов и убедиться в отсутствии повреждений или дефектов.\nДля оформления возврата или обмена, пожалуйста, свяжитесь с нашей службой поддержки и передайте товар для проверки. Для оформления возврата или обмена, пожалуйста, свяжитесь с нашей службой поддержки и передайте товар для проверки.',
  },
  {
    id: '4',
    iconUrl:
      'https://www.dyson.com/content/dam/dyson/oe-team-email-assets/email-images/2-year-lifecycle/icon-warranty%20information.png',
    title: 'Безопасная оплата',
    description:
      'При доставке техники Dyson вы имеете возможность осмотреть товар перед оплатой. Оплата может быть произведена любым из следующих способов: наличными, картой или онлайн переводом.',
  },
];

export const Benefits: React.FC = () => {
  const [activeBenefit, setActiveBenefit] = useState<Benefit | null>(null);

  const handleBenefitClick = (benefit: Benefit) => {
    setActiveBenefit(benefit);
  };

  const handleClose = () => setActiveBenefit(null);

  return (
    <BenefitsSection>
      <BenefitsContainer>
        <BenefitsList>
          {benefits.map((benefit, index) => {
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
