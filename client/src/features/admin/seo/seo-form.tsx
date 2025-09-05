import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { SeoPageType, UpsertSeoMetaRequest } from '@/types/models/seo-meta.model';
import {
  deleteSeoMeta,
  listSeoMeta,
  upsertSeoMeta,
} from '@/store/slices/seo-meta-slice/seo.thunks';
import {
  selectSeoMetaIsLoading,
  selectSeoMetaList,
} from '@/store/slices/seo-meta-slice/seo.selectors';

// Если у тебя уже есть эти стили — они подхватятся.
// Иначе см. fallback ниже.
import { Input, Row, Select, Textarea, Wrap } from './seo-form.style';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { Button } from '@/components/atoms/button';

const PAGE_TYPES: SeoPageType[] = ['CATEGORY', 'PRODUCT', 'LANDING', 'STATIC'];
const LOCALES = ['ru', 'en'];

const titleOk = (s: string) => s.length >= 30 && s.length <= 65;
const descOk = (s: string) => s.length >= 70 && s.length <= 160;

const templates = {
  title: (name = '{{name}}') => `Купить ${name} — цена, отзывы, доставка | DysonGroup`,
  description: (name = '{{name}}') =>
    `${name} — в наличии. Официальная гарантия, быстрая доставка по РФ. Цены, отзывы и характеристики на сайте DysonGroup.`,
};

