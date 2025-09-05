import React from 'react';
import { Skeleton, SkeletonButton, SkeletonText, SkeletonTitle } from './skeleton';

interface ProductCardSkeletonProps {
  index?: number;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = () => {
  return (
    <div
      style={{
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: 350,
        margin: '0 auto',
        borderRadius: 0,
        paddingBottom: 16,
        transition: 'opacity 300ms ease',
      }}
    >
      <div style={{ paddingLeft: 20, borderBottom: '1px solid #e0e0e0' }}>
        <div
          style={{
            height: 300,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton width="100%" height={260} variant="rounded" />
        </div>
        <div style={{ paddingRight: 20, paddingBottom: 12 }}>
          <SkeletonTitle width="80%" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <Skeleton width={80} height={16} />
            <Skeleton width={40} height={16} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '20px 20px 0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
        }}
      >
        <div>
          <div style={{ marginBottom: 8 }}>
            <Skeleton width={160} height={28} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <SkeletonText width={120} />
            <SkeletonText width={80} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0 20px' }}>
        <SkeletonButton width="100%" />
      </div>
    </div>
  );
};



