import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Card = styled(motion.div)`
  position: relative;
  background: #ffffff;
  border: 1px solid #e0e0e0;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 350px;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: black;
  }

  /* Делаем кликабельную область (Link -> a) флекс-колонкой и растягиваем на всю высоту,
     чтобы кнопка добавления в корзину всегда прижималась к низу карточки */
  a {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  @media (max-width: 768px) {
    max-width: 320px;
  }

  @media (max-width: 480px) {
    /* max-width: 100%; */
  }
`;

export const ProductTitleWithImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  padding-left: 20px;

  /* Убираем внутреннюю разделительную линию, чтобы не было «лесенки» в сетке карточек */
  /* border-bottom: 1px solid #e0e0e0; */
  padding-bottom: 12px;
`;

export const SaveBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: #0166cc;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 4px;
  z-index: 2;
  text-shadow: none;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 10px;
    top: 12px;
    left: 12px;
  }
`;

export const ProductImage = styled.div`
  height: 300px;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  img {
    max-width: 100%;
    max-height: 100%;
  }

  @media (max-width: 768px) {
    height: 250px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    height: 200px;
    padding: 10px;
  }
`;

export const ProductInfo = styled.div`
  padding: 20px 20px 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 12px;
  color: #333;
  /* height: calc(1.3em * 2); высота ровно под две строки */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      color: #0166cc;
    }
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 14px;
  }
`;

export const StarRating = styled.div`
  display: flex;
  gap: 2px;

  span {
    color: #ffa500;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    span {
      font-size: 14px;
    }
  }
`;

export const ReviewCount = styled.span`
  color: #666;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const PriceContainer = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

export const CurrentPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0166cc;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 6px;
  }
`;

export const OriginalPrice = styled.span`
  color: #999;
  font-size: 14px;
  margin-right: 12px;
  text-decoration: line-through;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-right: 8px;
  }
`;

export const SaveAmount = styled.span`
  color: #0166cc;
  font-size: 14px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;
