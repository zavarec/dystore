import { PromoPlacement } from '@/types/models/promo-placement.model';
import { VideoBadge } from '../../promo-sections/promo-sections-board.style';

export const Preview: React.FC<{ item: PromoPlacement }> = ({ item }) => {
  const ps = item.promoSection;
  const title = ps?.title || ps?.variant || `#${item.id}`;

  if (ps?.videoUrl) {
    return (
      <div
        style={{
          position: 'relative',
          height: 140,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#0f0f0f',
        }}
      >
        <video
          src={ps.videoUrl}
          poster={ps.imageUrl || undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          playsInline
          muted
          loop
          preload="metadata"
          // controls // ← включи, если нужно управление прямо в карточке
        />
        <VideoBadge>video</VideoBadge>
      </div>
    );
  }

  if (ps?.imageUrl) {
    return (
      <div
        style={{
          position: 'relative',
          height: 140,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#f5f5f5',
        }}
      >
        <img
          src={ps.imageUrl}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
    );
  }

  // Фолбэк — заголовок
  return (
    <div
      style={{
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        textAlign: 'center',
      }}
    >
      <strong
        style={{
          fontSize: 14,
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </strong>
    </div>
  );
};
