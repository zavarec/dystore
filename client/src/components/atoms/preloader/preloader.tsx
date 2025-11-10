import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3333;
  z-index: 9999;
  /* animation: ${fadeIn} 0.3s ease-in; */
`;

export const Preloader: React.FC = () => (
  <LoaderWrapper>
    <img src="/gif/preloader.gif" alt="Loading..." width={120} height={120} />
  </LoaderWrapper>
);
