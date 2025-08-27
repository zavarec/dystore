import React from 'react';
import { ProductWithDetails } from '@/types/models/product.model';
import { DysonProductCard } from './components';
import { Section, SectionTitle, ProductGrid } from './product-section.style';

interface ProductSectionProps {
  title: string;
  products: ProductWithDetails[];
  variant?: 'primary' | 'outline';
  maxItems?: number;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  variant = 'primary',
  maxItems,
}) => {
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <ProductGrid>
        {displayProducts.map((product, index) => (
          <DysonProductCard key={product.id} product={product} index={index} variant={variant} />
        ))}
      </ProductGrid>
    </Section>
  );
};
