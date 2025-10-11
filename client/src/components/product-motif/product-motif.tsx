import Image from 'next/image';

import { Wrap } from './product-motif.style';

type Props = {
  src?: string | null;
  alt?: string;
  priority?: boolean;
  className?: string;
};

export const ProductMotif: React.FC<Props> = ({ src, alt = '', className }) => {
  if (!src) return null;
  return (
    <Wrap className={className} aria-hidden={alt ? undefined : true}>
      <Image src={src} alt={alt} width={595} height={78} />
    </Wrap>
  );
};
