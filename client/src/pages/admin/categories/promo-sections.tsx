import { CategoryPromoBoard } from '@/features/admin/category-promo-sections/board/category-promo-board';
import { withManager } from '@/features/auth/with-manager';

function AdminCategoryPromoSectionsPage() {
  return <CategoryPromoBoard />;
}

export default withManager(AdminCategoryPromoSectionsPage);
