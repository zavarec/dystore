import { Category } from '@/types/models/category.model';

export const mockedCategories: Category[] = [
  {
    id: 1,
    name: 'Пылесосы',
    slug: 'Пылесосы',
    children: [
      {
        id: 2,
        name: 'vacum cleaners',
        slug: 'vacumCleaners',
      },
    ],
  },
  {
    id: 3,
    name: 'Пылесосы',
    slug: 'Пылесосы',
    children: [
      {
        id: 4,
        name: 'vacum cleaners',
        slug: 'vacumCleaners',
      },
    ],
  },
  {
    id: 5,
    name: 'Пылесосы',
    slug: 'Пылесосы',
    children: [
      {
        id: 6,
        name: 'vacum cleaners',
        slug: 'vacumCleaners',
      },
    ],
  },
];
