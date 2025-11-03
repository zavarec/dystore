import type { PromoPlacement } from '@/types/models/promo-placement.model';

export const PlacementCardPreview: React.FC<{ item: PromoPlacement }> = ({ item }) => {
  const previewContent =
    item.promoSection?.imageUrl || item.promoSection?.videoUrl ? (
      <div
        style={{
          height: 140,
          background: `url(${item.promoSection?.imageUrl}) center/cover no-repeat`,
        }}
      >
        {item.promoSection?.videoUrl && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: 12,
            }}
          >
            video
          </span>
        )}
      </div>
    ) : null;

  return (
    <div style={{ width: 320, pointerEvents: 'none' }}>
      {previewContent}
      <div
        style={{
          padding: 12,
          background: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,.15)',
          borderRadius: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: item.isActive ? '#22c55e' : '#ef4444',
            }}
          />
          <strong>
            #{item.id} · {item.entityId} · {item.pageType}
          </strong>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          slot: {item.slot} · order: {item.order}
          {item.promoSection && <> · section: {item.promoSection.id}</>}
        </div>
      </div>
    </div>
  );
};
