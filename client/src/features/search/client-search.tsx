import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { SearchInput } from '@/components/atoms/header/header.style';
import ProductsService from '@/services/products.service';

import {
  ClientSearchWrapper,
  EmptyState,
  ResultItem,
  ResultsDropdown,
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
        <SearchInput
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
