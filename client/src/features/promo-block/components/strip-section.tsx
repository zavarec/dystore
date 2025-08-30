import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { Card, CtaBtn, CtaRow, Strip } from '../promo-block.style';

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
          <span style={{ borderRadius: 8, overflow: 'hidden' }}>
            <img src={s.imageUrl} alt={s.title || ''} style={{ width: 120, height: 'auto' }} />
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
