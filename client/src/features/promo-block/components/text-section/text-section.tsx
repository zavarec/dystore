// components/promo/components/text-section.tsx
import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { TextWrap, TextInner, Badge, Quote, Divider, Award, Source } from './text-section.style';

type Align = 'LEFT' | 'RIGHT' | 'CENTER';

export function TextSection(s: CategoryPromoSection) {
  // Центр/лево/право — берём из contentSide или дефолтим в CENTER
  const side = ((s as any).contentSide as Align) || 'CENTER';
  const align = side === 'RIGHT' ? 'right' : side === 'LEFT' ? 'left' : 'center';

  return (
    <TextWrap $bg={s.bgColor ?? null}>
      <TextInner $align={align}>
        {/* бейдж сверху — можно использовать imageUrl как маленький логотип */}
        {s.imageUrl && <Badge src={s.imageUrl} alt={s.title || ''} />}

        {/* большая цитата */}
        {s.title && (
          <Quote $font={s.font ?? null} $color={s.textColor ?? null}>
            {s.title}
          </Quote>
        )}

        {/* тонкая линия */}
        <Divider $color={s.titleColor ?? 'rgba(0,0,0,0.15)'} />

        {/* строка «Winner of … 2024» — кладём в subtitle */}
        {s.subtitle && <Award $color={s.textColor ?? null}>{s.subtitle}</Award>}

        {/* «Esquire» — положи в s.ctaText, либо добавь отдельное поле source */}
        {(s as any).source ? (
          <Source $color={s.textColor ?? null}>{(s as any).source}</Source>
        ) : s.ctaText ? (
          <Source $color={s.textColor ?? null}>{s.ctaText}</Source>
        ) : null}
      </TextInner>
    </TextWrap>
  );
}
