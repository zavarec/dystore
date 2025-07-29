import styled from '@emotion/styled';

export const DemoSection = styled.section`
  padding: 60px 0;
  background: #f8f9fa;
`;

export const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const DemoTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  text-align: center;
  margin-bottom: 40px;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    margin: 16px auto 0;
    border-radius: 2px;
  }
`;

export const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const DemoCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0 0 20px 0;
    font-size: 1.25rem;
    color: #212529;
  }
`;

export const DemoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #6c757d;
    font-weight: 500;
  }
`;

export const ProductSkeletonCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  max-width: 280px;
`;

export const CategorySkeletonGroup = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 10px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 2px;
  }
`;
