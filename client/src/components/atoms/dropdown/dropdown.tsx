import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useOutside } from '@/hooks/useOutside';

import {
  DropdownChevron,
  DropdownItemButton,
  DropdownItemLink,
  DropdownMenu,
  DropdownRoot,
  DropdownTrigger,
} from './dropdown.style';

/**
 * Reusable Dropdown (headless-friendly) with a11y + keyboard nav.
 * - Works controlled (`open`) or uncontrolled (`defaultOpen`).
 * - Items can be plain actions or links (href).
 * - Customizable renderers for trigger and item.
 * - Typeahead, roving focus, click-outside, Escape, Home/End, Arrow keys.
 * - Minimal styles; override via `className` or styled(DropdownRoot) etc.
 */

export type DropdownKey = string | number;

export interface BaseItem {
  key: DropdownKey;
  label: React.ReactNode;
  disabled?: boolean;
  href?: string; // if provided — item becomes a link
  onClick?: () => void; // optional per-item handler
}

export interface DropdownProps {
  items?: BaseItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (key: DropdownKey, item?: BaseItem) => void;
  /**
   * Align menu relative to trigger: start (left) | end (right)
   */
  align?: 'start' | 'end';
  /**
   * Close the menu when an item is selected (default true)
   */
  closeOnSelect?: boolean;
  /**
   * Custom trigger renderer. Receives `{open, ref, toggle}`
   */
  renderTrigger?: (args: {
    open: boolean;
    ref: React.Ref<HTMLButtonElement>;
    toggle: () => void;
    props: React.ButtonHTMLAttributes<HTMLButtonElement>;
  }) => React.ReactNode;
  /**
   * Custom item renderer. Receives state and should call `select()`
   */
  renderItem?: (args: {
    item: BaseItem;
    active: boolean;
    highlighted: boolean;
    select: () => void;
  }) => React.ReactNode;
  /**
   * Optional ARIA label for trigger
   */
  ariaLabel?: string;
  /**
   * Optional className to style root
   */
  className?: string;

  fullWidthTrigger?: boolean;
  fullWidthMenu?: boolean;
  hasBorder?: boolean;
}

const TYPEAHEAD_TIMEOUT = 600;

export const Dropdown: React.FC<DropdownProps> = ({
  items = [],
  open: openProp,
  defaultOpen,
  onOpenChange,
  onSelect,
  align = 'start',
  closeOnSelect = true,
  renderTrigger,
  renderItem,
  ariaLabel = 'Меню',
  className,
  fullWidthMenu = false,
  fullWidthTrigger = false,
  hasBorder = false,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  // controlled/uncontrolled state
  const isControlled = typeof openProp === 'boolean';
  const [openUncontrolled, setOpenUncontrolled] = useState(!!defaultOpen);
  const open = isControlled ? !!openProp : openUncontrolled;
  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setOpenUncontrolled(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const focusItem = useCallback((idx: number) => {
    setHighlightIndex(idx);
    // Try to scroll item into view if menu has overflow (not likely here)
    const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${idx}"]`);
    el?.focus();
  }, []);

  // click outside closes
  useOutside(rootRef, () => setOpen(false));

  // keyboard handlers on trigger
  const onTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        if (!open) setOpen(true);
        // focus first enabled item
        const first = items.findIndex(i => !i.disabled);
        if (first >= 0) requestAnimationFrame(() => focusItem(first));
      }
    },
    [focusItem, items, open, setOpen],
  );

  // typeahead buffer
  const bufferRef = useRef('');
  const lastTypeTimeRef = useRef(0);

  const handleTypeahead = (key: string) => {
    const now = Date.now();
    if (now - lastTypeTimeRef.current > TYPEAHEAD_TIMEOUT) bufferRef.current = '';
    lastTypeTimeRef.current = now;
    bufferRef.current += key.toLowerCase();
    const idx = items.findIndex(
      i => String(i.label).toLowerCase().startsWith(bufferRef.current) && !i.disabled,
    );
    if (idx >= 0) focusItem(idx);
  };

  const selectItem = (item: BaseItem | undefined) => {
    if (!item) return;
    if (item.disabled) return;
    item.onClick?.();
    onSelect?.(item.key, item);
    if (closeOnSelect) setOpen(false);
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const enabled = items
      .map((i, idx) => ({ idx, disabled: !!i.disabled }))
      .filter(x => !x.disabled)
      .map(x => x.idx);
    const currentPos = enabled.indexOf(highlightIndex);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = enabled[Math.min(currentPos + 1, enabled.length - 1)] ?? enabled[0];
      if (next) {
        focusItem(next);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = enabled[Math.max(currentPos - 1, 0)] ?? enabled[enabled.length - 1];
      if (prev) {
        focusItem(prev);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem(enabled[0] ?? -1);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem(enabled[enabled.length - 1] ?? -1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightIndex >= 0) selectItem(items[highlightIndex]);
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      handleTypeahead(e.key);
    }
  };

  useEffect(() => {
    if (!open) setHighlightIndex(-1);
  }, [open]);

  const setTriggerNode = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
  }, []);

  const trigger = useMemo(() => {
    const props: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: () => setOpen(!open),
      onKeyDown: onTriggerKeyDown,
    };
    if (renderTrigger)
      return renderTrigger({ open, ref: setTriggerNode, toggle: () => setOpen(!open), props });
    return (
      <DropdownTrigger
        ref={setTriggerNode}
        {...props}
        fullWidth={fullWidthTrigger}
        hasBorder={hasBorder}
      >
        Меню
        <DropdownChevron open={open} aria-hidden />
      </DropdownTrigger>
    );
  }, [onTriggerKeyDown, open, renderTrigger, setOpen, setTriggerNode]);

  return (
    <DropdownRoot ref={rootRef} className={className} fullWidth={fullWidthTrigger}>
      {trigger}
      {open && (
        <DropdownMenu
          hasBorder={hasBorder}
          ref={menuRef}
          role="menu"
          align={align}
          aria-label={ariaLabel}
          onKeyDown={onMenuKeyDown}
          fullWidth={fullWidthMenu}
        >
          {items.map((item, idx) => {
            const active = idx === highlightIndex;
            const commonProps = {
              'data-index': idx,
              tabIndex: active ? 0 : -1,
              onMouseEnter: () => setHighlightIndex(idx),
            };
            if (renderItem) {
              return (
                <li key={String(item.key)} role="none">
                  {renderItem({
                    item,
                    active,
                    highlighted: active,
                    select: () => selectItem(item),
                  })}
                </li>
              );
            }
            if (item.href) {
              return (
                <li key={String(item.key)} role="none">
                  <DropdownItemLink href={item.href} {...commonProps} active={active}>
                    {item.label}
                  </DropdownItemLink>
                </li>
              );
            }
            return (
              <li key={String(item.key)} role="none">
                <DropdownItemButton
                  {...commonProps}
                  role="menuitem"
                  active={active}
                  disabled={item.disabled}
                  onClick={() => selectItem(item)}
                >
                  {item.label}
                </DropdownItemButton>
              </li>
            );
          })}
        </DropdownMenu>
      )}
    </DropdownRoot>
  );
};

export default Dropdown;
