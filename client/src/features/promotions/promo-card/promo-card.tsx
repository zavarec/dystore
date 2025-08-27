// src/features/promotions/PromoCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Promotion, PromoFont } from '@/types/models/promotion.model';
import { Section, Content } from './promo-card.style';
import { inter, roboto, montserrat, poppins } from '@/styles/fonts/fonts';
import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { useRouter } from 'next/navigation';

interface PromoCardProps {
  promo: Promotion;
  label?: string; // например "Товар дня" или "Спецпредложение"
  onClick?: () => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ promo, label }) => {
  const router = useRouter();

  const handleClick = () => {
    if (promo.product) {
      router.push(`/product/${promo.product.id}`);
    }
  };

  const fontVarClassMap: Record<PromoFont, string> = {
    [PromoFont.INTER]: inter.variable,
    [PromoFont.ROBOTO]: roboto.variable,
    [PromoFont.MONTSERRAT]: montserrat.variable,
    [PromoFont.POPPINS]: poppins.variable,
  };

  const fontClass = promo.font ? fontVarClassMap[promo.font] : '';

  return (
    <Section
      className={fontClass}
      fontFamily={undefined}
      titleColor={promo.titleColor ?? undefined}
      textColor={promo.textColor ?? undefined}
    >
      {promo.bgVideoUrl ? (
        <video autoPlay muted loop playsInline aria-label="Фоновое видео промо">
          <source src={promo.bgVideoUrl} />
        </video>
      ) : promo.bgImageUrl ? (
        <Image
          fill
          alt={promo.title ?? promo.product?.name ?? ''}
          src={promo.bgImageUrl}
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          priority
        />
      ) : null}

      <Content titleColor={promo.titleColor ?? undefined} textColor={promo.textColor ?? undefined}>
        {label && <p>{label}</p>}
        <h2>{promo.title ?? promo.product?.name}</h2>
        {promo.subtitle && <p>{promo.subtitle}</p>}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant={ButtonVariant.GREEN}
            size="medium"
            style={{ borderRadius: '6px', background: promo.ctaBg, color: promo.ctaColor }}
            onClick={handleClick}
          >
            {promo.ctaText ?? 'Купить'}
          </Button>
          {promo.product && (
            <Link href={`/product/${promo.product.id}`} style={{ color: '#007bff' }}>
              Подробнее
            </Link>
          )}
        </div>
      </Content>
    </Section>
  );
};
