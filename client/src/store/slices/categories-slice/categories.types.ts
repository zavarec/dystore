import { LoadingState } from '@/types/common';
import { Category } from '@/types/models/category.model';

export interface CategoriesState extends LoadingState {
  categories: Category[];
  rootCategories: Category[];
  //   subCategories: Category[];
  currentCategory: Category | null;

  isRootCategoriesLoading: boolean;
}
