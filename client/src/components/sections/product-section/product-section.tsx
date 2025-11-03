import { ProductCardSkeleton } from '@/components/atoms/skeleton';
import type { ProductWithDetails } from '@/types/models/product.model';

import { DysonProductCard } from './components';
import { Section, SectionTitle, ProductGrid } from './product-section.style';

interface ProductSectionProps {
  title: string;
  products: ProductWithDetails[];
  variant?: 'primary' | 'outline';
  maxItems?: number;
  loading?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  variant = 'primary',
  maxItems,
  loading = false,
}) => {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <ProductGrid>
        {loading
          ? Array.from({ length: Math.max(3, Math.min(displayProducts.length || 4, 8)) }).map(
              (_, index) => <ProductCardSkeleton key={index} />,
            )
          : displayProducts?.map((product, index) => (
              <DysonProductCard
                key={product.slug ?? product.id}
                product={product}
                index={index}
                variant={variant}
              />
            ))}
      </ProductGrid>
    </Section>
  );
};
