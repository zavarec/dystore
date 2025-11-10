import { useRef, useState, useEffect } from 'react';

import {
  BannerContainer,
  Overlay,
  VideoWrapper,
  Content,
  ToggleButton,
  LoaderWrapper,
} from './video-banner.style';
import { PageLoader } from '../page-loader/page-loader';

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

export interface VideoBannerProps {
  src?: string; // video url
  backgroundImage?: string; // fallback/overlay background
  poster?: string;
  height?: string | number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showOverlay?: boolean;
  showToggle?: boolean;
  className?: string;
  children?: React.ReactNode; // Slot for heading/buttons
  contentAlign?: 'left' | 'center' | 'right';
  preload?: 'auto' | 'metadata' | 'none';
  priorityImage?: boolean;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  src,

  poster,
  height = '60vh',
  autoPlay = true,
  muted = true,
  loop = true,
  showOverlay = true,
  showToggle = true,
  className,
  children,
  contentAlign = 'center',
  preload = 'metadata',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(autoPlay));
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

  useEffect(() => {
    setShouldRenderVideo(Boolean(src));
  }, [src]);

  useEffect(() => {
    if (!autoPlay || !shouldRenderVideo || !videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [autoPlay, shouldRenderVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <BannerContainer height={height} className={className}>
      {!isVideoLoaded && (
        <LoaderWrapper>
          <PageLoader />
        </LoaderWrapper>
      )}
      {shouldRenderVideo && src && (
        <VideoWrapper>
          <video
            ref={videoRef}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload={preload}
            poster={poster}
            onLoadedData={handleVideoLoaded}
            style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          >
            <source src={src} />
          </video>
        </VideoWrapper>
      )}
      {showOverlay && <Overlay />}

      <Content align={contentAlign}>{children}</Content>

      {showToggle && src && (
        <ToggleButton
          onClick={togglePlay}
          aria-label={isPlaying ? 'Пауза видео' : 'Воспроизвести видео'}
        >
          {isPlaying ? PauseIcon : PlayIcon}
        </ToggleButton>
      )}
    </BannerContainer>
  );
};

export default VideoBanner;
