import React from 'react';
import {
  BenefitsSection,
  BenefitsContainer,
  BenefitsList,
  BenefitItem,
  BenefitContent,
  BenefitIcon,
  BenefitTitle,
} from './benefits.style';
import { TruckIcon, ShieldIcon, MoneyIcon, LockIcon } from '@phosphor-icons/react';

interface Benefit {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
}

const benefits: Benefit[] = [
  {
    id: '1',
    icon: TruckIcon,
    title: 'Бесплатная доставка',
  },
  {
    id: '2',
    icon: ShieldIcon,
    title: 'Гарантия на товар',
  },
  {
    id: '3',
    icon: MoneyIcon,
    title: 'Гарантия возврата денег',
  },
  {
    id: '4',
    icon: LockIcon,
    title: 'Безопасная оплата',
  },
];

export const Benefits: React.FC = () => {
  const handleBenefitClick = (benefit: Benefit) => {
    console.log(benefit);
  };

  return (
    <BenefitsSection>
      <BenefitsContainer>
        <BenefitsList>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
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
                    <IconComponent size={40} weight="duotone" />
                  </BenefitIcon>
                  <BenefitTitle>{benefit.title}</BenefitTitle>
                </BenefitContent>
              </BenefitItem>
            );
          })}
        </BenefitsList>
      </BenefitsContainer>
    </BenefitsSection>
  );
};
