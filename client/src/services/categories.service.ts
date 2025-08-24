import { apiClient } from './api';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryTreeNode,
  CategoryTreeUtils,
} from '@/types/models/category.model';

export class CategoriesService {
  // Получить все категории
  static async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  }

  // Получить только корневые категории (без родителей)
  static async getRootCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories/root');
    return response.data;
  }

  // Получить дерево категорий (иерархическая структура)
  static async getCategoryTree(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories/tree');
    return response.data;
  }

  // Построить дерево из плоского списка категорий
  static async buildCategoryTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.getAllCategories();
    return CategoryTreeUtils.buildTree(categories);
  }

  // Получить все дочерние категории для указанной категории
  static async getCategoryDescendants(parentId: number): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(`/categories/${parentId}/descendants`);
    return response.data;
  }

  // Получить категорию по ID
  static async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  }

  // Получить хлебные крошки для категории
  static async getCategoryBreadcrumbs(categoryId: number): Promise<CategoryTreeNode[]> {
    const tree = await this.buildCategoryTree();
    return CategoryTreeUtils.getBreadcrumbs(tree, categoryId);
  }

  // Найти категорию в дереве по ID
  static async findCategoryInTree(categoryId: number): Promise<CategoryTreeNode | null> {
    const tree = await this.buildCategoryTree();
    return CategoryTreeUtils.findById(tree, categoryId);
  }

  // Получить все дочерние категории (включая вложенные) из дерева
  static async getAllDescendantsFromTree(categoryId: number): Promise<CategoryTreeNode[]> {
    const category = await this.findCategoryInTree(categoryId);
    if (!category) return [];
    return CategoryTreeUtils.getAllChildren(category);
  }

  // Создать категорию (требует авторизации)
  static async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  }

  // Обновить категорию (требует авторизации)
  static async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  }

  // Удалить категорию (требует авторизации)
  static async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }

  // Переместить категорию в другую родительскую категорию
  static async moveCategory(categoryId: number, newParentId: number | null): Promise<Category> {
    return this.updateCategory(categoryId, { parentId: newParentId });
  }

  // Проверить, может ли категория быть перемещена в указанного родителя
  // (предотвращает циклические зависимости)
  static async canMoveCategory(categoryId: number, newParentId: number | null): Promise<boolean> {
    if (newParentId === null) return true;
    if (categoryId === newParentId) return false; // Категория не может быть своим родителем

    try {
      const descendants = await this.getAllDescendantsFromTree(categoryId);
      return !descendants.some(desc => desc.id === newParentId);
    } catch (error) {
      console.error('Error checking category move:', error);
      return false;
    }
  }
}

export default CategoriesService;
