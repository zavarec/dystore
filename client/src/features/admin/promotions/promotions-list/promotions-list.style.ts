import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`;

export const Sub = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

export const SlotSection = styled.section<{ $sortMode?: boolean; $isHero?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  ${p =>
    p.$sortMode &&
    `
    border: 2px dashed ${p.$isHero ? '#9ca3af' : '#3b82f6'};
    border-radius: 12px;
    padding: 16px;
    background: ${p.$isHero ? 'rgba(156, 163, 175, 0.02)' : 'rgba(59, 130, 246, 0.02)'};
    transition: all 0.2s ease;
    ${!p.$isHero ? 'cursor: grab;' : 'cursor: not-allowed;'}
    
    ${
      !p.$isHero &&
      `
      &:active {
        cursor: grabbing;
      }
      
      &:hover {
        border-color: #2563eb;
        background: rgba(59, 130, 246, 0.05);
      }
    `
    }
  `}
`;

export const SlotHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SlotBadge = styled.span`
  display: inline-block;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: #f1f3f5;
  color: #111827;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const Count = styled.span`
  color: #6c757d;
  font-size: 13px;
`;

export const Empty = styled.div`
  padding: 16px;
  background: #fafafa;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #6c757d;
  text-align: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
  }
`;

export const Thumb = styled.div`
  height: 140px;
  background: #f3f4f6 center/cover no-repeat;
  position: relative;
`;

export const VideoBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 999px;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Status = styled.span<{ $on: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => (p.$on ? '#22c55e' : '#9ca3af')};
  box-shadow: 0 0 0 3px ${p => (p.$on ? 'rgba(34,197,94,.18)' : 'rgba(156,163,175,.18)')};
`;

export const CardTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  color: #6b7280;
  font-size: 12px;
`;

export const MetaItem = styled.span`
  white-space: nowrap;
`;

export const Actions = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;
