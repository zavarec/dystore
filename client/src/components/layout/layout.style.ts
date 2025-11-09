import styled from '@emotion/styled';

export const PageContainer = styled.div`
  padding-top: calc(var(--header-h) + env(safe-area-inset-top, 0px));
  margin-top: auto;
  min-height: 100vh;
  font-family: var(--font-nunito-sans);
  @media (max-width: 768px) {
    /* padding-top: 60px; */
    margin-top: auto;
  }
`;

export const Main = styled.main`
  flex: 1;
`;
