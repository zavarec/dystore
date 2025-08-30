import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { Card, GridWrap, Media } from '../promo-block.style';

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
            <img src={s.imageUrl} alt={s.title || ''} />
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
