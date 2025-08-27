import React, { useState } from 'react';
import { CategoryTreeNode } from '@/types/models/category.model';
import {
  TreeContainer,
  TreeNode,
  NodeHeader,
  NodeTitle,
  NodeChildren,
  NodeToggle,
  NodeContent,
  NodeBreadcrumb,
  ProductCount,
} from './category-tree.style';
import { CaretDown, CaretRight, Folder, FolderOpen } from '@phosphor-icons/react';

interface CategoryTreeProps {
  categories: CategoryTreeNode[];
  onCategoryClick?: (category: CategoryTreeNode) => void;
  showProductCount?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface TreeNodeProps {
  node: CategoryTreeNode;
  onCategoryClick: (category: CategoryTreeNode) => void;
  showProductCount: boolean;
  collapsible: boolean;
  defaultCollapsed: boolean;
  level: number;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  onCategoryClick,
  showProductCount,
  collapsible,
  defaultCollapsed,
  level,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const hasChildren = node.children && node.children.length > 0;
  const productCount = node.products?.length || 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collapsible && hasChildren) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleClick = () => {
    onCategoryClick?.(node);
  };

  return (
    <TreeNode level={level}>
      <NodeHeader onClick={handleClick}>
        {collapsible && hasChildren && (
          <NodeToggle onClick={handleToggle}>
            {isCollapsed ? <CaretRight size={16} /> : <CaretDown size={16} />}
          </NodeToggle>
        )}

        {!collapsible && hasChildren && (
          <NodeToggle>{isCollapsed ? <Folder size={16} /> : <FolderOpen size={16} />}</NodeToggle>
        )}

        <NodeContent>
          <NodeTitle hasChildren={hasChildren}>{node.name}</NodeTitle>
          {showProductCount && productCount > 0 && <ProductCount>({productCount})</ProductCount>}
        </NodeContent>
      </NodeHeader>

      {hasChildren && (!collapsible || !isCollapsed) && (
        <NodeChildren>
          {node.children.map(childNode => (
            <TreeNodeComponent
              key={childNode.id}
              node={childNode}
              onCategoryClick={onCategoryClick}
              showProductCount={showProductCount}
              collapsible={collapsible}
              defaultCollapsed={defaultCollapsed}
              level={level + 1}
            />
          ))}
        </NodeChildren>
      )}
    </TreeNode>
  );
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onCategoryClick,
  showProductCount = true,
  collapsible = true,
  defaultCollapsed = false,
}) => {
  return (
    <TreeContainer>
      {categories.map(category => (
        <TreeNodeComponent
          key={category.id}
          node={category}
          onCategoryClick={onCategoryClick ?? (() => {})}
          showProductCount={Boolean(showProductCount)}
          collapsible={Boolean(collapsible)}
          defaultCollapsed={Boolean(defaultCollapsed)}
          level={0}
        />
      ))}
    </TreeContainer>
  );
};

// Дополнительный компонент для хлебных крошек
interface CategoryBreadcrumbProps {
  breadcrumbs: CategoryTreeNode[];
  onCategoryClick?: (category: CategoryTreeNode) => void;
}

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  breadcrumbs,
  onCategoryClick,
}) => {
  return (
    <NodeBreadcrumb>
      {breadcrumbs.map((category, index) => (
        <React.Fragment key={category.id}>
          {index > 0 && <span> / </span>}
          <span
            onClick={() => onCategoryClick?.(category)}
            style={{
              cursor: onCategoryClick ? 'pointer' : 'default',
              color: onCategoryClick ? 'var(--primary-color)' : 'inherit',
            }}
          >
            {category.name}
          </span>
        </React.Fragment>
      ))}
    </NodeBreadcrumb>
  );
};
