import { Fragment } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  CrumbLinkLight,
  CrumbSepLight,
  PoliciesBreadcrumbsBar,
  PoliciesBreadcrumbsInner,
  PoliciesTopBar,
  PoliciesTopInner,
} from './policies.style';
import { AboutCompanyPageWrapper } from '../about-company/about-company.style';
import { PoliciesDropdown } from '../policies-dropdown/policies-dropdown';

export type PolicyKey = 'delivery' | 'returns' | 'warranty' | 'environment' | 'about';

export const POLICY_PAGES: Array<{ key: PolicyKey; label: string; href: string }> = [
  { key: 'about', label: 'О компании', href: '/about' },
  { key: 'delivery', label: 'Доставка и оплата', href: '/delivery' },
  { key: 'returns', label: 'Возврат товара', href: '/returns' },
  { key: 'warranty', label: 'Гарантийное обслуживание', href: '/warranty' },
  { key: 'environment', label: 'Экологическая политика', href: '/environment' },
];

export const PoliciesLayout: React.FC<{
  current: PolicyKey;
  title: string;
  breadcrumbsPrefix?: Array<{ href: string; label: string }>; // то, что до раздела "Политики"
  children: React.ReactNode;
}> = ({
  current,
  title,
  breadcrumbsPrefix = [
    { href: '/', label: 'Главная' },
    { href: '/inside', label: 'Inside Dyson' },
    { href: '/community', label: 'Community' },
    { href: '/sustainability', label: 'Sustainability' },
  ],
  children,
}) => {
  const router = useRouter();
  return (
    <AboutCompanyPageWrapper>
      {/* Выпадающий заголовок */}
      <PoliciesTopBar>
        <PoliciesTopInner>
          <PoliciesDropdown
            items={POLICY_PAGES.map(p => ({ key: p.key, label: p.label, href: p.href }))}
            currentKey={current}
            onSelect={key => {
              const target = POLICY_PAGES.find(p => p.key === key);
              if (target) router.push(target.href);
            }}
          />
        </PoliciesTopInner>
      </PoliciesTopBar>
      {/* Контент страницы */}
      <div>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>

      {/* Хлебные крошки */}
      <PoliciesBreadcrumbsBar aria-label="Хлебные крошки">
        <PoliciesBreadcrumbsInner>
          {breadcrumbsPrefix.map((b, i) => (
            <Fragment key={b.href + i}>
              {i > 0 && <CrumbSepLight>/</CrumbSepLight>}
              <Link href={b.href} passHref legacyBehavior>
                <CrumbLinkLight>{b.label}</CrumbLinkLight>
              </Link>
            </Fragment>
          ))}
          <CrumbSepLight>/</CrumbSepLight>
          <span>{POLICY_PAGES.find(p => p.key === current)?.label || title}</span>
        </PoliciesBreadcrumbsInner>
      </PoliciesBreadcrumbsBar>
    </AboutCompanyPageWrapper>
  );
};
