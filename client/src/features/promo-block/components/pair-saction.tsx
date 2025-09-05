import { CategoryPromoSection } from '@/types/models/category-promo-section.model';
import { Card, Pair } from '../promo-block.style';
import Image from 'next/image';

export function PairSection(s: CategoryPromoSection) {
  return (
    <Card $text={s.textColor ?? null} $title={s.titleColor ?? null} $font={s.font ?? null}>
      {s.title && <h3>{s.title}</h3>}
      <Pair>
        {s.imageUrl && (
          <div className="pair-item" style={{ position: 'relative' }}>
            <Image
              src={s.imageUrl}
              alt={s.title || ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg=="
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        {s.videoUrl && (
          <div className="pair-item">
            <video src={s.videoUrl} controls />
          </div>
        )}
      </Pair>
      {s.subtitle && <p style={{ marginTop: 8 }}>{s.subtitle}</p>}
    </Card>
  );
}
