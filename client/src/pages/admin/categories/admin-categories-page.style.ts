import styled from '@emotion/styled';

export const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

export const AddButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

export const CategoriesContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

export const CategoryItem = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-left: ${props => props.$level * 40}px;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CategoryIcon = styled.div`
  color: #6c757d;
`;

export const CategoryName = styled.div`
  font-weight: 500;
  color: #212529;
  font-size: 15px;
`;

export const CategoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: #6c757d;
  font-size: 13px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  transition: all 0.2s ease;

  ${props =>
    props.$variant === 'edit'
      ? `
    background: #ffc107;
    color: #000;
    
    &:hover {
      background: #e0a800;
    }
  `
      : `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;
