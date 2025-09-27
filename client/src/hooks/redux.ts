import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '@/store';

import type { TypedUseSelectorHook } from 'react-redux';

// Типизированные хуки Redux - потому что TypeScript должен знать всё
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
