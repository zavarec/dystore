import styled from '@emotion/styled';

export const Wrapper = styled.div``;

export const Dropzone = styled.div<{ $dragging: boolean }>`
  position: relative;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
  background: #fafafa;
  ${p =>
    p.$dragging &&
    `
    border-color: #007bff;
    background: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.15);
  `}
`;

const primarySurface = `
  background: #111;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s ease, box-shadow 0.2s ease, background 0.2s ease;
  &:hover {
    background: #222;
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  }
`;

export const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  ${primarySurface}
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  ${primarySurface}
`;

export const PrimaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  ${primarySurface}
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const PreviewsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

export const PreviewItem = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
`;

export const PreviewMeta = styled.div`
  padding: 8px;
  display: grid;
  gap: 6px;
`;

export const ProgressBar = styled.div`
  position: relative;
  height: 8px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${p => Math.max(0, Math.min(100, p.$progress))}%;
  background: linear-gradient(90deg, #007bff, #00c2ff);
  transition: width 0.2s ease;
`;

export const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff1f0;
  color: #a8071a;
  border: 1px solid #ffccc7;
`;


