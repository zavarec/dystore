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

export const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 24px;
  padding-bottom: 10px;
  padding-right: 40px;

  /* Скрыть скроллбар везде */
  -ms-overflow-style: none; /* IE и Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    width: 0;
    height: 0;
    
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* убираем серый фон */
  }
`;
