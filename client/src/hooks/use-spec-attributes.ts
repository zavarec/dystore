import { useEffect } from 'react';

import { selectSpecAttributes } from '@/store/slices/products-slice/products.selectors';
import { fetchSpecAttributes } from '@/store/slices/products-slice/products.thunks';

import { useAppDispatch, useAppSelector } from './redux';

export type SpecAttr = { id: number; label: string; unit?: string | null; group?: string | null };

export const useSpecAttributes = () => {
  const specAttributes = useAppSelector(selectSpecAttributes);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSpecAttributes());
  }, []);
  return { attributes: specAttributes };
};
