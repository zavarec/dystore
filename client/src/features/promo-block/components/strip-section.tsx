import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { Card, CtaBtn, CtaRow, Strip } from '../promo-block.style';
import Image from 'next/image';

export function StripSection(s: CategoryPromoSection) {
  return (
    <Card
      $text={s.textColor ?? null}
      $title={s.titleColor ?? null}
      $font={s.font ?? null}
      $bg={s.bgColor ?? null}
    >
      {s.title && <h3>{s.title}</h3>}
      <Strip>
        {s.imageUrl && (
          <span style={{ borderRadius: 8, overflow: 'hidden', display: 'inline-block' }}>
            <Image
              src={s.imageUrl}
              alt={s.title || ''}
              width={120}
              height={80}
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwJyBoZWlnaHQ9JzgwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMjAnIGhlaWdodD0nODAnIGZpbGw9JyNlOWVjZWYnLz48L3N2Zz4="
            />
          </span>
        )}
        <div>
          {s.subtitle && <p style={{ margin: 0 }}>{s.subtitle}</p>}
          {(s.ctaText || s.ctaLink) && (
            <CtaRow $align="left">
              <CtaBtn href={s.ctaLink || '#'} $bg={s.ctaBg ?? null} $color={s.ctaColor ?? null}>
                {s.ctaText || 'Подробнее'}
              </CtaBtn>
            </CtaRow>
          )}
        </div>
      </Strip>
    </Card>
  );
}
