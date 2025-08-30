import styled from '@emotion/styled';

export const ScrollContainer = styled.div<{ gap: string; paddingInline: string }>`
  display: flex;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  gap: ${({ gap }) => gap};
  padding-inline: ${({ paddingInline }) => paddingInline};
  padding-bottom: 10px;
  padding-left: 40px;
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const Slide = styled.div<{ minWidth: string }>`
  flex: 0 0 auto;
  scroll-snap-align: start;
  min-width: ${({ minWidth }) => minWidth};
`;
