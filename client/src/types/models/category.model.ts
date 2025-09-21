import { Product } from './product.model';

// Типы для API бэкенда
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  parentId?: number | null;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

// Типы для работы с деревом категорий
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  level: number; // Уровень вложенности
  path: number[]; // Путь от корня (массив id)
}

// DTO для создания и обновления
export interface CreateCategoryDto {
  name: string;
  description?: string;
  slug: string;
  imageId?: string;
  parentId?: number | null;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  slug?: string;
  imageId?: string;
  parentId?: number | null;
}

// Утилиты для работы с деревом категорий
export class CategoryTreeUtils {
  /**
   * Строит дерево категорий из плоского массива
   */
  static buildTree(categories: Category[]): CategoryTreeNode[] {
    const categoryMap = new Map<number, CategoryTreeNode>();
    const rootCategories: CategoryTreeNode[] = [];

    // Создаем мапу всех категорий
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
        level: 0,
        path: [],
      });
    });

    // Строим дерево
    categories.forEach(category => {
      const node = categoryMap.get(category.id)!;

      if (category.parentId === null || category.parentId === undefined) {
        // Корневая категория
        node.level = 0;
        node.path = [category.id];
        rootCategories.push(node);
      } else {
        // Дочерняя категория
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          node.level = parent.level + 1;
          node.path = [...parent.path, category.id];
          parent.children.push(node);
        }
      }
    });

    return rootCategories;
  }

  /**
   * Получает все дочерние категории (включая вложенные)
   */
  static getAllChildren(category: CategoryTreeNode): CategoryTreeNode[] {
    const children: CategoryTreeNode[] = [];

    const collect = (node: CategoryTreeNode) => {
      node.children.forEach(child => {
        children.push(child);
        collect(child);
      });
    };

    collect(category);
    return children;
  }

  /**
   * Находит категорию по ID в дереве
   */
  static findById(tree: CategoryTreeNode[], id: number): CategoryTreeNode | null {
    for (const node of tree) {
      if (node.id === id) {
        return node;
      }
      const found = this.findById(node.children, id);
      if (found) {
        return found;
      }
    }
    return null;
  }

  /**
   * Получает хлебные крошки (путь от корня до категории)
   */
  static getBreadcrumbs(tree: CategoryTreeNode[], categoryId: number): CategoryTreeNode[] {
    const category = this.findById(tree, categoryId);
    if (!category) return [];

    const breadcrumbs: CategoryTreeNode[] = [];

    // Идем по пути от корня
    category.path.forEach(id => {
      const node = this.findById(tree, id);
      if (node) {
        breadcrumbs.push(node);
      }
    });

    return breadcrumbs;
  }

  /**
   * Плоский список всех категорий из дерева
   */
  static flatten(tree: CategoryTreeNode[]): CategoryTreeNode[] {
    const result: CategoryTreeNode[] = [];

    const traverse = (nodes: CategoryTreeNode[]) => {
      nodes.forEach(node => {
        result.push(node);
        traverse(node.children);
      });
    };

    traverse(tree);
    return result;
  }
}
