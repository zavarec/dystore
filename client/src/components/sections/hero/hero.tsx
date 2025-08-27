import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/button';
import { Carousel, CarouselSlide } from '@/components/atoms/carousel';
import { HeroContainer, Container, SlideWrapper, VideoWrapper, VideoToggleBtn } from './hero.style';
import { ButtonVariant } from '@/components/atoms/button/button.style';

interface HeroProps {
  onCatalogClick: () => void;
}

const heroSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'Добро пожаловать в DyStore',
    subtitle: 'Откройте для себя мир качественных товаров по доступным ценам',
    video:
      'https://video-eu.assetsadobe.com/dyson/_renditions_/526/5261034a-d1bc-40a2-a45c-9125ef7c693a/avs/Dyson_EMEA_Summer%20Promo_Social_1280x600_6s_XCAT_DEALPAGE-BANNER.mp4_master-0x540-2000k.mp4?',
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
    background: '/images/hero/1.webp',
  },
];

export const PauseIcon = (
  <svg viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="16" fill="black" fillOpacity="0.5" />
    <path fill="#fff" d="M12 10h3v12h-3zM17 10h3v12h-3z" />
  </svg>
);

export const PlayIcon = (
  <svg viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="16" fill="black" fillOpacity="0.5" />
    <path fill="#fff" d="M12 10l10 6-10 6z" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <HeroContainer>
      <Carousel slides={heroSlides} showIndicators={true}>
        {(slide, index) => (
          <SlideWrapper background={slide.background}>
            {slide.video && (
              <VideoWrapper>
                <video ref={videoRef} autoPlay muted loop playsInline>
                  <source src={slide.video} />
                </video>
                <VideoToggleBtn
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Пауза видео' : 'Воспроизвести видео'}
                >
                  {isPlaying ? PauseIcon : PlayIcon}
                </VideoToggleBtn>
              </VideoWrapper>
            )}

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
                <Button
                  size="large"
                  onClick={onCatalogClick}
                  variant={ButtonVariant.GREEN}
                  style={{ borderRadius: 6 }}
                >
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
