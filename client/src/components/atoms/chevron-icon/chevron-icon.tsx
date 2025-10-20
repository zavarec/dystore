type Props = {
  open?: boolean;
  size?: number; // размер иконки
  stroke?: number; // толщина линий
  color?: string;
  className?: string;
};

export const ChevronIcon: React.FC<Props> = ({
  open = false,
  size = 28,
  stroke = 4,
  color = '#fff',
  className,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={{ transition: 'transform .2s ease', transform: `rotate(${open ? 180 : 0}deg)` }}
      aria-hidden
    >
      {/* Линия «галочки»:  (4,10) -> (14,20) -> (24,10) */}
      <polyline
        points="4,10 14,20 24,10"
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
