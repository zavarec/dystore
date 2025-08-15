import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category } from '@/types/models/category.model';
import {
  DropdownContainer,
  DropdownTrigger,
  DropdownContent,
  CategorySection,
  SubcategoriesList,
  SubcategoryItem,
  EmptyMessage,
  LoadingSpinner,
} from './category-dropdown.style';
import { useDropdownToggle } from '../hooks/use-dropdown-toggle';

interface CategoryDropdownProps {
  category: Category;
  isActive?: boolean;
  loading?: boolean;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  category,
  isActive = false,
  loading = false,
}) => {
  const { isOpen, close, cancelClose } = useDropdownToggle(300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTriggerClick = () => {
    router.push(`/category/${category.slug}`);
  };

  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <div onMouseEnter={cancelClose} onMouseLeave={close}>
      <DropdownContainer ref={dropdownRef}>
        <DropdownTrigger
          $isActive={isActive}
          $isOpen={isOpen}
          onClick={handleTriggerClick}
          role="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={`dropdown-${category.id}`}
        >
          {category.name}
          {hasSubcategories && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          )}
        </DropdownTrigger>
      </DropdownContainer>

      {hasSubcategories && isOpen && (
        <DropdownContent
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {loading ? (
            <LoadingSpinner>Загрузка...</LoadingSpinner>
          ) : (
            <CategorySection>
              {category.children && category.children.length > 0 && (
                <SubcategoriesList>
                  {category.children.map(subcategory => (
                    <Link
                      key={subcategory.id}
                      href={`/category/${subcategory.slug}`}
                      passHref
                      legacyBehavior
                    >
                      <SubcategoryItem>{subcategory.name}</SubcategoryItem>
                    </Link>
                  ))}
                </SubcategoriesList>
              )}
            </CategorySection>
          )}

          {!loading && (!category.children || category.children.length === 0) && (
            <EmptyMessage>Нет подкатегорий</EmptyMessage>
          )}
        </DropdownContent>
      )}
    </div>
  );
};
