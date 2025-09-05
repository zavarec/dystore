import React from 'react';
import { Skeleton } from './skeleton';

interface TableRowSkeletonProps {
  columns?: number;
  withAvatar?: boolean;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  columns = 8,
  withAvatar = true,
}) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} style={{ padding: '12px 16px' }}>
          {withAvatar && idx === 1 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Skeleton width={48} height={48} variant="rounded" />
              <Skeleton width={160} height={16} />
            </div>
          ) : (
            <Skeleton width={idx === 0 ? 32 : 120} height={16} />
          )}
        </td>
      ))}
    </tr>
  );
};



