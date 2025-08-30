import { CategoryPromoSection } from "@/types/models/category-promo-section.model";
import { Card, Pair } from "../promo-block.style";

export function PairSection(s: CategoryPromoSection) {
  return (
    <Card $text={s.textColor ?? null} $title={s.titleColor ?? null} $font={s.font ?? null}>
      {s.title && <h3>{s.title}</h3>}
      <Pair>
        {s.imageUrl && (
          <div className="pair-item">
            <img src={s.imageUrl} alt={s.title || ''} />
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
