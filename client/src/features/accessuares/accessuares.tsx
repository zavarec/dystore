import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  Section,
  Inner,
  LeftCol,
  H2,
  Hero,
  HeroImg,
  HeroStub,
  ProductCaption,
  Hr,
  RightCol,
  ItemCard,
  ItemHeader,
  Thumb,
  ThumbStub,
  HeaderText,
  ItemTitle,
  QtyBadge,
  Chevron,
  ItemBody,
  Muted,
  ItemImage,
  ItemCartWrapper,
  Col,
} from './accessuares.style';
import { BoxItemDto } from '@/types/models/product.model';
import UploadsService from '@/services/uploads.service';

// type BoxItemView = {
//   id: string | number;
//   title: string;
//   imageUrl?: string | null;
//   description?: string | null;
//   qty?: number | null;
// };

type AccessuaresProps = {
  title?: string;
  productName: string;
  productImageUrl?: string | undefined;
  boxItems: BoxItemDto[];
  defaultOpenId?: string | number;
  columns?: 2 | 3;
  className?: string;
};

export const Accessuares: React.FC<AccessuaresProps> = ({
  title = 'Комплектация',
  productName,
  productImageUrl,
  boxItems,
  defaultOpenId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columns = 2,
  className,
}) => {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId != null ? String(defaultOpenId) : null,
  );

  const [leftItems, rightItems] = useMemo(() => {
    const left: BoxItemDto[] = [];
    const right: BoxItemDto[] = [];
    boxItems.forEach((it, i) => (i % 2 === 0 ? left : right).push(it));
    return [left, right];
  }, [boxItems]);
  const renderItem = (item: BoxItemDto, index: number) => {
    const itemId = String(item.accessoryId ?? item.id ?? index);
    const isOpen = openId === itemId;

    return (
      <ItemCartWrapper key={item.id ?? itemId}>
        <ItemCard>
          <ItemHeader
            type="button"
            aria-expanded={isOpen}
            aria-controls={`desc-${itemId}`}
            onClick={() => setOpenId(prev => (prev === itemId ? null : itemId))}
          >
            <Thumb>
              {item.customImage?.url ? (
                <ItemImage src={item.customImage.url} alt={item.customName} />
              ) : (
                <ThumbStub>
                  Image
                  <br />
                  coming
                  <br />
                  soon
                </ThumbStub>
              )}
            </Thumb>
            <HeaderText>
              <ItemTitle>{item.customName}</ItemTitle>
            </HeaderText>
            <Chevron
              $open={isOpen}
              viewBox="0 0 31.656 18.657"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M15.828 18.657L0 2.829 2.828 0l13 13 13-13 2.828 2.829-15.828 15.828z"
                fill="currentColor"
              />
            </Chevron>
          </ItemHeader>
        </ItemCard>

        {isOpen ? (
          <ItemBody id={`desc-${itemId}`} role="region">
            {item.description ? (
              <p>{item.description}</p>
            ) : (
              <Muted>Описание будет добавлено.</Muted>
            )}
          </ItemBody>
        ) : null}
      </ItemCartWrapper>
    );
  };

  return (
    <Section className={className}>
      <H2>{title}</H2>
      <Inner>
        <LeftCol>
          <Hero>
            {productImageUrl ? (
              <HeroImg src={productImageUrl} alt={productName} />
            ) : (
              <HeroStub>Image coming soon</HeroStub>
            )}
          </Hero>
          <ProductCaption>{productName}</ProductCaption>
          <Hr />
        </LeftCol>

        <RightCol>
          <Col>{leftItems.map(renderItem)}</Col>
          <Col>{rightItems.map((it, i) => renderItem(it, i + leftItems.length))}</Col>
        </RightCol>
      </Inner>
    </Section>
  );
};
