import { useMemo, useState } from 'react';

import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

import { promoVariantLabelsMap } from '@/constants/promo.constants';
import {
  Backdrop,
  Body,
  Button,
  Field,
  Footer,
  Header,
  Input,
  Modal,
  Title,
  CloseBtn,
} from '@/features/admin/promo/promo-sections/ui/promo-sections-modals.style';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/slices/auth-slice/auth.selectors';
import { createPromoSection } from '@/store/slices/promo/promo.thunks';
import type { CreatePromoSectionDto } from '@/types/models/promo-section.model';
import { ContentSideEnum, PromoFont, PromoVariant } from '@/types/models/promo-section.model';
import type { User } from '@/types/models/user.model';

import { sampleCarousel, sampleDropdown, sampleHighlights } from '../../utils';

export function PromoSectionCreateModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector(selectUser) as User;

  const [submitting, setSubmitting] = useState(false);
  const [variant, setVariant] = useState<PromoVariant>(PromoVariant.BANNER);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [font, setFont] = useState<PromoFont>(PromoFont.NUNITO_SANS);
  const [titleColor, setTitleColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [ctaBg, setCtaBg] = useState('');
  const [ctaColor, setCtaColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [heightPx, setHeightPx] = useState<number | ''>('');
  const [paddingTopPx, setPaddingTopPx] = useState<number | ''>('');
  const [paddingBottomPx, setPaddingBottomPx] = useState<number | ''>('');
  const [contentFontSizePx, setContentFontSizePx] = useState<number | ''>('');
  const [titleFontSizePx, setTitleFontSizePx] = useState<number | ''>('');
  const [contentSide, setContentSide] = useState<ContentSideEnum | ''>('');

  const [contentStr, setContentStr] = useState('');
  const [contentErr, setContentErr] = useState<string | null>(null);

  const disableSingleMedia = variant === PromoVariant.CAROUSEL;

  const variantOptions = useMemo(
    () => Object.values(PromoVariant).map(v => ({ value: v, label: promoVariantLabelsMap[v] })),
    [],
  );
  const fontOptions = useMemo(
    () =>
      [{ value: '', label: 'По умолчанию' }].concat(
        Object.values(PromoFont).map(f => ({ value: f, label: f })),
      ),
    [],
  );
  const contentSideOptions = useMemo(
    () =>
      [{ value: '', label: 'По умолчанию' }].concat(
        Object.values(ContentSideEnum).map(s => ({ value: s, label: s })),
      ),
    [],
  );

  const canSubmit =
    !!variant && (variant !== PromoVariant.CAROUSEL ? true : contentStr.trim().length > 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setContentErr(null);

    try {
      let content: unknown | undefined = undefined;

      if (variant === PromoVariant.CAROUSEL) {
        try {
          content = contentStr ? JSON.parse(contentStr) : undefined;
          if (!content || typeof content !== 'object') {
            throw new Error('Ожидается объект с полем kind');
          }

          const kind = (content as any).kind;
          if (kind === 'carousel') {
            if (!Array.isArray((content as any).slides)) {
              throw new Error('Ожидается { kind:"carousel", slides:[ ... ] }');
            }
          } else if (kind === 'dropdown') {
            if (!Array.isArray((content as any).options)) {
              throw new Error('Ожидается { kind:"dropdown", options:[ ... ] }');
            }
          } else if (kind === 'highlights') {
            if (!Array.isArray((content as any).items)) {
              throw new Error('Ожидается { kind:"highlights", items:[ ... ] }');
            }
          } else {
            throw new Error('kind должен быть "carousel", "dropdown" или "highlights"');
          }
        } catch (err: any) {
          setContentErr(err?.message || 'Некорректный JSON');
          setSubmitting(false);
          return;
        }
      }

      const dto: CreatePromoSectionDto = {
        variant,
        title: title ?? '',
        subtitle: subtitle ?? '',
        imageUrl: imageUrl ?? undefined,
        videoUrl: disableSingleMedia ? undefined : (videoUrl ?? undefined),
        ctaText: ctaText ?? '',
        ctaLink: ctaLink ?? '',
        font,
        titleColor: titleColor ?? '',
        textColor: textColor ?? '',
        ctaBg: ctaBg ?? '',
        ctaColor: ctaColor ?? '',
        bgColor: bgColor ?? '',
        contentSide: contentSide as ContentSideEnum,
        heightPx: typeof heightPx === 'number' ? heightPx : 0,
        paddingTopPx: typeof paddingTopPx === 'number' ? paddingTopPx : 0,
        paddingBottomPx: typeof paddingBottomPx === 'number' ? paddingBottomPx : 0,
        contentFontSizePx: typeof contentFontSizePx === 'number' ? contentFontSizePx : 0,
        titleFontSizePx: typeof titleFontSizePx === 'number' ? titleFontSizePx : 0,
        isActive: true,
        createdById: userId,
        content, // ← ВАЖНО: кладём JSON сюда
      };

      await dispatch(createPromoSection(dto)).unwrap?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось создать секцию');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Backdrop onMouseDown={onClose}>
      <Modal onMouseDown={e => e.stopPropagation()}>
        <Header>
          <Title>Новая промо-секция</Title>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </Header>

        <Body onSubmit={submit}>
          <Field>
            Вариант
            <ReactSelect
              options={variantOptions}
              value={variantOptions.find(o => o.value === variant) || null}
              onChange={(opt: any) => setVariant(opt?.value as PromoVariant)}
              isClearable={false}
            />
          </Field>

          {variant === PromoVariant.CAROUSEL && (
            <Field>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Контент секции (JSON)</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Варианты: kind="carousel" (slides[]), kind="dropdown" (options[]) или
                    kind="highlights" (items[])
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setContentStr(sampleCarousel)}
                    title="Пример полноэкранной карусели"
                  >
                    Пример hero
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setContentStr(sampleDropdown)}
                    title="Пример дропдауна с карточками"
                  >
                    Пример dropdown
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setContentStr(sampleHighlights)}
                    title="Пример секции Machine highlights"
                  >
                    Пример highlights
                  </Button>
                </div>
              </div>

              <textarea
                value={contentStr}
                onChange={e => setContentStr(e.target.value)}
                rows={16}
                style={{
                  width: '100%',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 13,
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  outline: contentErr ? '2px solid #ef4444' : 'none',
                }}
                placeholder="Вставь JSON (carousel / dropdown / highlights)"
              />

              {contentErr && (
                <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{contentErr}</div>
              )}
            </Field>
          )}

          <Field>
            Заголовок
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Field>
          <Field>
            Подзаголовок
            <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          </Field>
          <Field>
            URL изображения
            <Input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              disabled={disableSingleMedia}
            />
          </Field>
          <Field>
            URL видео
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              disabled={disableSingleMedia}
            />
          </Field>
          <Field>
            CTA текст
            <Input value={ctaText} onChange={e => setCtaText(e.target.value)} />
          </Field>
          <Field>
            CTA ссылка
            <Input value={ctaLink} onChange={e => setCtaLink(e.target.value)} />
          </Field>

          <Field>
            Шрифт
            <ReactSelect
              options={fontOptions}
              value={fontOptions.find(o => o.value === (font || '')) || fontOptions[0]}
              onChange={(opt: any) => setFont((opt?.value || '') as any)}
              isClearable
            />
          </Field>

          <Field>
            Цвет заголовка
            <Input
              value={titleColor}
              onChange={e => setTitleColor(e.target.value)}
              placeholder="#111111"
            />
          </Field>
          <Field>
            Цвет текста
            <Input
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              placeholder="#222222"
            />
          </Field>
          <Field>
            CTA фон
            <Input value={ctaBg} onChange={e => setCtaBg(e.target.value)} placeholder="#000000" />
          </Field>
          <Field>
            CTA цвет
            <Input
              value={ctaColor}
              onChange={e => setCtaColor(e.target.value)}
              placeholder="#ffffff"
            />
          </Field>
          <Field>
            Фон секции
            <Input
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              placeholder="#f5f5f5"
            />
          </Field>
          <Field>
            Положение контента
            <ReactSelect
              options={contentSideOptions}
              value={
                contentSideOptions.find(o => o.value === (contentSide || '')) ||
                contentSideOptions[0]
              }
              onChange={(opt: any) => setContentSide((opt?.value || '') as any)}
              isClearable
            />
          </Field>
          <Field>
            Высота (px)
            <Input
              type="number"
              value={heightPx}
              onChange={e => setHeightPx(e.target.value ? Number(e.target.value) : '')}
            />
          </Field>
          <Field>
            Padding top (px)
            <Input
              type="number"
              value={paddingTopPx}
              onChange={e => setPaddingTopPx(e.target.value ? Number(e.target.value) : '')}
            />
          </Field>
          <Field>
            Padding bottom (px)
            <Input
              type="number"
              value={paddingBottomPx}
              onChange={e => setPaddingBottomPx(e.target.value ? Number(e.target.value) : '')}
            />
          </Field>
          <Field>
            Размер шрифта контента (px)
            <Input
              type="number"
              value={contentFontSizePx}
              onChange={e => setContentFontSizePx(e.target.value ? Number(e.target.value) : '')}
            />
          </Field>
          <Field>
            Размер шрифта заголовка (px)
            <Input
              type="number"
              value={titleFontSizePx}
              onChange={e => setTitleFontSizePx(e.target.value ? Number(e.target.value) : '')}
            />
          </Field>
          <Footer>
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? 'Создаём…' : 'Создать'}
            </Button>
          </Footer>
        </Body>
      </Modal>
    </Backdrop>
  );
}
