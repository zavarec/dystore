import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
`;

const Spinner = styled.div`
  border: 4px solid #e0e0e0;
  border-top: 4px solid #000; /* Цвет крутящейся части — под Dyson можно #000 */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 0.8s linear infinite;
`;

export const PageLoader: React.FC = () => (
  <LoaderOverlay>
    <Spinner />
  </LoaderOverlay>
);
