import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { Card, GridWrap, Media } from '../promo-block.style';
import Image from 'next/image';

export function GridSection(s: CategoryPromoSection) {
  // На будущее можно распарсить из s.data список элементов; пока — fallback к баннеру/тексту
  return (
    <Card
      $text={s.textColor ?? null}
      $title={s.titleColor ?? null}
      $font={s.font ?? null}
      $bg={s.bgColor ?? null}
    >
      {s.title && <h3>{s.title}</h3>}
      <GridWrap>
        {s.imageUrl && (
          <Media>
            <Image
              src={s.imageUrl}
              alt={s.title || ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg=="
              style={{ objectFit: 'cover' }}
            />
          </Media>
        )}
        {s.videoUrl && (
          <Media>
            <video src={s.videoUrl} controls />
          </Media>
        )}
      </GridWrap>
      {s.subtitle && <p style={{ marginTop: 8 }}>{s.subtitle}</p>}
    </Card>
  );
}
