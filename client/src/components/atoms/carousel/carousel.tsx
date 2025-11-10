import { useState, useEffect, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
  CarouselContainer,
  CarouselSlide,
  CarouselIndicators,
  CarouselIndicator,
  CarouselContent,
} from './carousel.style';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  background?: string;
  video?: string;
  poster?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplayInterval?: number;
  showIndicators?: boolean;
  children?: (slide: CarouselSlide, index: number) => React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoplayInterval,
  showIndicators = true,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasCustomRenderer = typeof children === 'function';

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!autoplayInterval || autoplayInterval <= 0) return;

    const interval = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoplayInterval]);

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.1,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
    },
  };

  return (
    <CarouselContainer>
      <AnimatePresence mode="wait">
        <CarouselSlide
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          background={
            slides[currentSlide]?.video
              ? ''
              : slides[currentSlide]?.background ||
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }
        >
          {!hasCustomRenderer && slides[currentSlide]?.video && (
            <video
              key={slides[currentSlide]?.video} // перезапуск при смене слайда
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            >
              <source src={slides[currentSlide]?.video} type="video/mp4" />
            </video>
          )}

          <CarouselContent>
            {children && slides[currentSlide] ? (
              children(slides[currentSlide], currentSlide)
            ) : slides[currentSlide] ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </>
            ) : null}
          </CarouselContent>
        </CarouselSlide>
      </AnimatePresence>

      {showIndicators && slides.length > 1 && (
        <CarouselIndicators>
          {slides.map((_, index) => (
            <CarouselIndicator
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </CarouselIndicators>
      )}
    </CarouselContainer>
  );
};
