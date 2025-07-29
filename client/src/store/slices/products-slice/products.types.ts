import { LoadingState } from '@/types/common';
import { Product } from '@/types/models/product.model';

export interface ProductsState extends LoadingState {
  items: Product[];
  currentProduct: Product | null;
  categoryProducts: Product[];
  categoryProductsIncludingDescendants: Product[];
  categoryProductsIncludingDescendantsLoading: boolean;
  searchQuery: string;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  categoryLoading: boolean;
  categoryError: string | null;
}
