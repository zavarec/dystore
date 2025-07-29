import React, { useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Category } from '@/types/models/category.model';
import { CategoryCard } from '../category-card';
import {
  CarouselWrapper,
  CarouselContainer,
  CarouselTrack,
  CarouselButton,
} from './category-carousel.style';

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick: (slug: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  onCategoryClick,
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        trackRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      trackRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <CarouselWrapper>
      <CarouselButton direction="left" disabled={!canScrollLeft} onClick={() => scroll('left')}>
        <CaretLeft size={20} />
      </CarouselButton>

      <CarouselContainer>
        <CarouselTrack ref={trackRef} onScroll={checkScrollButtons}>
          {categories.map((category: Category) => (
            <CategoryCard key={category.id} category={category} onClick={onCategoryClick} />
          ))}
        </CarouselTrack>
      </CarouselContainer>

      <CarouselButton direction="right" disabled={!canScrollRight} onClick={() => scroll('right')}>
        <CaretRight size={20} />
      </CarouselButton>
    </CarouselWrapper>
  );
};
