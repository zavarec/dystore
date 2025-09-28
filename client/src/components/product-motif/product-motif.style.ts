import styled from '@emotion/styled';

export const Wrap = styled.div`
  display: inline-flex;
  align-items: center;

  img {
    width: auto;
    height: 3.25rem;
  }

  @media (min-width: 768px) {
    img {
      height: 24px;
    }
  }
  @media (min-width: 1200px) {
    img {
      height: 28px;
      height: 3.25rem;
    }
  }
`;
