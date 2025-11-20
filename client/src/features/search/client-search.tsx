import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { SearchInput } from '@/components/atoms/header/header.style';
import styled from '@emotion/styled';
import ProductsService from '@/services/products.service';

import {
  ClientSearchWrapper,
  EmptyState,
  ResultItem,
  ResultsDropdown,
  SearchIconWrap,
} from './client-search.style';

type SearchDocument = {
  id: string | number;
  title: string;
  slug: string;
  brand?: string | undefined;
  tags?: string[] | undefined;
  price?: number | undefined;
};

type MiniSearchType = {
  addAll: (docs: SearchDocument[]) => void;
  search: (q: string, opts?: Record<string, unknown>) => Array<{ id: SearchDocument['id'] }>;
};

export const ClientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [docs, setDocs] = useState<SearchDocument[]>([]);
  const [mini, setMini] = useState<MiniSearchType | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current) return;
      if (!inputRef.current.parentElement) return;
      if (!inputRef.current.parentElement.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const ensureIndexLoaded = async () => {
    if (!mini) {
      const [{ default: MiniSearch }, products] = await Promise.all([
        import('minisearch'),
        ProductsService.getAllProducts().catch(() => []),
      ]);

      const data: SearchDocument[] = (products || [])
        .filter(p => Boolean(p?.slug) && Boolean(p?.name))
        .map(p => ({
          id: p.id,
          title: p.name,
          slug: p.slug as string,
          brand: (p as unknown as { brand?: string })?.brand,
          tags: (p as unknown as { tags?: string[] })?.tags,
          price: p.price,
        }));
      const instance: MiniSearchType = new MiniSearch({
        fields: ['title', 'brand', 'tags'],
        storeFields: ['title', 'brand', 'slug', 'price'],
        searchOptions: { prefix: true, fuzzy: 0.2 },
      }) as unknown as MiniSearchType;
      instance.addAll(data);
      setDocs(data);
      setMini(instance);
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    if (mini) {
      const foundIds = mini.search(query).map(r => r.id);
      const foundSet = new Set(foundIds);
      return docs.filter(d => foundSet.has(d.id)).slice(0, 8);
    }
    const q = query.toLowerCase();
    return docs
      .filter(d => {
        const text = [d.title, d.brand, ...(d.tags || [])].filter(Boolean).join(' ').toLowerCase();
        return text.includes(q);
      })
      .slice(0, 8);
  }, [query, mini, docs]);

  const onFocus = async () => {
    setIsOpen(true);
    await ensureIndexLoaded();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(`/product/${results[0]?.slug}`);
      setIsOpen(false);
    }
  };

  return (
    <ClientSearchWrapper>
      <form onSubmit={onSubmit}>
        <StyledSearchInput
          ref={inputRef}
          type="text"
          placeholder="Поиск товаров..."
          value={query}
          onFocus={onFocus}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </form>
      <SearchIconWrap aria-hidden="true">
        <svg viewBox="0 0 18 18" width="18" height="18" focusable="false">
          <path
            d="M14.436 13.1355C15.5385 11.754 16.2 10.0035 16.2 8.1C16.2 3.627 12.573 0 8.1 0C3.627 0 0 3.627 0 8.1C0 12.573 3.627 16.2 8.1 16.2C10.0035 16.2 11.754 15.5385 13.1355 14.436L16.6995 18L18 16.6995L14.436 13.1355ZM8.1 14.4C4.626 14.4 1.8 11.574 1.8 8.1C1.8 4.626 4.626 1.8 8.1 1.8C11.574 1.8 14.4 4.626 14.4 8.1C14.4 11.574 11.574 14.4 8.1 14.4Z"
            fill="currentColor"
            color="black"
          />
        </svg>
      </SearchIconWrap>

      {isOpen && (query ? results.length > 0 : true) && (
        <ResultsDropdown>
          {query && results.length > 0 ? (
            results.map(item => (
              <Link key={item.id} href={`/product/${item.slug}`} passHref legacyBehavior>
                <ResultItem>
                  <span className="title">{item.title}</span>
                  {typeof item.price === 'number' && (
                    <span className="price">{item.price.toLocaleString('ru-RU')} ₽</span>
                  )}
                </ResultItem>
              </Link>
            ))
          ) : (
            <EmptyState>Начните вводить запрос…</EmptyState>
          )}
        </ResultsDropdown>
      )}
    </ClientSearchWrapper>
  );
};

const StyledSearchInput = styled(SearchInput)`
  padding-left: 36px;
`;
