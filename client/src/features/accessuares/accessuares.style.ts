import { media } from '@/styles/breakpoints';
import styled from '@emotion/styled';

export const Section = styled.section`
  width: 100%;
  border-top: 2px solid #e0e0e0;
  background-color: #ffffff;
  padding: 40px var(--page-gutter);

  @media (min-width: 992px) {
    padding: 40px var(--page-gutter);
    width: 100%;
  }

  ${media.down('tablet')} {
    padding-bottom: 14px;
  }
`;

export const H2 = styled.h2`
  font-size: 28px;
  line-height: 1.2;
  margin: 0 0 16px;
  font-weight: 500;
  width: 100%;

  @media (min-width: 992px) {
    font-size: 36px;
    margin-bottom: 24px;
  }
`;

export const Hero = styled.div`
  width: 100%;

  position: relative;

  @media (min-width: 992px) {
    /* min-height: 320px; */
    /* padding: 32px; */
  }
`;

export const HeroImg = styled.img`
  display: block;
  max-height: 22rem;
  height: auto;
  object-fit: contain;
  width: 100%;
`;

export const HeroStub = styled.div`
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  color: #9aa0a6;
  display: grid;
  place-items: center;
  font-size: 14px;
`;

export const ProductCaption = styled.div`
  margin-top: 16px;
  color: #5f6368;
  font-size: 14px;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ececec;
  margin: 24px 0 0;
`;

export const ItemCard = styled.div`
  display: flex;
  align-items: center;
  vertical-align: center;
  grid-column-gap: 5px;
  padding: 12px;
`;

export const ItemHeader = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 84px 1fr 24px;
  gap: 12px;
  align-items: center;

  text-align: left;
  background: #fff;
  border: none;
  cursor: pointer;
`;

export const Thumb = styled.div`
  border-radius: 8px;

  width: 100%;
  height: 100%;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
`;

export const ThumbStub = styled.div`
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #9aa0a6;
  text-align: center;
  display: grid;
  place-items: center;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ItemTitle = styled.div`
  font-size: 15px;
  line-height: 1.3;
  font-weight: 500;
  color: #373737;
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 1.5rem 1rem 1.5rem 0;
`;

export const QtyBadge = styled.span`
  background: #f1f3f4;
  color: #3c4043;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 1;
`;

export const ItemBody = styled.div`
  /* padding: 0 14px 12px 14px; */
  p {
    margin: 0;
    font-size: 14px;
    color: #3c4043;
    line-height: 1.5;
  }
`;

export const Muted = styled.p`
  color: #9aa0a6 !important;
`;

export const ItemImage = styled.img`
  max-width: 6.25rem;
  max-height: 6.25rem;
`;

export const Chevron = styled.svg<{ $open: boolean }>`
  width: 18px; /* можно 20–24px, как нравится по макету */
  height: 12px;
  justify-self: end;
  align-self: center;
  color: #3c4043; /* иконка окрасится через currentColor */
  transition: transform 160ms ease;
  transform: rotate(${p => (p.$open ? '180deg' : '0deg')});
  pointer-events: none; /* чтобы клики шли по кнопке ItemHeader */
`;

export const Inner = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-right: 0;
  display: flex;
  /* без gap, чтобы 40% + 60% влезали ровно */

  ${media.down('tablet')} {
    flex-direction: column;
    align-items: center;
  }
`;

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 0;
  margin-right: 12px;
  ${media.down('tablet')} {
    width: 100%;
    padding-bottom: 14px;
  }
`;

export const RightCol = styled.div`
  display: flex;
  width: 60%;
  min-width: 0;
  gap: 16px; /* расстояние между двумя списками */
  align-items: flex-start;
  ${media.down('tablet')} {
    flex-direction: column;
    width: 90%;
  }
`;

export const Col = styled.div`
  flex: 1 1 0; /* две колонки по 50% внутри правого блока */
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* остальное — без изменений, но добавим ширину, чтобы карточка тянулась на всю колонку */
export const ItemCartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: fit-content;

  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;

  padding: 8px;
  width: 100%; /* важное: занимает всю ширину своей колонки */
`;
