import type { PromoHighlightsContent, PromoHighlightsItem } from '@/types/models/promo-carousel';
import type { PromoSection } from '@/types/models/promo-section.model';

import {
  Section,
  Wrapper,
  Heading,
  Grid,
  Card,
  Media,
  CardTitle,
  CardDescription,
  CardCta,
} from './machine-highlights-section.style';

function renderMedia(item: PromoHighlightsItem) {
  const media = item.media;
  if (!media) return null;
  if (media.type === 'video') {
    return <video src={media.src} playsInline muted loop preload="metadata" />;
  }
  if (media.type === 'image') {
    return <img src={media.src} alt={item.title ?? ''} loading="lazy" />;
  }
  return null;
}

interface Props {
  section: PromoSection;
  content: PromoHighlightsContent;
}

// MachineHighlightsSection.tsx
export const MachineHighlightsSection: React.FC<Props> = ({ section, content }) => {
  if (!content.items?.length) return null;

  // const layout = content.layout ?? 'grid';

  // колонки для grid
  const colsSm = content.columnsSm ?? 1;
  const colsMd = content.columnsMd ?? 2;
  const colsLg = content.columnsLg ?? 4;

  // соотношение сторон
  const ratioMap: Record<string, number> = { '1:1': 1, '4:3': 3 / 4, '3:2': 2 / 3, '16:9': 9 / 16 };
  const ratio =
    typeof content.mediaRatio === 'number'
      ? content.mediaRatio
      : content.mediaRatio
        ? ratioMap[content.mediaRatio]
        : 0.66; // по умолчанию ~ 3:2

  const fit = content.mediaFit ?? 'cover';

  const bg = content.bgColor ?? section.bgColor ?? '#fff';
  const heading = content.heading ?? section.title ?? undefined;
  const subheading = content.subheading ?? section.subtitle ?? undefined;
  const textColor = content.textColor ?? section.titleColor ?? undefined;

  return (
    <Section
      $bg={bg}
      sectionBorder={content.sectionBorder ?? false}
      style={
        {
          // CSS-переменные для стилей
          '--mh-cols-sm': colsSm,
          '--mh-cols-md': colsMd,
          '--mh-cols-lg': colsLg,
          '--mh-ratio': `${ratio !== undefined && ratio * 100}%`,
          '--mh-fit': fit,
        } as React.CSSProperties
      }
    >
      <Wrapper>
        {(heading || subheading) && (
          <Heading $color={textColor}>
            {heading && <h2>{heading}</h2>}
            {subheading && <p>{subheading}</p>}
          </Heading>
        )}

        <Grid>
          {content.items.map(item => {
            // цифры-спаны в юнитах сетки: 4/8/12
            const spanSm = item.span?.sm ?? 4; // вся строка на sm
            const spanMd = item.span?.md ?? 4; // 1/2 на md (2 в ряд)
            const spanLg = item.span?.lg ?? 4; // 1/3 на lg (3 в ряд)

            const ratioMap = { '1:1': 1, '4:3': 3 / 4, '3:2': 2 / 3, '16:9': 9 / 16 };
            const ratio =
              typeof item.ratio === 'number'
                ? item.ratio
                : item.ratio
                  ? ratioMap[item.ratio]
                  : typeof content.mediaRatio === 'number'
                    ? content.mediaRatio
                    : content.mediaRatio
                      ? ratioMap[content.mediaRatio]
                      : 0.66;

            const fit = item.fit ?? content.mediaFit ?? 'cover';
            return (
              <Card
                key={item.id}
                style={
                  {
                    // ширины в юнитах
                    '--span-sm': spanSm,
                    '--span-md': spanMd,
                    '--span-lg': spanLg,
                    // индивидуальные медиа-настройки
                    '--mh-ratio': `${ratio * 100}%`,
                    '--mh-fit': fit,
                  } as React.CSSProperties
                }
              >
                {item.media && <Media>{renderMedia(item)}</Media>}
                {item.title && <CardTitle $color={textColor}>{item.title}</CardTitle>}
                {item.description && (
                  <CardDescription $color={textColor}>{item.description}</CardDescription>
                )}
                {item.ctaText && item.href && (
                  <CardCta href={item.href} aria-label={item.ctaText}>
                    {item.ctaText}
                    <span aria-hidden>→</span>
                  </CardCta>
                )}
              </Card>
            );
          })}
        </Grid>
      </Wrapper>
    </Section>
  );
};
