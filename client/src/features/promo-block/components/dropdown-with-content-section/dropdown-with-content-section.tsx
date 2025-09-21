import { useMemo, useState } from 'react';

import type { PromoDropdownContent, PromoDropdownCard } from '@/types/models/promo-carousel';
import type { PromoSection } from '@/types/models/promo-section.model';

import {
  SectionWrap,
  Container,
  Block,
  Bar,
  Toggle,
  Chevron,
  Collapse,
  CollapseInner,
  Headline,
  Cards,
  Card,
  CardMedia,
  CardBody,
  CardTitle,
  CardDescription,
  CardCta,
} from './dropdown-with-content-section.style';

function renderMedia(media?: PromoDropdownCard['media']) {
  if (!media) return null;
  if (media.type === 'video') {
    return (
      <video src={media.src} poster={media.poster} playsInline muted loop preload="metadata" />
    );
  }
  if (media.type === 'image') return <img src={media.src} alt="" loading="lazy" />;
  return null;
}

interface Props {
  section: PromoSection;
  content: PromoDropdownContent; // { kind:'dropdown', bgColor?, options:[...] }
  defaultOpenId?: string; // опционально: какая секция открыта по умолчанию
}

export const DropdownWithContentSection: React.FC<Props> = ({
  section,
  content,
  defaultOpenId,
}) => {
  const options = useMemo(() => content.options ?? [], [content.options]);
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const barBg = content.bgColor ?? section.bgColor ?? '#000';
  const contentBg = content.contentBgColor ?? '#fff';
  const barText = content.barTextColor ?? '#f8fafc';
  const barBorder = content.barBorderColor ?? 'rgba(255,255,255,0.85)';
  const contentTextColor = content.contentTextColor ?? '#000';

  if (!options.length) return null;

  return (
    <SectionWrap $barBg={barBg} $contentBg={contentBg} $barText={barText} $barBorder={barBorder}>
      <Container>
        {options.map(opt => {
          const isOpen = openId === opt.id;
          const regionId = `dd-${opt.id}`;
          return (
            <Block key={opt.id}>
              <Bar>
                <Toggle
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={regionId}
                  onClick={() => setOpenId(prev => (prev === opt.id ? null : opt.id))}
                >
                  <span className="label">{opt.label}</span>
                  <Chevron $open={isOpen} viewBox="0 0 20 20" aria-hidden>
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.06 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
                  </Chevron>
                </Toggle>
              </Bar>

              <Collapse id={regionId} $open={isOpen} role="region" aria-hidden={!isOpen}>
                <CollapseInner>
                  <div className="dd-content">
                    {(opt.title || opt.subtitle) && (
                      <Headline color={contentTextColor}>
                        {opt.title && <h3>{opt.title}</h3>}
                        {opt.subtitle && <p>{opt.subtitle}</p>}
                      </Headline>
                    )}

                    <Cards>
                      {(opt.cards ?? []).map(card => (
                        <Card key={card.id}>
                          {card.media && <CardMedia>{renderMedia(card.media)}</CardMedia>}
                          <CardBody color={contentTextColor}>
                            {card.title && (
                              <CardTitle $align={card.titleAlign ?? 'center'}>
                                {card.title}
                              </CardTitle>
                            )}
                            {card.description && (
                              <CardDescription $align={card.descriptionAlign ?? 'center'}>
                                {card.description}
                              </CardDescription>
                            )}
                            {card.ctaText && card.href && (
                              <CardCta href={card.href} aria-label={card.ctaText}>
                                {card.ctaText}
                                <span aria-hidden>→</span>
                              </CardCta>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </Cards>
                  </div>
                </CollapseInner>
              </Collapse>
            </Block>
          );
        })}
      </Container>
    </SectionWrap>
  );
};
