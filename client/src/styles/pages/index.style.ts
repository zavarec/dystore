import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const HeaderWithBenefitsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: '100vh';
`;
