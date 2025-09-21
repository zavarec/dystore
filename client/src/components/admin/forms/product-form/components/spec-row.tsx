import { Controller, useWatch, Control } from 'react-hook-form';
import { ProductFormValues } from '../product-form.schema';
import { Button, Checkbox, Input, Select } from '../product-form.style';

type SpecRowProps = {
  index: number;

  attributes: Array<{
    id: number;
    type: 'STRING' | 'NUMBER' | 'BOOLEAN';
    unit?: string;
    key: string;
    label: string;
  }>;
  control: Control<ProductFormValues>;
  setValue: (name: any, value: any, opts?: any) => void;
  loading?: boolean;
  remove: () => void;
};

export const SpecRow: React.FC<SpecRowProps> = ({
  index,
  attributes,
  control,
  setValue,
  loading = false,
  remove,
}) => {
  const attributeId = useWatch({ control, name: `specs.${index}.attributeId` }) ?? 0;
  const attr = attributes.find(a => a.id === Number(attributeId));
  const attrType = attr?.type ?? 'STRING';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr 140px auto',
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Controller
        name={`specs.${index}.attributeId`}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            value={Number(field.value ?? 0)}
            onChange={e => {
              const v = Number(e.target.value);
              field.onChange(v);
              // сброс/подстановка label/unit при выборе существующего атрибута
              setValue(`specs.${index}.label`, '', { shouldValidate: true });
              setValue(`specs.${index}.unit`, attributes.find(a => a.id === v)?.unit ?? '', {
                shouldValidate: true,
              });
            }}
            disabled={loading}
          >
            <option value={0}>— Новый атрибут —</option>
            {attributes.map(attribute => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.label}
                {attribute.unit ? `, ${attribute.unit}` : ''}
              </option>
            ))}
          </Select>
        )}
      />

      {Number(attributeId) === 0 && (
        <Controller
          name={`specs.${index}.label`}
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Название характеристики (новой)" disabled={loading} />
          )}
        />
      )}

      {Number(attributeId) === 0 && (
        <Controller
          name={`specs.${index}.unit`}
          control={control}
          render={({ field }) => (
            <Input {...field} value={field.value ?? ''} placeholder="Ед. изм." disabled={loading} />
          )}
        />
      )}

      {attrType === 'BOOLEAN' ? (
        <Controller
          name={`specs.${index}.value`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={Boolean(field.value)}
              onChange={e => field.onChange(e.target.checked)}
              disabled={loading}
            />
          )}
        />
      ) : (
        <Controller
          name={`specs.${index}.value`}
          control={control}
          render={({ field }) => (
            <Input
              type={attrType === 'NUMBER' ? 'number' : 'text'}
              {...field}
              value={field.value ?? ''}
              placeholder="Значение"
              disabled={loading}
            />
          )}
        />
      )}

      <Button type="button" onClick={remove} $variant="secondary">
        Удалить
      </Button>
    </div>
  );
};
