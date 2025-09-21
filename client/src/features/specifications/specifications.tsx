import { useMemo } from 'react';
import { specFromAtttributeUnitMap, specPriorityMap } from '@/constants/spec-attributes.constant';
import {
  BottomRow,
  DimensionsCol,
  DimItem,
  SpecsSection,
  SpecsHeader,
  SpecsWrapper,
  SpecCard,
  SpecLabel,
  SpecValueRow,
  SpecValue,
  SpecUnit,
  DimensionsImageCol,
  DimensionsImage,
} from './specifications.style';

type Attribute = {
  key: string;
  label: string;
  unit?: string | null;
  group?: string | null;
};

type ProductSpec = {
  attribute?: Attribute;
  valueString?: string | null;
  valueNumber?: number | null;
  valueBool?: boolean | null;
  unit?: string | null;
  order?: number | null;
  key?: string | null;
  id?: number | null;
  dimensionsImageUrl?: string | null;
};

export interface SpecificationsProps {
  title?: string;
  specs: ProductSpec[]; // product.specs с include { attribute: true }
  dimensionsImageUrl?: string | null;
}

function displayValue(s: ProductSpec): { value: React.ReactNode; unit?: string } {
  if (s.valueNumber !== null && s.valueNumber !== undefined) {
    return { value: s.valueNumber, unit: s.attribute?.unit ?? '' };
  }

  if (s.attribute?.key === 'cyclone_tech') {
    return { value: s.valueNumber, unit: specFromAtttributeUnitMap[s.attribute?.key] ?? '' };
  }
  if (s.valueBool !== null && s.valueBool !== undefined) {
    return { value: s.valueBool ? 'Да' : 'Нет' };
  }
  return { value: s.valueString ?? '', unit: s.attribute?.unit ?? '' };
}

export const Specifications: React.FC<SpecificationsProps> = ({
  title = 'Характеристики',
  specs,
  dimensionsImageUrl,
}) => {
  const DIM_KEYS = new Set(['height', 'length', 'width']);

  const getKey = (s: ProductSpec) => (s.attribute?.key ?? s.key ?? '').toLowerCase();
  const getOrder = (s: ProductSpec) => {
    const key = getKey(s);
    if (specPriorityMap[key]) {
      return specPriorityMap[key]; // приоритет из мапы
    }
    // если нет в мапе — используем order из БД или "999"
    return s.order ?? 999;
  };

  const { topSpecs, dims } = useMemo(() => {
    const sorted = [...specs].sort(
      (a, b) => getOrder(a) - getOrder(b) || (a.id ?? 0) - (b.id ?? 0),
    );
    const dims = sorted.filter(s => DIM_KEYS.has(getKey(s)));
    const topSpecs = sorted.filter(s => !DIM_KEYS.has(getKey(s)));
    return { topSpecs, dims };
  }, [specs]);

  console.log(
    {
      dims,
      topSpecs,
      specs,
      dimensionsImageUrl,
    },
    'DIMS AND TOP SPECS',
  );

  return (
    <SpecsSection>
      <SpecsHeader>{title}</SpecsHeader>

      {/* верхняя сетка без групп */}
      <SpecsWrapper>
        {topSpecs.map(spec => {
          const { value, unit } = displayValue(spec);
          return (
            <SpecCard key={spec.id}>
              <SpecLabel>{spec.attribute?.label}</SpecLabel>
              <SpecValueRow>
                <SpecValue>{value}</SpecValue>
                {unit ? <SpecUnit>&nbsp;{unit}</SpecUnit> : null}
              </SpecValueRow>
            </SpecCard>
          );
        })}
      </SpecsWrapper>

      {/* нижний ряд: слева размеры столбиком, справа две длинные фотки */}
      <BottomRow>
        <DimensionsCol>
          {dims.map(spec => {
            const { value, unit } = displayValue(spec);
            return (
              <DimItem key={spec.id}>
                <SpecLabel>{spec.attribute?.label}</SpecLabel>
                <SpecValueRow>
                  <SpecValue>{value}</SpecValue>
                  {unit ? <SpecUnit>{unit}</SpecUnit> : null}
                </SpecValueRow>
              </DimItem>
            );
          })}
        </DimensionsCol>

        {dimensionsImageUrl ? (
          <DimensionsImageCol>
            <DimensionsImage src={dimensionsImageUrl} alt="" />
          </DimensionsImageCol>
        ) : null}
      </BottomRow>
    </SpecsSection>
  );
};
