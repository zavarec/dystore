import Image from 'next/image';

import { Wrap } from './product-motif.style';

type Props = {
  src?: string | null;
  alt?: string; // если нужен, иначе оставь пустым
  priority?: boolean; // если используешь next/image
  className?: string;
};

export const ProductMotif: React.FC<Props> = ({ src, alt = '', className }) => {
  if (!src) return null;
  return (
    <Wrap className={className} aria-hidden={alt ? undefined : true}>
      {/* обычный img; можно заменить на <Image> из next/image */}
      <Image src={src} alt={alt} width={595} height={78} />
    </Wrap>
  );
};
