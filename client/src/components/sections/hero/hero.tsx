import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/button';
import { Carousel, CarouselSlide } from '@/components/atoms/carousel';
import { HeroContainer, Container, SlideWrapper } from './hero.style';

interface HeroProps {
  onCatalogClick: () => void;
}

const heroSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'Добро пожаловать в DyStore',
    subtitle: 'Откройте для себя мир качественных товаров по доступным ценам',
    background: '/images/hero/1.webp',
  },
  {
    id: '2',
    title: 'Эксклюзивные предложения',
    subtitle: 'Специальные скидки и акции только для наших клиентов',
    background: '/images/hero/2.webp',
  },
  {
    id: '3',
    title: 'Быстрая доставка',
    subtitle: 'Получите свои заказы в кратчайшие сроки по всей стране',
    background: '/images/hero/3.webp',
  },
  {
    id: '4',
    title: 'Гарантия качества',
    subtitle: 'Мы гарантируем высокое качество всех представленных товаров',
    background: '/images/hero/3.webp',
  },
];

export const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  return (
    <HeroContainer>
      <Carousel
        slides={heroSlides}
        // autoplayInterval={6000}
        showIndicators={true}
      >
        {(slide, index) => (
          <SlideWrapper background={slide.background}>
            <Container>
              <motion.h1
                key={`title-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                key={`subtitle-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                key={`button-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button size="large" onClick={onCatalogClick}>
                  Смотреть каталог
                </Button>
              </motion.div>
            </Container>
          </SlideWrapper>
        )}
      </Carousel>
    </HeroContainer>
  );
};
