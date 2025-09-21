import { useEffect, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type TemplateKey = 'carousel' | 'productLd' | 'breadcrumbsLd' | 'empty';

const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  carousel: 'Шаблон: carousel',
  productLd: 'Шаблон: productLd',
  breadcrumbsLd: 'Шаблон: breadcrumbsLd',
  empty: 'Пустой шаблон',
};

const TEMPLATES: Record<TemplateKey, any> = {
  empty: {},
  carousel: {
    slides: [
      {
        title: 'Слайд 1',
        subtitle: 'Описание',
        image: 'https://example.com/1.jpg',
        cta: { text: 'Купить', href: '/buy' },
      },
      {
        title: 'Слайд 2',
        subtitle: 'Описание',
        image: 'https://example.com/2.jpg',
        cta: { text: 'Подробнее', href: '/more' },
      },
    ],
    options: { autoplay: true, intervalMs: 5000, arrows: true, dots: true },
  },
  productLd: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Название товара',
    image: ['https://example.com/image.jpg'],
    description: 'Краткое описание',
    sku: 'SKU-001',
    brand: { '@type': 'Brand', name: 'Dyson' },
    offers: {
      '@type': 'Offer',
      url: 'https://site.ru/product/slug',
      priceCurrency: 'RUB',
      price: '49990',
      availability: 'https://schema.org/InStock',
    },
  },
  breadcrumbsLd: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://site.ru' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Категория',
        item: 'https://site.ru/category/slug',
      },
      { '@type': 'ListItem', position: 3, name: 'Товар', item: 'https://site.ru/product/slug' },
    ],
  },
};

const serializeJson = (val: any): string => {
  try {
    return JSON.stringify(val ?? {}, null, 2);
  } catch {
    return '{}';
  }
};

export type JsonEditorCustomTemplate = {
  id: string;
  label: string;
  data: any;
};

export type JsonEditorFieldProps = {
  label?: string;
  value?: any;
  onChange: (v: any) => void;
  height?: number | string;
  storageKey?: string; // для автосохранения черновика
  readOnly?: boolean;
  templates?: TemplateKey[];
  jsonSchema?: any; // опционально: JSON Schema для валидации/подсказок
  customTemplates?: JsonEditorCustomTemplate[];
  onValidationChange?: (hasError: boolean) => void;
};

export const JsonEditorField: React.FC<JsonEditorFieldProps> = ({
  label,
  value,
  onChange,
  height = 380,
  storageKey,
  readOnly = false,
  templates = ['carousel', 'productLd', 'breadcrumbsLd', 'empty'],
  jsonSchema,
  customTemplates,
  onValidationChange,
}) => {
  const [text, setText] = useState<string>(() => serializeJson(value));
  const [error, setError] = useState<string | null>(null);
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const validationStateRef = useRef<boolean>(false);
  const lastPropValueRef = useRef<string>(serializeJson(value));

  const notifyValidation = (hasError: boolean) => {
    if (validationStateRef.current !== hasError) {
      validationStateRef.current = hasError;
      onValidationChange?.(hasError);
    }
  };

  // Подхват черновика из localStorage
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const pretty = serializeJson(parsed);
        setText(pretty);
        onChange(parsed);
        notifyValidation(false);
        lastPropValueRef.current = pretty;
      }
    } catch {}
  }, [storageKey, onChange]);

  // Синхронизация извне
  useEffect(() => {
    const next = serializeJson(value);
    if (lastPropValueRef.current === next) {
      return;
    }

    lastPropValueRef.current = next;
    setText(next);
    setError(null);
    notifyValidation(false);
  }, [value]);

  const applyTemplate = (tpl: any) => {
    const pretty = serializeJson(tpl);
    setText(pretty);
    onChange(tpl);
    if (storageKey) localStorage.setItem(storageKey, pretty);
    setError(null);
    notifyValidation(false);
    lastPropValueRef.current = pretty;
  };

  const onTextChange = (val?: string) => {
    if (val === undefined) {
      return;
    }
    const next = val;
    setText(next);
    if (storageKey) localStorage.setItem(storageKey, next);
    try {
      const parsed = JSON.parse(next || '{}');
      setError(null);
      onChange(parsed);
      notifyValidation(false);
      lastPropValueRef.current = serializeJson(parsed);
    } catch (e: any) {
      setError('Некорректный JSON');
      notifyValidation(true);
    }
  };

  const handleImport = () => {
    const raw = window.prompt('Вставьте JSON:');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const pretty = JSON.stringify(parsed, null, 2);
      setText(pretty);
      setError(null);
      onChange(parsed);
      if (storageKey) localStorage.setItem(storageKey, pretty);
      notifyValidation(false);
      lastPropValueRef.current = pretty;
    } catch {
      setError('Некорректный JSON');
      notifyValidation(true);
    }
  };

  const handleExport = () => {
    navigator.clipboard?.writeText(text).then(() => {
      alert('JSON скопирован в буфер обмена');
    });
  };

  const handleClear = () => {
    setText('{}');
    setError(null);
    onChange({});
    if (storageKey) localStorage.setItem(storageKey, '{}');
    notifyValidation(false);
    lastPropValueRef.current = '{}';
  };

  const containerStyle: React.CSSProperties = useMemo(
    () => ({ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', padding: 8 }),
    [],
  );

  const builtinTemplates = useMemo(() => {
    return templates.map(key => ({
      id: key,
      label: TEMPLATE_LABELS[key] ?? key,
      data: TEMPLATES[key] ?? {},
    }));
  }, [templates]);

  const allTemplates = useMemo(() => {
    return [...builtinTemplates, ...(customTemplates ?? [])];
  }, [builtinTemplates, customTemplates]);

  return (
    <div>
      {label && <div style={{ marginBottom: 6, fontSize: 13, color: '#374151' }}>{label}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {allTemplates.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {allTemplates.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl.data)}
                style={{
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 12,
                }}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handleImport}
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
            }}
          >
            Импорт JSON
          </button>
          <button
            type="button"
            onClick={handleExport}
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
            }}
          >
            Экспорт JSON
          </button>
          {storageKey && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(storageKey);
                alert('Черновик очищен');
              }}
              style={{
                border: '1px solid #e5e7eb',
                background: '#fff',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
              }}
            >
              Очистить черновик
            </button>
          )}
          <button
            type="button"
            onClick={handleClear}
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
            }}
          >
            Очистить поле
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 8 }}>{error}</div>}

      <div style={containerStyle}>
        <Monaco
          height={typeof height === 'number' ? `${height}px` : height}
          defaultLanguage="json"
          language="json"
          value={text}
          onChange={val => onTextChange(val)}
          theme="vs-light"
          options={{
            readOnly,
            wordWrap: 'on',
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: 'always',
            automaticLayout: true,
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            if (jsonSchema) {
              monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [
                  {
                    uri: 'inmemory://model/schema.json',
                    fileMatch: ['*'],
                    schema: jsonSchema,
                  },
                ],
                allowComments: false,
              });
            }
          }}
        />
      </div>
    </div>
  );
};