export default function SeoForm() {
  const dispatch = useAppDispatch();
  const seoMetaList = useAppSelector(selectSeoMetaList);
  const loading = useAppSelector(selectSeoMetaIsLoading);

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [form, setForm] = useState<UpsertSeoMetaRequest>({
    pageType: 'CATEGORY',
    entityId: '',
    locale: 'ru',
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    robots: 'index,follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    // structuredData: undefined,
    // hreflang: undefined,
  });

  const clean = <T extends object>(obj: T) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;

  // Текстовые состояния для JSON
  const [structuredDataText, setStructuredDataText] = useState('');
  const [hreflangText, setHreflangText] = useState('');
  const [jsonErrors, setJsonErrors] = useState<{ structuredData?: string; hreflang?: string }>({});

  useEffect(() => {
    dispatch(listSeoMeta(undefined));
  }, [dispatch]);

  // хоткей Cmd/Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
      if (isSave) {
        e.preventDefault();
        void handleSubmit();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [form, jsonErrors]);

  const canSubmit = useMemo(() => {
    return (
      Boolean(form.entityId && form.pageType && form.locale) &&
      !jsonErrors.structuredData &&
      !jsonErrors.hreflang
    );
  }, [form.entityId, form.pageType, form.locale, jsonErrors]);

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as any;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleJsonChange = useCallback((name: 'structuredData' | 'hreflang', value: string) => {
    if (name === 'structuredData') setStructuredDataText(value);
    if (name === 'hreflang') setHreflangText(value);
    setJsonErrors(prev => ({ ...prev, [name]: undefined }));

    if (!value.trim()) {
      setForm(prev => ({ ...prev, [name]: undefined as any }));
      return;
    }
    try {
      const parsed = value.trim() ? JSON.parse(value) : undefined;
      setForm(prev => ({ ...prev, [name]: parsed })); // parsed может быть undefined — и это ок, т.к. потом clean() уберёт ключ
      setJsonErrors(p => ({ ...p, [name]: undefined }));
    } catch {
      setJsonErrors(prev => ({ ...prev, [name]: 'Некорректный JSON' }));
    }
  }, []);

  const applyTemplate = (kind: 'title' | 'description') => {
    if (kind === 'title') setForm(s => ({ ...s, title: templates.title() }));
    if (kind === 'description') setForm(s => ({ ...s, description: templates.description() }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const cleanedForm = clean(form);
    await dispatch(upsertSeoMeta(cleanedForm) as any);
    await dispatch(
      listSeoMeta({
        pageType: form.pageType,
        entityId: form.entityId,
        locale: form.locale ?? 'ru',
      }) as any,
    );
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteSeoMeta(id) as any);
    await dispatch(listSeoMeta(undefined) as any);
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Wrap
        onSubmit={e => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {/* Основные поля */}
        <Row>
          Тип страницы
          <Select name="pageType" value={form.pageType} onChange={handleBasicChange}>
            {PAGE_TYPES.map(pt => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </Select>
        </Row>

        <Row>
          Идентификатор (slug/id)
          <Input
            name="entityId"
            value={form.entityId}
            onChange={handleBasicChange}
            placeholder="vacuum-cleaners / 123"
          />
        </Row>

        <Row>
          Локаль
          <Select name="locale" value={form.locale} onChange={handleBasicChange}>
            {LOCALES.map(l => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Row>

        <Row>
          Title
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              name="title"
              value={form.title}
              onChange={handleBasicChange}
              placeholder="Купить {{name}} — цена, отзывы…"
              style={{ flex: 1 }}
            />
            <Button type="button" onClick={() => applyTemplate('title')} title="Подставить шаблон">
              Шаблон
            </Button>
          </div>
          <small style={{ color: titleOk(form.title ?? '') ? '#059669' : '#6b7280' }}>
            {form.title?.length || 0} символов (реком. 30–65)
          </small>
        </Row>

        <Row>
          Description
          <div style={{ display: 'grid', gap: 8 }}>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleBasicChange}
              placeholder="Краткое описание страницы (70–160 симв.)"
              rows={4}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="button"
                onClick={() => applyTemplate('description')}
                title="Подставить шаблон"
              >
                Шаблон
              </Button>
            </div>
            <small style={{ color: descOk(form.description ?? '') ? '#059669' : '#6b7280' }}>
              {form.description?.length || 0} символов (реком. 70–160)
            </small>
          </div>
        </Row>

        <Row>
          Canonical URL
          <Input
            name="canonical"
            value={form.canonical}
            onChange={handleBasicChange}
            placeholder="https://dyson-group.ru/category/..."
          />
        </Row>

        <Row>
          Robots
          <Input
            name="robots"
            value={form.robots}
            onChange={handleBasicChange}
            placeholder="index,follow"
          />
        </Row>

        {/* Превью сниппета */}
        <div
          style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fff' }}
        >
          <div
            style={{
              color: '#1a0dab',
              fontSize: 18,
              lineHeight: 1.3,
              fontWeight: 500,
              marginBottom: 2,
            }}
          >
            {form.title || 'Пример заголовка — DysonGroup'}
          </div>
          <div style={{ color: '#006621', fontSize: 13, marginBottom: 6 }}>
            {form.canonical || 'https://dyson-group.ru/example'}
          </div>
          <div style={{ color: '#4b5563', fontSize: 13 }}>
            {form.description ||
              'Описание страницы появится здесь. Длина 70–160 символов — оптимальна для сниппета.'}
          </div>
        </div>

        {/* Тогглер расширенных */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="button" variant={ButtonVariant.GHOST} onClick={() => setAdvancedOpen(v => !v)}>
            {advancedOpen ? 'Скрыть расширенные' : 'Показать расширенные'}
          </Button>
        </div>

        {/* Расширенные поля */}
        {advancedOpen && (
          <>
            <Row>
              OG Title
              <Input
                name="ogTitle"
                value={form.ogTitle}
                onChange={handleBasicChange}
                placeholder="Если пусто — возьмём Title"
              />
            </Row>
            <Row>
              OG Description
              <Textarea
                name="ogDescription"
                value={form.ogDescription}
                onChange={handleBasicChange}
                rows={3}
              />
            </Row>
            <Row>
              OG Image (URL)
              <Input
                name="ogImage"
                value={form.ogImage}
                onChange={handleBasicChange}
                placeholder="https://..."
              />
            </Row>
            <Row>
              Twitter Card
              <Select name="twitterCard" value={form.twitterCard} onChange={handleBasicChange}>
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
              </Select>
            </Row>

            <Row>
              Structured Data (JSON-LD)
              <Textarea
                value={structuredDataText}
                onChange={e => handleJsonChange('structuredData', e.target.value)}
                placeholder='{"@context":"https://schema.org","@type":"Product"}'
                rows={6}
              />
              {jsonErrors.structuredData && (
                <small style={{ color: '#b91c1c' }}>{jsonErrors.structuredData}</small>
              )}
            </Row>

            <Row>
              Hreflang (JSON)
              <Textarea
                value={hreflangText}
                onChange={e => handleJsonChange('hreflang', e.target.value)}
                placeholder='[{"hrefLang":"en","href":"https://.../en"}, {"hrefLang":"ru","href":"https://.../ru"}]'
                rows={4}
              />
              {jsonErrors.hreflang && (
                <small style={{ color: '#b91c1c' }}>{jsonErrors.hreflang}</small>
              )}
            </Row>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start' }}>
          <Button type="submit" disabled={!canSubmit || loading}>
            {loading ? 'Сохраняем…' : 'Сохранить (Ctrl/Cmd+S)'}
          </Button>
        </div>
      </Wrap>

      {/* Список/табличка существующих записей (короткий вывод) */}
      {seoMetaList?.length > 0 && (
        <div style={{ display: 'grid', gap: 8 }}>
          <h4 style={{ margin: 0 }}>Существующие SEO-записи</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {seoMetaList.map(item => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 10,
                  background: '#fff',
                  display: 'grid',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>
                    {item.pageType} · {item.entityId} · {item.locale}
                  </strong>
                  <Button variant={ButtonVariant.GHOST} onClick={() => handleDelete(item.id)}>
                    Удалить
                  </Button>
                </div>
                <div style={{ fontSize: 13, color: '#374151' }}>
                  {item.title || <em style={{ color: '#9ca3af' }}>без title</em>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {item.description?.slice(0, 120) || (
                    <em style={{ color: '#9ca3af' }}>без description</em>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
