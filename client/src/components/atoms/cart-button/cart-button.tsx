import React, { useEffect, useState } from 'react';
import { CartButtonContainer, CartBadge } from './cart-button.style';

interface CartButtonProps {
  count?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ count = 0, onClick, className }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeCount = mounted ? count : 0;

  return (
    <CartButtonContainer onClick={onClick} className={className} aria-label="Корзина">
      <svg
        className="icon icon--minibasket"
        role="img"
        aria-label="Click to view the basket"
        viewBox="0 0 48 48"
        width={28}
        height={28}
        style={{ display: 'block' }}
      >
        <path d="M36 16c0-6.6-5.4-12-12-12S12 9.4 12 16H4l7.1 26h25.7L44 16h-8zM24 7.9c4.5 0 8.1 3.7 8.1 8.1H15.9c0-4.5 3.6-8.1 8.1-8.1zM33.8 38H14.2l-5-18h29.5l-4.9 18z"></path>
      </svg>
      <CartBadge suppressHydrationWarning>{safeCount}</CartBadge>
    </CartButtonContainer>
  );
};
