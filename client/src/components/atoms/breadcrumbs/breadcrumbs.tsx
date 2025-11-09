import {
  BreadCrumbCategoryItem,
  BreadCrumbContainer,
  BreadCrumbCurrent,
  BreadCrumbHomeItem,
  BreadCrumbItem,
  BreadCrumbLinkStyled,
  BreadCrumbList,
  BreadCrumbMobileBackLink,
  BreadCrumbSeparator,
} from './breadcrumbs.style';
import { BreadcrumbArrow } from '../breadcrumb-arrow/breadcrumb-arrow';

export interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
  current?: string;
}

export const BreadCrumbs = ({ items, current }: BreadCrumbsProps) => {
  if (!items.length) return null;

  const home = items[0];
  const category = items[1];

  return (
    <BreadCrumbContainer aria-label="Хлебные крошки">
      {category && (
        <BreadCrumbMobileBackLink href={category.href ?? '/'}>
          <BreadcrumbArrow aria-hidden />
          {category.label}
        </BreadCrumbMobileBackLink>
      )}

      <BreadCrumbList>
        {/* Главная */}
        <BreadCrumbHomeItem>
          <BreadCrumbLinkStyled href={home?.href ?? '/'}>{home?.label}</BreadCrumbLinkStyled>
          <BreadCrumbSeparator aria-hidden />
        </BreadCrumbHomeItem>

        {/* Категория */}
        {category && (
          <BreadCrumbCategoryItem>
            <BreadcrumbArrow className="back" aria-hidden />
            {category.href ? (
              <BreadCrumbLinkStyled href={category.href}>{category.label}</BreadCrumbLinkStyled>
            ) : (
              <BreadCrumbCurrent>{category.label}</BreadCrumbCurrent>
            )}
            <BreadCrumbSeparator style={{ marginLeft: 4 }} aria-hidden />
          </BreadCrumbCategoryItem>
        )}

        {/* Текущий продукт */}
        {current && (
          <BreadCrumbItem>
            <BreadCrumbCurrent>{current}</BreadCrumbCurrent>
          </BreadCrumbItem>
        )}
      </BreadCrumbList>
    </BreadCrumbContainer>
  );
};
