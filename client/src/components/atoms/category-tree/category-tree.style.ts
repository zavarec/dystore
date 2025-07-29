import styled from '@emotion/styled';

export const TreeContainer = styled.div`
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const TreeNode = styled.div<{ level: number }>`
  padding-left: ${({ level }) => level * 20}px;
  margin-bottom: 4px;
`;

export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e8e8e8;
  }
`;

export const NodeToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: #666;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }
`;

export const NodeContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

export const NodeTitle = styled.span<{ hasChildren?: boolean }>`
  font-size: 14px;
  font-weight: ${({ hasChildren }) => (hasChildren ? '500' : '400')};
  color: ${({ hasChildren }) => (hasChildren ? '#333' : '#555')};
  transition: color 0.2s ease;

  ${NodeHeader}:hover & {
    color: #000;
  }
`;

export const ProductCount = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: normal;
`;

export const NodeChildren = styled.div`
  margin-left: 12px;
  border-left: 1px solid #e0e0e0;
  padding-left: 8px;
`;

export const NodeBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;

  span {
    white-space: nowrap;
  }

  span[style*='cursor: pointer'] {
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Дополнительные стили для различных вариантов дерева
export const CompactTreeContainer = styled(TreeContainer)`
  font-size: 13px;

  ${NodeHeader} {
    padding: 4px 8px;
  }

  ${NodeToggle} {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;

export const ExpandedTreeContainer = styled(TreeContainer)`
  ${NodeHeader} {
    padding: 12px 16px;
    border: 1px solid transparent;

    &:hover {
      border-color: #d0d0d0;
      background-color: #fafafa;
    }
  }

  ${NodeTitle} {
    font-size: 15px;
  }
`;

// Стили для выбранного элемента
export const SelectedNodeHeader = styled(NodeHeader)`
  background-color: #e3f2fd;
  border-color: #2196f3;

  &:hover {
    background-color: #bbdefb;
  }

  ${NodeTitle} {
    color: #1976d2;
    font-weight: 600;
  }
`;
