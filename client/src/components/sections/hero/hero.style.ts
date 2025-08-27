import styled from '@emotion/styled';

export const HeroContainer = styled.section`
  background: transparent;
  padding: 0;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 220px);
  min-height: 400px;

  @media (max-width: 768px) {
    height: calc(100vh - 70px);
    min-height: 350px;
  }

  @media (max-width: 480px) {
    height: calc(100vh - 60px);
    min-height: 300px;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const SlideWrapper = styled.div<{ background: string | undefined }>`
  background-image: url(${({ background }) => background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;

  /* Темная накладка для лучшей читаемости текста */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

  @media (max-width: 768px) {
    &::before {
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

export const VideoWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const VideoControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 2;
`;

export const VideoToggleBtn = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 2;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
  }
`;
