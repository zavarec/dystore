import styled from '@emotion/styled';

export const PoliciesTopBar = styled.div`
  background: #2d2d2d;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const PoliciesTopInner = styled.div`
  padding: 18px var(--page-gutter);
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PoliciesSelect = styled.select`
  background: transparent;
  color: #fff;
  font-size: clamp(18px, 2.1vw, 22px);
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  outline: none;
  appearance: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.45);
  }
`;

// Хлебные крошки под топбаром
export const PoliciesBreadcrumbsBar = styled.nav`
  background: #3a3a3a;
  color: #fff;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const PoliciesBreadcrumbsInner = styled.div`
  max-width: 1160px;

  padding: 18px var(--page-gutter);

  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const CrumbLinkLight = styled.a`
  color: #fff;
  text-decoration: none;
  opacity: 0.9;
  &:hover {
    text-decoration: underline;
  }
`;

export const CrumbSepLight = styled.span`
  opacity: 0.6;
`;

export const CompanyPolicyTitle = styled.h1`
  font-weight: 300;
  letter-spacing: -0.01em;
  font-size: clamp(18px, 2.1vw, 22px);
  line-height: 3.25rem;
`;
