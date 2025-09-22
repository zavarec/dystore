import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import type { CarouselSlide } from '@/components/atoms/carousel';
import { Carousel } from '@/components/atoms/carousel';
import { VideoBanner } from '@/components/atoms/video-banner';

import { HeroContainer, Container } from './hero.style';

interface HeroProps {
  onCatalogClick: () => void;
}

const heroSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'Добро пожаловать в Dyson Group',
    subtitle: 'Откройте для себя мир качественных товаров по доступным ценам',
    video:
      'https://video-eu.assetsadobe.com/dyson/_renditions_/526/5261034a-d1bc-40a2-a45c-9125ef7c693a/avs/Dyson_EMEA_Summer%20Promo_Social_1280x600_6s_XCAT_DEALPAGE-BANNER.mp4_master-0x540-2000k.mp4?',
  },
];

export const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  return (
    <HeroContainer>
      <Carousel slides={heroSlides} showIndicators={true}>
        {(slide, index) => (
          <VideoBanner
            height="100%"
            {...(slide.video ? { src: slide.video } : {})}
            {...(slide.background ? { backgroundImage: slide.background } : {})}
          >
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
          </VideoBanner>
        )}
      </Carousel>
    </HeroContainer>
  );
};
