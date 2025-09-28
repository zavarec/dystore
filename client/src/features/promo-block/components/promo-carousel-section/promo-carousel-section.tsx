import { useEffect, useMemo, useRef, useState } from 'react';

import type {
  PromoCarouselContent,
  PromoCarouselSlide,
  PromoDropdownContent,
  PromoHighlightsContent,
  PromoCarouselPayload,
  PromoMedia,
} from '@/types/models/promo-carousel';
import { PromoVariant } from '@/types/models/promo-section.model';
import type { PromoSection } from '@/types/models/promo-section.model';

import {
  Wrap,
  Viewport,
  Slides,
  Slide,
  Media,
  Overlay,
  Grad,
  Dots,
  Dot,
  Arrow,
  Title,
  Subtitle,
} from './promo-carousel-section.style';
import { DropdownWithContentSection } from '../dropdown-with-content-section/dropdown-with-content-section';
import { MachineHighlightsSection } from '../machine-highlights-section/machine-highlights-section';

function useAutoplay(enabled: boolean, intervalMs: number, onTick: () => void) {
  const saved = useRef(onTick);
  useEffect(() => {
    saved.current = onTick;
  }, [onTick]);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => saved.current(), Math.max(1500, intervalMs || 6000));
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
}

function isCarouselContent(payload: PromoCarouselPayload): payload is PromoCarouselContent {
  return payload.kind === 'carousel';
}

function isDropdownContent(payload: PromoCarouselPayload): payload is PromoDropdownContent {
  return payload.kind === 'dropdown';
}

function isHighlightsContent(payload: PromoCarouselPayload): payload is PromoHighlightsContent {
  return payload.kind === 'highlights';
}

function parseContent(raw: unknown): PromoCarouselPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const maybe = raw as PromoCarouselPayload;
  if (maybe.kind === 'carousel' && Array.isArray(maybe.slides)) return maybe;
  if (maybe.kind === 'dropdown' && Array.isArray(maybe.options)) return maybe;
  if (maybe.kind === 'highlights' && Array.isArray(maybe.items)) return maybe;
  return null;
}

function renderMedia(media?: PromoMedia) {
  if (!media) return null;
  if (media.type === 'video') {
    return (
      <video src={media.src} poster={media.poster} playsInline muted loop preload="metadata" />
    );
  }
  if (media.type === 'image') {
    return <img src={media.src} alt="" loading="lazy" />;
  }
  return null;
}

export const PromoCarouselSection = (section: PromoSection) => {
  if (section.variant !== PromoVariant.CAROUSEL) return null;

  const payload = useMemo(() => parseContent(section.content), [section.content]);
  if (!payload) return null;

  if (isDropdownContent(payload)) {
    return <DropdownWithContentSection section={section} content={payload} />;
  }

  if (isHighlightsContent(payload)) {
    return <MachineHighlightsSection section={section} content={payload} />;
  }

  if (!isCarouselContent(payload) || !payload.slides.length) return null;

  const [index, setIndex] = useState(0);
  const last = payload.slides.length - 1;

  useEffect(() => {
    setIndex(0);
  }, [payload.slides.length]);

  const next = () => setIndex(i => (i >= last ? 0 : i + 1));
  const prev = () => setIndex(i => (i <= 0 ? last : i - 1));

  useAutoplay(!!payload.autoplay, payload.intervalMs ?? 6000, next);

  const currentSlide = payload.slides[index];
  const currentBg = currentSlide?.bgColor ?? section.bgColor ?? '';

  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prev(); // свайп вправо → предыдущий
      } else {
        next(); // свайп влево → следующий
      }
    }
    startX.current = null;
  };

  const renderSlide = (slide: PromoCarouselSlide) => (
    <>
      <Media>{renderMedia(slide.media)}</Media>
      <Grad />
      <Overlay align={slide.align ?? 'left'}>
        <div>
          {slide.title && (
            <Title
              {...(slide.titleColor && { $color: slide.titleColor })}
              {...(slide.titleSize && { $fontSize: slide.titleSize })}
              {...(slide.titleWeight && { $fontWeight: slide.titleWeight })}
              {...(slide.titleLineHeight && { $lineHeight: slide.titleLineHeight })}
              {...(slide.titleMargin && { $margin: slide.titleMargin })}
            >
              {slide.title}
            </Title>
          )}
          {slide.subtitle && (
            <Subtitle
              {...(slide.subtitleColor && { $color: slide.subtitleColor })}
              {...(slide.subtitleSize && { $fontSize: slide.subtitleSize })}
              {...(slide.subtitleWeight && { $fontWeight: slide.subtitleWeight })}
              {...(slide.subtitleLineHeight && { $lineHeight: slide.subtitleLineHeight })}
              {...(slide.subtitleMargin && { $margin: slide.subtitleMargin })}
              {...(slide.subtitleOpacity && { $opacity: slide.subtitleOpacity })}
            >
              {slide.subtitle}
            </Subtitle>
          )}
          {slide.cta && (
            <a href={slide.cta.href} aria-label={slide.cta.text}>
              {slide.cta.text}
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </Overlay>
    </>
  );

  return (
    <Wrap bg={currentBg} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <Viewport>
        <Slides $index={index}>
          {payload.slides.map(slide => (
            <Slide key={slide.id}>{renderSlide(slide)}</Slide>
          ))}
        </Slides>

        {(payload.showArrows ?? true) && (
          <>
            <Arrow side="left" aria-label="Previous slide" onClick={prev}>
              <svg
                viewBox="0 0 31.656 18.657"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(90deg)' }}
              >
                <path d="M15.828 18.657L2.829 2.828h25.999L15.828 18.657z" />
              </svg>
            </Arrow>
            <Arrow side="right" aria-label="Next slide" onClick={next}>
              <svg
                viewBox="0 0 31.656 18.657"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(270deg)' }}
              >
                <path d="M15.828 18.657L2.829 2.828h25.999L15.828 18.657z" />
              </svg>
            </Arrow>
          </>
        )}

        {(payload.showDots ?? true) && (
          <Dots>
            {payload.slides.map((slide, i) => (
              <Dot
                key={slide.id}
                $active={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </Dots>
        )}
      </Viewport>
    </Wrap>
  );
};
