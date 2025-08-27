import styled from '@emotion/styled';

export const StorePanoramaContainer = styled.section`
  width: 100%;
  height: 500px;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
    margin: 60px 0;
  }

  @media (max-width: 480px) {
    height: 150px;
    margin: 40px 0;
  }
`;

export const StoreImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;
