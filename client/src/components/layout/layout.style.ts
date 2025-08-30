import styled from '@emotion/styled';

export const PageContainer = styled.div`
  padding-top: 70px; /* Отступ для фиксированного хедера */
  min-height: 100vh;
  font-family: var(--font-nunito-sans);
  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

export const Main = styled.main`
  flex: 1;
`;
