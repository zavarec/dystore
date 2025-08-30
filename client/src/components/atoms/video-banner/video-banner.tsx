import React, { useRef, useState, useEffect } from 'react';
import {
  BannerContainer,
  BackgroundImage,
  Overlay,
  VideoWrapper,
  Content,
  ToggleButton,
} from './video-banner.style';

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
  height?: string | number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showOverlay?: boolean;
  showToggle?: boolean;
  className?: string;
  children?: React.ReactNode; // Slot for heading/buttons
  contentAlign?: 'left' | 'center' | 'right';
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  src,
  backgroundImage,
  height = '60vh',
  autoPlay = true,
  muted = true,
  loop = true,
  showOverlay = true,
  showToggle = true,
  className,
  children,
  contentAlign = 'center',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(autoPlay));

  useEffect(() => {
    // Try to autoplay on mount on supported browsers
    if (autoPlay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [autoPlay]);

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

  return (
    <BannerContainer height={height} className={className}>
      {backgroundImage && <BackgroundImage background={backgroundImage} />}
      {src && (
        <VideoWrapper>
          <video ref={videoRef} autoPlay={autoPlay} muted={muted} loop={loop} playsInline>
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
