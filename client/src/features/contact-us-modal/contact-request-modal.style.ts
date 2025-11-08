import Link from 'next/link';

import styled from '@emotion/styled';

import { media } from '@/styles/breakpoints';
import { tokens } from '@/styles/shared';

export const ContactModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  /* max-width: 780px; */
`;

export const ContactForm = styled.form`
  background: ${tokens.colors.semantic.background.secondary};
  padding: 36px;
  border: 1px solid ${tokens.colors.semantic.border.default};
  display: grid;
  gap: 24px;
  position: relative;

  ${media.down('tablet')} {
    padding: 24px;
  }
`;

export const FormHeader = styled.div`
  display: grid;
  gap: 12px;
`;

export const FormTitle = styled.h2`
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
  color: ${tokens.colors.semantic.text.primary};

  ${media.down('mobile')} {
    font-size: 22px;
  }
`;

export const FormSubtitle = styled.p`
  color: ${tokens.colors.semantic.text.secondary};
  max-width: 520px;
  line-height: 1.6;
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 12px;
`;

export const FieldLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${tokens.colors.semantic.text.primary};
`;

export const RequiredMark = styled.span`
  color: ${tokens.colors.semantic.state.danger};
`;

export const TextInput = styled.input`
  height: 56px;
  border-radius: 2px;
  border: 1px solid ${tokens.colors.semantic.border.input};
  padding: 0 18px;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${tokens.colors.components.button.primary.hover};
    box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
  }
`;

export const TextArea = styled.textarea`
  border-radius: 2px;
  border: 1px solid ${tokens.colors.semantic.border.default};
  padding: 16px 18px;
  font-size: 1rem;
  min-height: 140px;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${tokens.colors.components.button.primary.hover};
    box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
  }
`;

export const HelperLink = styled(Link)`
  color: ${tokens.colors.semantic.text.muted};
  font-size: 0.9rem;
  text-decoration: underline;
  width: fit-content;

  &:hover {
    color: ${tokens.colors.semantic.text.primary};
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  ${media.down('mobile')} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 12px;
  border: none;
  border-radius: 2px;
  background: ${tokens.colors.components.button.primary.bg};
  color: ${tokens.colors.components.button.primary.text};
  font-size: 1rem;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    background: ${tokens.colors.components.button.primary.hover};
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const LegalNote = styled.p`
  font-size: 0.8rem;
  color: ${tokens.colors.semantic.text.muted};
  line-height: 1.4;
`;

export const CardsGrid = styled.div`
  display: grid;
  /* grid-template-columns: repeat(2, minmax(0, 1fr)); */
  gap: 18px;

  ${media.down('tablet')} {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  border: 1px solid ${tokens.colors.semantic.border.default};
  border-radius: 2px;
  padding: 24px;
  margin: 20px;
  background: ${tokens.colors.semantic.background.primary};
  display: grid;
  gap: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${tokens.colors.semantic.text.primary};
`;

export const CardDescription = styled.p`
  font-size: 0.95rem;
  color: ${tokens.colors.semantic.text.secondary};
  line-height: 1.6;
`;

export const CardLinks = styled.ul`
  display: grid;
  gap: 6px;
`;

export const CardLink = styled(Link)`
  font-size: 0.95rem;
  text-decoration: underline;
  color: ${tokens.colors.semantic.text.primary};

  &:hover {
    color: ${tokens.colors.components.button.primary.hover};
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 6px;
  font-weight: 500;
`;
