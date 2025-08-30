import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { StripWrap, StripInner, StripTitle } from './headline-strip-section.style';

export function HeadlineStripSection(s: CategoryPromoSection) {
  return (
    <StripWrap $bg={s.bgColor ?? '#000'} $padY={28}>
      <StripInner>
        <StripTitle
          $color={s.titleColor ?? '#fff'}
          $font={s.font ?? null}
          $align={s.contentSide ?? null}
        >
          {s.title}
        </StripTitle>
      </StripInner>
    </StripWrap>
  );
}
