import { useMemo, useState } from 'react';

import {
  SectionWrap,
  Container,
  ToggleBar,
  ToggleButton,
  ChevronIcon,
  Collapse,
  CollapseInner,
  Body,
  Paragraph,
} from './product-description.style';

interface ProductDescriptionProps {
  title?: string;
  description?: string | null;
  shortDescription?: string | null;
  defaultOpen?: boolean;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  title = 'Описание',
  description,
  shortDescription,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const content = useMemo(() => {
    const raw = description?.trim() || shortDescription?.trim();
    if (!raw) return [] as string[];
    return raw
      .split(/\n{2,}/)
      .map(block => block.trim())
      .filter(Boolean);
  }, [description, shortDescription]);

  if (!content.length) return null;

  const regionId = 'product-description-region';

  return (
    <SectionWrap>
      <Container>
        <ToggleBar>
          <ToggleButton
            type="button"
            aria-expanded={isOpen}
            aria-controls={regionId}
            onClick={() => setIsOpen(prev => !prev)}
            isOpen={isOpen}
          >
            <span>{title}</span>
            <ChevronIcon $open={isOpen} viewBox="0 0 20 20" aria-hidden>
              <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.08 1.04l-4.25 4.25a.75.75 0 0 1-1.06 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
            </ChevronIcon>
          </ToggleButton>
        </ToggleBar>

        <Collapse id={regionId} aria-hidden={!isOpen} $open={isOpen} role="region">
          <CollapseInner isOpen={isOpen}>
            <Body>
              {content.map((paragraph, idx) => (
                <Paragraph key={idx}>{paragraph}</Paragraph>
              ))}
            </Body>
          </CollapseInner>
        </Collapse>
      </Container>
    </SectionWrap>
  );
};
