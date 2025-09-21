import React from 'react';

export function PlacementWrap({ p, children }: { p: any; children: React.ReactNode }) {
  const style: React.CSSProperties = {
    marginTop: p.marginTop ?? 0,
    marginBottom: p.marginBottom ?? 0,
    position: p.zIndex ? 'relative' : undefined,
    zIndex: p.zIndex ?? undefined,
    width: '100%',
  };

  const inner = p.fullWidth ? (
    <div style={{ width: '100%' }}>{children}</div>
  ) : (
    <div>{children}</div>
  );

  return <section style={style}>{inner}</section>;
}
