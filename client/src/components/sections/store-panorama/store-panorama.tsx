import React from 'react';
import { StorePanoramaContainer } from './store-panorama.style';
import Image from 'next/image';

const STORE_IMAGE_URL =
  'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/categories/Inside-Dyson/store-imagery/gb/Dyson_Trafford_0061_2_3.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840';

export const StorePanorama: React.FC = () => {
  return (
    <StorePanoramaContainer>
      <div style={{ position: 'relative', width: '100%', height: 500 }}>
        <Image
          src={STORE_IMAGE_URL}
          alt="Магазин Dyson"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwMCcgaGVpZ2h0PSc1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMDAnIGhlaWdodD0nNTAwJyBmaWxsPScjMDAwJy8+PC9zdmc+"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </div>
    </StorePanoramaContainer>
  );
};
