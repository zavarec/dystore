import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownTrigger = styled.button<{
  $isActive: boolean;
  $isOpen: boolean;
}>`
  color: ${props => (props.$isActive ? '#007bff' : '#ffffff')};
  text-decoration: none;
  font-weight: ${props => (props.$isActive ? '600' : '400')};
  font-size: 14px;
  position: relative;
  padding: 32px 16px 24px 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid white;
  }
`;

export const DropdownContent = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: #222222;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  z-index: 1000;

  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #222222;
  }
`;

export const CategorySection = styled.div`
  margin-bottom: 4px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MainCategoryItem = styled.a`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left-color: #007bff;
    color: #007bff;
  }
`;

export const SubcategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SubcategoryItem = styled.a`
  display: flex;
  align-items: center;
  padding: 6px 16px;
  color: #cccccc;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 3px;
    background: #666666;
    border-radius: 50%;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;

    &::before {
      background: #007bff;
    }
  }
`;

export const EmptyMessage = styled.div`
  padding: 12px 16px;
  color: #999999;
  font-size: 13px;
  text-align: center;
  font-style: italic;
  max-width: 1200px;
  margin: 0 auto;
`;

export const LoadingSpinner = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  font-size: 13px;
  max-width: 1200px;
  margin: 0 auto;
`;

// =====================
// Mobile-only components
// =====================

export const MobileCategoryRow = styled.div<{ $hasSubcategories: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
`;

export const MobileCategoryTitle = styled.span<{ $isActive: boolean }>`
  flex: 1;
  display: block;
  text-align: left;
  color: ${props => (props.$isActive ? '#007bff' : '#ffffff')};
  font-size: 14px;
  padding: 8px 0;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: auto;
    flex: 0 0 auto;
  }
`;

export const MobileCategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Caret = styled.span<{ $open: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: ${props => (props.$open ? 'rotate(45deg)' : 'rotate(-45deg)')};
  transition: transform 0.2s ease;
`;

export const MobileSubcategoryRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 16px 6px 32px;
`;

export const MobileSubcategoryLink = styled.a`
  display: block;
  width: 100%;
  color: #cccccc;
  text-decoration: none;
  font-size: 13px;
  padding: 8px 0;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;
