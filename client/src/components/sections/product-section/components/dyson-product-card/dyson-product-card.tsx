import Image from 'next/image';
import Link from 'next/link';

import { ButtonVariant } from '@/components/atoms/button/button.style';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { AddToCartButtonVariant } from '@/features/cart/add-to-cart-button/add-to-cart-button';
import type { ProductWithDetails } from '@/types/models/product.model';

import {
  Card,
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

interface DysonProductCardProps {
  product: ProductWithDetails;
  index?: number;
  variant?: 'primary' | 'outline';
}

export const DysonProductCard: React.FC<DysonProductCardProps> = ({ product, index = 0 }) => {
  const discount = product.originalPrice ? product.originalPrice - product.price : 0;

  const href = `/product/${product.slug}`;

  const genericBlur =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjgwJyBoZWlnaHQ9JzI4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMjgwJyBoZWlnaHQ9JzI4MCcgZmlsbD0nI2U5ZWNlZicvPjwvc3ZnPg==';

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
      {/* {discount > 0 && <SaveBadge>Сохраните ₽{discount.toLocaleString('ru-RU')}</SaveBadge>} */}

      <Link href={href}>
        <ProductTitleWithImageWrapper>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ProductTitle>
              <span>Беспроводной пылесос {product.name}</span>
            </ProductTitle>

            <RatingContainer>
              <StarRating>{renderStars(product.rating || 4)}</StarRating>

              <ReviewCount>{product.reviewCount || 509}</ReviewCount>
            </RatingContainer>
          </div>
        </ProductTitleWithImageWrapper>

        <ProductInfo>
          <PriceContainer>
            <CurrentPrice>{product.price.toLocaleString('ru-RU')}₽</CurrentPrice>

            {product.originalPrice && (
              <div>
                <OriginalPrice>Было {product.originalPrice.toLocaleString('ru-RU')}₽</OriginalPrice>

                <SaveAmount>Скидка {discount.toLocaleString('ru-RU')}₽</SaveAmount>
              </div>
            )}
          </PriceContainer>
        </ProductInfo>
      </Link>

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
