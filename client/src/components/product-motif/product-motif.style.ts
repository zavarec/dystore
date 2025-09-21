import styled from '@emotion/styled';

export const Wrap = styled.div`
  display: inline-flex;
  align-items: center;

  /* фиксируем высоту на брейкпоинтах, ширина авто */
  img {
    display: block;
    height: 20px; /* xs */
    width: auto;
  }

  @media (min-width: 768px) {
    img {
      height: 24px;
    } /* md */
  }
  @media (min-width: 1200px) {
    img {
      height: 28px;
    } /* lg (как у Dyson) */
  }
`;
