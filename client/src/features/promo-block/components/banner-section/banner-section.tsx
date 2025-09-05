// components/promo/components/banner-section.tsx
import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { BannerWrap, Media, ContentRow, BannerContent } from './banner-section.style';
import { CtaRow, CtaBtn } from '../../promo-block.style';
import Image from 'next/image';

export function BannerSection(s: CategoryPromoSection) {
  const side = (s as any).contentSide === 'RIGHT' ? 'RIGHT' : 'LEFT';

  console.log(s, 'sectionProps');

  return (
    <BannerWrap $bg={(s as any).bgColor ?? null} $height={(s as any).heightPx ?? null}>
      {/* Фоновое медиа на всю ширину/высоту */}
      <Media>
        {s.imageUrl && (
          <Image
            src={s.imageUrl}
            alt={s.title || ''}
            fill
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwMCcgaGVpZ2h0PSc1NjAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMDAnIGhlaWdodD0nNTYwJyBmaWxsPScjZTllY2VmJy8+PC9zdmc+"
            style={{ objectFit: 'cover' }}
          />
        )}
        {s.videoUrl && (
          <video src={s.videoUrl} autoPlay muted loop playsInline aria-label={s.title || ''} />
        )}
      </Media>

      {/* Ряд, который выравнивает контент слева/справа */}
      <ContentRow $side={side}>
        <BannerContent
          $side={side}
          $text={s.textColor ?? null}
          $title={s.titleColor ?? null}
          $font={s.font ?? null}
        >
          {s.title && <h3>{s.title}</h3>}
          {s.subtitle && <p>{s.subtitle}</p>}
          {(s.ctaText || s.ctaLink) && (
            <CtaRow>
              <CtaBtn href={s.ctaLink || '#'} $bg={s.ctaBg ?? null} $color={s.ctaColor ?? null}>
                {s.ctaText || 'Подробнее'}
              </CtaBtn>
            </CtaRow>
          )}
        </BannerContent>
      </ContentRow>
    </BannerWrap>
  );
}
