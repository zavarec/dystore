import { PromoSection } from '@/types/models/promo-section.model';
import { StripWrap, StripInner, StripTitle } from './headline-strip-section.style';

export function HeadlineStripSection(s: PromoSection) {
  return (
    <StripWrap
      $bg={s.bgColor ?? '#000'}
      $padY={(s as any).paddingTopPx ?? (s as any).paddingBottomPx ?? 28}
    >
      <StripInner>
        <StripTitle
          $color={s.titleColor ?? '#fff'}
          $font={s.font ?? null}
          $align={s.contentSide ?? null}
          $fs={s.contentFontSizePx ?? null}
        >
          {s.title}
        </StripTitle>
      </StripInner>
    </StripWrap>
  );
}
