import styled from '@emotion/styled';

export const CategoriesSection = styled.section`
  padding: 40px 0;
  background: rgb(255, 255, 255);
  overflow-x: hidden;
  overflow-y: visible;
`;

export const CategoriesContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding-left: 40px;
`;

export const CategoriesHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

export const CategoriesTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
  position: relative;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const ScrollContainer = styled.div<{ $center?: boolean }>`
  display: flex;
  align-items: center;
  gap: 24px;

  overflow-x: auto; /* включаем скролл при переполнении */
  scroll-snap-type: ${p => (p.$center ? 'none' : 'x mandatory')};
  justify-content: ${p => (p.$center ? 'center' : 'flex-start')};

  padding-bottom: 10px;
  padding-right: 40px;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
