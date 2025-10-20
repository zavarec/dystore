import styled from '@emotion/styled';

import type { BaseItem } from '@/components/atoms/dropdown/dropdown';
import Dropdown from '@/components/atoms/dropdown/dropdown';

import type { PolicyKey } from '../policies/policies-layour';

import { POLICY_PAGES } from '../policies/policies-layour';
import { ChevronIcon } from '@/components/atoms/chevron-icon/chevron-icon';

export const PoliciesDropdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0;
`;

export interface PoliciesDropdownProps {
  items: BaseItem[];
  currentKey?: string | number;
  onSelect?: (key: string | number) => void;
}

export const PoliciesDropdown: React.FC<PoliciesDropdownProps> = ({ currentKey, onSelect }) => {
  const items = POLICY_PAGES.map(p => ({
    key: p.key,
    label: p.label,
    href: p.href,
  }));

  return (
    <PoliciesDropdownContainer>
      <Dropdown
        items={items}
        align="start"
        closeOnSelect
        fullWidthMenu
        fullWidthTrigger
        hasBorder={false}
        renderTrigger={({ open, props }) => (
          <div
            {...props}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {POLICY_PAGES.find(p => p.key === currentKey)?.label || 'Раздел'}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ChevronIcon open={open} size={28} stroke={2} color="#fff" />
            </div>
          </div>
        )}
        onSelect={key => onSelect?.(key as PolicyKey)}
      />
    </PoliciesDropdownContainer>
  );
};
