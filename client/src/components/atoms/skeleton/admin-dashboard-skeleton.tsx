import React from 'react';
import { Skeleton, SkeletonText, SkeletonTitle } from './skeleton';

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Skeleton width={40} height={40} variant="rounded" />
              <div style={{ flex: 1 }}>
                <SkeletonText width="60%" />
                <Skeleton width={120} height={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <SkeletonTitle width="30%" />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '8px 12px' }}>
                  <Skeleton width={80} height={14} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: 5 }).map((_, col) => (
                  <td key={col} style={{ padding: '12px 12px' }}>
                    {col === 1 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Skeleton width={40} height={40} variant="rounded" />
                        <Skeleton width={160} height={16} />
                      </div>
                    ) : (
                      <Skeleton width={col === 0 ? 30 : 120} height={16} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
