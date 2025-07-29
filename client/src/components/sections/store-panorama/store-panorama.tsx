import React from 'react';
import { StorePanoramaContainer, StoreImage } from './store-panorama.style';

const STORE_IMAGE_URL =
  'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/categories/Inside-Dyson/store-imagery/gb/Dyson_Trafford_0061_2_3.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840';

export const StorePanorama: React.FC = () => {
  return (
    <StorePanoramaContainer>
      <StoreImage src={STORE_IMAGE_URL} alt="Магазин Dyson" loading="lazy" />
    </StorePanoramaContainer>
  );
};
