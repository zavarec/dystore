import styled from '@emotion/styled';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

export const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 440px;
  width: 100%;
  overflow: hidden;
`;

export const LoginHeader = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 32px;
  text-align: center;
`;

export const LoginTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

export const LoginSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
`;
