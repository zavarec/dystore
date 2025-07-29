import styled from '@emotion/styled';

export const CategoriesSection = styled.section`
  padding: 40px 0;
  background: rgb(255, 255, 255);
  overflow: hidden;
`;

export const CategoriesContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const CategoriesHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

export const CategoriesTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    margin: 16px auto 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;
