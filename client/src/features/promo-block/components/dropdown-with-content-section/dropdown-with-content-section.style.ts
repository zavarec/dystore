// dropdown-with-content-section.style.ts
import styled from '@emotion/styled';
export const SectionWrap = styled.section<{
  $barBg: string;
  $contentBg: string;
  $barText: string;
  $barBorder: string;
}>`
  /* Полоса с дропдауном */
  background: ${({ $barBg }) => $barBg};
  color: ${({ $barText }) => $barText};

  /* CSS-переменные для потомков */
  --dd-content-bg: ${({ $contentBg }) => $contentBg};
  --dd-bar-text: ${({ $barText }) => $barText};
  --dd-bar-border: ${({ $barBorder }) => $barBorder};
`;

export const Container = styled.div`
  // max-width: 1240px;
  margin: 0 auto;
  // padding: 0 16px;
  @media (min-width: 960px) {
    // padding: 0 24px;
  }
`;

export const Block = styled.div`
  /* margin: 0 0 32px; */
  @media (min-width: 960px) {
    /* margin: 0 0 40px; */
  }
`;

export const Bar = styled.div`
  /* Чёрная полоса вокруг рамки */
  padding: 18px 32px;
`;

export const Toggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--dd-bar-text);
  background: transparent;

  /* Двойная белая линия как у Dyson */
  border: 2px solid var(--dd-bar-border);
  box-shadow:
    inset 0 0 0 1px var(--dd-bar-border),
    0 0 0 1px var(--dd-bar-border);

  .label {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.01em;
    text-align: left;
  }
`;

export const Chevron = styled.svg<{ $open?: boolean }>`
  width: 22px;
  height: 22px;
  fill: currentColor;
  transform: rotate(${p => (p.$open ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
`;

export const Collapse = styled.div<{ $open?: boolean }>`
  overflow: hidden;
  background: var(--dd-content-bg); /* белая секция */
  transition:
    max-height 0.28s ease,
    opacity 0.2s ease;
  max-height: ${p => (p.$open ? '5000px' : '0')};
  opacity: ${p => (p.$open ? 1 : 0)};
  /* без внешних отступов — когда закрыто, секция полностью исчезает */
`;

export const CollapseInner = styled.div`
  /* Внутренние отступы белой секции как у Dyson */
  /* padding: 40px 0 56px; */
  @media (min-width: 960px) {
    padding: 48px 0 64px;
  }

  .dd-content {
    /* Центрируем контент и ограничиваем ширину блока с круглыми иллюстрациями */
    /* max-width: 1100px; */
    margin: 0 auto;
    padding: 0 16px;
    @media (min-width: 960px) {
      padding: 0 24px;
    }
  }
`;

export const Headline = styled.div<{ color?: string }>`
  text-align: center;

  h3 {
    margin: 0 0 10px;
    font-size: clamp(28px, 3.2vw, 36px);
    line-height: 1.25;
    font-weight: 600; /* у Dyson визуально ближе к 600 */
    color: ${({ color }) => (color ? color : '#111')};
  }
  p {
    margin: 0;
    font-size: 16px;
    color: #6b7280; /* спокойный серый как в примере */
  }
`;

export const Cards = styled.div`
  /* Сетка как на Dyson: 1 / 2 / 4 колонки + большие промежутки */
  /* display: grid; */
  /* grid-template-columns: 1fr; */
  display: flex;

  flex-wrap: wrap;
  justify-content: center; /* центрируем по горизонтали */
  align-items: flex-start;
  row-gap: 36px;
  column-gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 44px;
    column-gap: 48px;
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    row-gap: 52px;
    column-gap: 56px;
  }
`;

export const Card = styled.article`
  /* Никаких «коробок» — только контент, как на Dyson */
  width: 100%;
  max-width: 260px; /* контролируем визуальную ширину «круга + текст» */
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center; /* центрируем содержимое */
`;

export const CardMedia = styled.div`
  /* Квадратный холст под круговые иллюстрации */
  width: clamp(180px, 22vw, 240px);
  aspect-ratio: 1 / 1;
  position: relative;
  margin: 0 auto 16px;

  > img,
  > video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain; /* не обрезаем — у Dyson круг в самом изображении */
    display: block;
  }
`;

export const CardBody = styled.div<{ color?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ color }) => (color ? color : '#111')};
`;

export const CardTitle = styled.h4<{ $align?: 'left' | 'center' | 'right' }>`
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 600;
  text-align: ${({ $align }) => $align ?? 'center'};
`;

export const CardDescription = styled.p<{ $align?: 'left' | 'center' | 'right' }>`
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  /* color: #4b5563; */
  text-align: ${({ $align }) => $align ?? 'center'};
`;

export const CardCta = styled.a`
  margin-top: 8px;
  align-self: center;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #0ea5e9;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
