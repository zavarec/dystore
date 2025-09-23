import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '../product-form.schema';
import { Button, Input } from '../product-form.style';
import { ProductImageUpload } from '@/components/FileUpload/product-file-upload';
import styled from '@emotion/styled';

type BoxRowProps = {
  index: number;
  control: Control<ProductFormValues>;
  loading?: boolean;
  setValue: UseFormSetValue<ProductFormValues>;
  remove: () => void;
};

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Col = styled.div<{ $basis?: number }>`
  flex: 1 1 ${({ $basis }) => ($basis ? `${$basis}px` : '0')};
  min-width: 160px;
`;

const UploaderCol = styled.div`
  flex: 0 0 160px; /* фиксированная колонка под превью */
  max-width: 160px;
`;

export const BoxRow: React.FC<BoxRowProps> = ({ index, control, loading, setValue, remove }) => {
  // Отладочная информация
  // const watchCustomImageUrl = control._formValues?.boxItems?.[index]?.customImageUrl;
  // const watchCustomImageId = control._formValues?.boxItems?.[index]?.customImageId;

  // console.log(`BoxRow ${index} - customImageUrl:`, watchCustomImageUrl);
  // console.log(`BoxRow ${index} - customImageId:`, watchCustomImageId);

  return (
    <Row>
      {/* Название аксессуара */}
      <Col>
        <Controller
          name={`boxItems.${index}.customName`}
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Название аксессуара" disabled={loading} />
          )}
        />
      </Col>

      {/* Мини-загрузчик изображения (ID пишем в customImageId) */}
      <UploaderCol>
        {/* Скрытое поле для ID файла */}
        <Controller
          name={`boxItems.${index}.customImageId`}
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Controller
          name={`boxItems.${index}.customImageUrl`}
          control={control}
          render={({ field }) => (
            <ProductImageUpload
              value={field.value || ''}
              currentImageUrl={field.value || ''}
              size="sm"
              // тонкая настройка (перебивает size), чтобы было компактно
              containerMinHeight={100}
              previewMaxHeight={120}
              previewWidth={120} // ширина превью
              previewHeight={90} // высота превью
              borderRadius={6}
              label="Изображение"
              disabled={loading || false}
              onChange={(fileId, file) => {
                // Если fileId пустой или null, устанавливаем undefined вместо пустой строки
                const validFileId = fileId && fileId.trim() !== '' ? fileId : undefined;
                setValue(`boxItems.${index}.customImageId`, validFileId || '', {
                  shouldValidate: true,
                });
                // обновляем URL для отображения
                setValue(`boxItems.${index}.customImageUrl`, file?.url || '', {
                  shouldValidate: false,
                });
              }}
              onError={err => {
                // тут можно показать toast/notification
                console.error('upload error', err);
              }}
            />
          )}
        />
      </UploaderCol>

      {/* Описание */}
      <Col $basis={260}>
        <Controller
          name={`boxItems.${index}.description`}
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Описание аксессуара" disabled={loading} />
          )}
        />
      </Col>

      {/* Количество */}
      <Col $basis={120}>
        <Controller
          name={`boxItems.${index}.qty`}
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              {...field}
              value={field.value ?? 1}
              onChange={e => field.onChange(Number(e.target.value))}
              placeholder="Кол-во"
              disabled={loading}
            />
          )}
        />
      </Col>

      <div>
        <Button type="button" onClick={remove} $variant="secondary">
          Удалить
        </Button>
      </div>
    </Row>
  );
};
