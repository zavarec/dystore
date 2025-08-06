import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const CategoryCardWrapper = styled(motion.div)`
  min-width: 260px;
  width: 280px;
  height: 350px;
  background: white;
  border-radius: 24px;
  overflow: hidden; // было: hidden

  cursor: pointer;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    border-color: rgb(74, 74, 74);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    min-width: 240px;
    width: 240px;
    height: 300px;
  }

  @media (max-width: 480px) {
    min-width: 200px;
    width: 200px;
    height: 260px;
  }
`;

export const CategoryImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 240px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

export const CategoryName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  padding: 20px 24px;
  text-align: center;
  line-height: 1.4;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 16px 20px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 16px;
  }
`;
