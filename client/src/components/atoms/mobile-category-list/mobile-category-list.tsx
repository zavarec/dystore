import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category } from '@/types/models/category.model';
import {
  MobileSubcategoryRow,
  MobileSubcategoryLink,
  MobileCategoryRow,
  MobileCategoryTitle,
  MobileCategoryIcon,
  Caret,
} from '../category-dropdown/category-dropdown.style';

interface MobileCategoryListProps {
  categories: Category[];
  loading?: boolean;
}

export const MobileCategoryList: React.FC<MobileCategoryListProps> = ({
  categories,
  loading = false,
}) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId);
    } else {
      newOpenCategories.add(categoryId);
    }
    setOpenCategories(newOpenCategories);
  };

  const handleNavigate = (categorySlug: string) => {
    router.push(`/category/${categorySlug}`);
  };

  if (loading) {
    return <div style={{ color: '#ffffff', padding: '8px 0' }}>Загрузка категорий...</div>;
  }

  return (
    <>
      {categories.map(category => {
        const isActive = router.asPath.startsWith(`/category/${category.slug}`);
        const isOpen = openCategories.has(category.id.toString());
        const hasSubcategories = !!(category.children && category.children.length > 0);

        return (
          <React.Fragment key={category.id}>
            {/* Родительская категория */}
            <MobileCategoryRow
              $hasSubcategories={hasSubcategories}
              role="group"
              aria-expanded={isOpen}
              aria-haspopup={hasSubcategories}
              onClick={hasSubcategories ? () => toggleCategory(category.id.toString()) : undefined}
            >
              {/* Название категории — только для навигации */}
              <MobileCategoryTitle
                $isActive={isActive}
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  e.stopPropagation(); // кликом по названию — только переход
                  handleNavigate(category.slug);
                }}
              >
                {category.name}
              </MobileCategoryTitle>

              {/* Стрелка для визуального указания на раскрытие */}
              {hasSubcategories && (
                <MobileCategoryIcon>
                  <Caret $open={isOpen} />
                </MobileCategoryIcon>
              )}
            </MobileCategoryRow>

            {/* Подкатегории (плоский список) */}
            {hasSubcategories && isOpen && category.children && (
              <>
                {category.children.map(subcategory => (
                  <MobileSubcategoryRow key={subcategory.id}>
                    <Link href={`/category/${subcategory.slug}`} passHref legacyBehavior>
                      <MobileSubcategoryLink>{subcategory.name}</MobileSubcategoryLink>
                    </Link>
                  </MobileSubcategoryRow>
                ))}
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
