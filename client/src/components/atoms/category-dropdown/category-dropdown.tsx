import React, { useState, useRef, useEffect } from 'react';
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

interface CategoryDropdownProps {
  category: Category;
  isActive?: boolean;
  loading?: boolean;
}

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  category,
  isActive = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Задержка перед закрытием
    setTimeoutId(id);
  };

  const handleTriggerClick = () => {
    router.push(`/category/${category.slug}`);
  };

  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownContainer ref={dropdownRef}>
        <DropdownTrigger $isActive={isActive} $isOpen={isOpen} onClick={handleTriggerClick}>
          {category.name}
          {hasSubcategories && <ChevronDownIcon />}
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
