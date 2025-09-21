import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductWithDetails } from '@/types/models/product.model';
import {
  Card,
  SaveBadge,
  ProductImage,
  ProductInfo,
  ProductTitle,
  RatingContainer,
  StarRating,
  ReviewCount,
  PriceContainer,
  CurrentPrice,
  OriginalPrice,
  SaveAmount,
  ProductTitleWithImageWrapper,
} from './dyson-product-card.style';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { AddToCartButtonVariant } from '@/features/cart/add-to-cart-button/add-to-cart-button';

interface DysonProductCardProps {
  product: ProductWithDetails;
  index?: number;
  variant?: 'primary' | 'outline';
}

export const DysonProductCard: React.FC<DysonProductCardProps> = ({ product, index = 0 }) => {
  // Рассчитываем скидку
  const discount = product.originalPrice ? product.originalPrice - product.price : 0;

  const href = `/product/${product.slug}`;

  console.log(product, 'PRODUCT in product card');

  const genericBlur =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjgwJyBoZWlnaHQ9JzI4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMjgwJyBoZWlnaHQ9JzI4MCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg==';

  // Создаем звезды для рейтинга
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i}>☆</span>);
      } else {
        stars.push(
          <span key={i} style={{ color: '#ddd' }}>
            ☆
          </span>,
        );
      }
    }
    return stars;
  };

  return (
    <Card
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Бейдж скидки */}
      {discount > 0 && <SaveBadge>Save ₽{discount.toLocaleString('ru-RU')}</SaveBadge>}

      <Link href={href}>
        <ProductTitleWithImageWrapper>
          {/* Изображение товара */}

          <ProductImage>
            <Image
              src={product.mainImage?.url || '/images/placeholder.webp'}
              alt={product.name}
              width={280}
              height={280}
              style={{ objectFit: 'contain' }}
              priority={index < 3}
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={genericBlur}
            />
          </ProductImage>

          <ProductTitle>
            <span>{product.name}</span>
          </ProductTitle>

          {/* Рейтинг */}
          <RatingContainer>
            <StarRating>{renderStars(product.rating || 4)}</StarRating>

            <ReviewCount>{product.reviewCount || 509}</ReviewCount>
          </RatingContainer>
        </ProductTitleWithImageWrapper>

        {/* Информация о товаре */}
        <ProductInfo>
          {/* Цены */}
          <PriceContainer>
            <CurrentPrice>₽{product.price.toLocaleString('ru-RU')}</CurrentPrice>

            {product.originalPrice && (
              <div>
                <OriginalPrice>Was ₽{product.originalPrice.toLocaleString('ru-RU')}</OriginalPrice>

                <SaveAmount>Save ₽{discount.toLocaleString('ru-RU')}</SaveAmount>
              </div>
            )}
          </PriceContainer>
        </ProductInfo>
      </Link>

      {/* Кнопка */}
      <AddToCartButton
        // productId={product.id}
        product={product}
        variant={ButtonVariant.GREEN}
        size={AddToCartButtonVariant.LARGE}
        showQuantity={true}
      />
    </Card>
  );
};
