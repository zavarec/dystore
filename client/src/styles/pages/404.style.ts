import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

export const Content = styled(motion.div)`
  text-align: center;
  color: white;
  max-width: 600px;
`;

export const ErrorCode = styled(motion.h1)`
  font-size: 8rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

export const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Description = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 32px;
  opacity: 0.9;
  line-height: 1.6;
`;

export const Actions = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
