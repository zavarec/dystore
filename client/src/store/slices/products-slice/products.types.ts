import { LoadingState } from '@/types/common';
import { Product } from '@/types/models/product.model';
import type { SpecAttributeDto } from '@/services/spec-attributes.service';

export interface ProductsState extends LoadingState {
  items: Product[];
  currentProduct: Product | null;
  categoryProducts: Product[];
  categoryProductsIncludingDescendants: Product[];
  categoryProductsIncludingDescendantsLoading: boolean;
  specAttributes: SpecAttributeDto[];
  searchQuery: string;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  categoryLoading: boolean;
  categoryError: string | null;
}
