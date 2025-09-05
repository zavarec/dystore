import styled from '@emotion/styled';
import { commonStyles } from '../shared';

export const Container = styled.div`
  ${commonStyles.container};
  padding: 0;
  padding-left: var(--page-gutter);

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const HeaderWithBenefitsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: '100vh';
`;
