import React from 'react';
import {
  Skeleton,
  SkeletonText,
  SkeletonTitle,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonCard,
} from '@/components/atoms/skeleton';
import {
  DemoSection,
  DemoContainer,
  DemoTitle,
  DemoGrid,
  DemoCard,
  DemoCardContent,
  ProductSkeletonCard,
  CategorySkeletonGroup,
} from './skeleton-demo.style';

export const SkeletonDemo: React.FC = () => {
  return (
    <DemoSection>
      <DemoContainer>
        <DemoTitle>Демонстрация компонентов скелетона</DemoTitle>

        <DemoGrid>
          {/* Базовые скелетоны */}
          <DemoCard>
            <h3>Базовые компоненты</h3>
            <DemoCardContent>
              <div style={{ marginBottom: '16px' }}>
                <p>Заголовок:</p>
                <SkeletonTitle width="80%" />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p>Текст:</p>
                <SkeletonText width="100%" />
                <SkeletonText width="75%" />
                <SkeletonText width="60%" />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p>Кнопка:</p>
                <SkeletonButton width={120} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p>Аватар:</p>
                <SkeletonAvatar size={50} />
              </div>
            </DemoCardContent>
          </DemoCard>

          {/* Скелетон карточки товара */}
          <DemoCard>
            <h3>Карточка товара</h3>
            <ProductSkeletonCard>
              <SkeletonCard width={250} height={200} />
              <div style={{ padding: '16px' }}>
                <SkeletonTitle width="80%" />
                <div style={{ margin: '12px 0' }}>
                  <SkeletonText width="100%" />
                  <SkeletonText width="70%" />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Skeleton width={100} height={24} variant="rounded" />
                </div>
                <SkeletonButton width="100%" />
              </div>
            </ProductSkeletonCard>
          </DemoCard>

          {/* Группа скелетонов категорий */}
          <DemoCard>
            <h3>Карусель категорий</h3>
            <CategorySkeletonGroup>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} width={150} height={100} variant="rounded" />
              ))}
            </CategorySkeletonGroup>
          </DemoCard>

          {/* Пользовательские размеры */}
          <DemoCard>
            <h3>Пользовательские варианты</h3>
            <DemoCardContent>
              <div style={{ marginBottom: '16px' }}>
                <p>Прямоугольный:</p>
                <Skeleton width={200} height={50} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p>Круглый:</p>
                <Skeleton width={80} height={80} variant="circular" />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p>С закругленными углами:</p>
                <Skeleton width={180} height={60} variant="rounded" />
              </div>
            </DemoCardContent>
          </DemoCard>
        </DemoGrid>
      </DemoContainer>
    </DemoSection>
  );
};
