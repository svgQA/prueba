import { Button } from '@/components/common/button/button';
import { ExpandeableContent } from '@/components/common/report-automatic/expandeable-content';
import { DateField } from '@/components/compose/forms';
import { Signal, useSignal } from '@preact/signals';
import { useCallback, useMemo } from 'preact/hooks';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { IOption } from '@/components/common/smart-selector/smart-select';

interface Props {
  className?: string;
  isOpen: Signal<boolean>;
  onRangeChange?: (range: IRangeValues | null) => void;
  column: string;
}

interface IModelsValues {
  start: string;
  end: string;
  columns: IOption[];
}

export interface IRangeValues {
  [key: string]: [string, string];
}

export const RangeDateFilter = ({ isOpen, column, onRangeChange }: Props) => {
  const { t } = useTranslation();
  const loading = useSignal(false);
  const canApply = useSignal(false);

  const onSubmit = async (model: IModelsValues) => {
    loading.value = true;

    const range: IRangeValues = {
      [column]: [
        DateUtils.dateToBackend(model.start, 'date'),
        DateUtils.dateToBackend(model.end, 'date'),
      ] as [string, string],
    };

    if (onRangeChange) {
      onRangeChange(range);
    }

    isOpen.value = false;
    loading.value = false;
  };

  const footerContent = useMemo(
    () => (
      <div className='flex justify-between items-center gap-2 p-4'>
        <div className='flex gap-2'>
          <Button
            name='btn-date-filter-close'
            label='cancel'
            type='button'
            onClick={() => (isOpen.value = false)}
            icon='041'
            disabled={loading.value}
          />
          <Button
            name='btn-date-filter-save'
            type='submit'
            label='apply'
            form='form-date-range-filter'
            icon='041'
            disabled={loading.value || !canApply.value}
          />
        </div>
      </div>
    ),
    [loading.value, canApply.value]
  );

  const onClose = () => {
    isOpen.value = false;
    loading.value = false;
  };

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      {isOpen.value && (
        <ExpandeableContent
          isOpen={isOpen.value}
          onClose={onClose}
          width='min-w-[600px]'
          header={<h3>{t('h_filter_date')}</h3>}
          footer={footerContent}
        >
          <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
            <Form
              onSubmit={onSubmit}
              initialValues={{}}
              render={({ handleSubmit, values }) => {
                // Actualizar el signal automáticamente cuando cambien los valores
                canApply.value = !!(values.start && values.end);

                return (
                  <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                    id='form-date-range-filter'
                    onKeyDown={preventKeyDown}
                  >
                    <div className='py-2 grid grid-cols-2 gap-3'>
                      <div className='col-span-1'>
                        <DateField
                          name='start'
                          label='h_date_start'
                          format='date'
                          // type='date'
                          validate={(value) => {
                            if (value && values.end) {
                              const startDate = DateUtils.dateToFrontend(value);
                              const endDate = DateUtils.dateToFrontend(
                                values.end
                              );

                              // Normaliza a solo fecha (sin hora)
                              const start = new Date(startDate);
                              const end = new Date(endDate);
                              start.setHours(0, 0, 0, 0);
                              end.setHours(0, 0, 0, 0);

                              if (start > end) {
                                return t('invalid_start_date');
                              }
                            }
                            return undefined;
                          }}
                          disabled={loading.value}
                        />
                      </div>
                      <div className='col-span-1'>
                        <DateField
                          name='end'
                          label='h_date_end'
                          format='date'
                          // type='date'
                          validate={(value) => {
                            if (value && values.start) {
                              const startDate = DateUtils.dateToFrontend(
                                values.start
                              );
                              const endDate = DateUtils.dateToFrontend(value);

                              // Normaliza a solo fecha (sin hora)
                              const start = new Date(startDate);
                              const end = new Date(endDate);
                              start.setHours(0, 0, 0, 0);
                              end.setHours(0, 0, 0, 0);

                              if (end < start) {
                                return t('invalid_end_date');
                              }
                            }
                            return undefined;
                          }}
                          disabled={loading.value}
                        />
                      </div>
                    </div>
                  </form>
                );
              }}
            />
          </div>
        </ExpandeableContent>
      )}
    </div>
  );
};
