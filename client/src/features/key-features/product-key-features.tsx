import { Footnotes, Li, List, Note, Section } from './product-key-features.style';

export type KeyFeature = {
  id?: string | number;
  text: string;
  /** символ/индекс сноски: "*", "†", "1" и т.п. */
  footnote?: string | null;
  order?: number | null;
};

type Props = {
  /** Подзаголовок под H1, например: "Only from Dyson…" — опционально */
  note?: string | null;
  /** Список буллетов — опционально */
  features?: KeyFeature[] | null;
  /** Заголовок секции (для доступности); если не нужен — передай undefined */
  title?: string;
  /** Компактный режим — меньше отступы */
  compact?: boolean;
  className?: string;
};

export const ProductKeyFeatures: React.FC<Props> = ({
  note,
  features,
  title = 'Key features',
  compact = false,
  className,
}) => {
  const items = Array.isArray(features)
    ? [...features]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .filter(f => (f.text ?? '').trim().length > 0)
    : [];

  if (!note && items.length === 0) return null;

  const footnotes = Array.from(
    new Map(
      items
        .filter(i => (i.footnote ?? '').toString().trim().length > 0)
        .map(i => [i.footnote as string, i.footnote as string]),
    ).entries(),
  ).map(([key]) => key);

  const titleId = title ? 'product-key-features-title' : undefined;

  return (
    <Section className={className} aria-labelledby={titleId} data-testid="product-key-features">
      {/* {title ? (
        <h2 id={titleId} className="visually-hidden">
          {title}
        </h2>
      ) : null} */}

      {note ? <Note data-testid="product-key-features-note">{note}</Note> : null}

      {items.length > 0 && (
        <List compact={compact}>
          {items.map((it, idx) => (
            <Li key={it.id ?? idx}>
              <span className="text">{it.text}</span>
              {it.footnote ? <sup className="footnote">{it.footnote}</sup> : null}
            </Li>
          ))}
        </List>
      )}

      {footnotes.length > 0 && (
        <Footnotes aria-label="Примечания">
          {footnotes.map((fn, i) => (
            <li key={`${fn}-${i}`}>
              <sup>{fn}</sup> — см. пояснения внизу страницы.
            </li>
          ))}
        </Footnotes>
      )}
    </Section>
  );
};
