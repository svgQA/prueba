import { Button } from '@/components/common/button/button';
import { ExpandeableContent } from '@/components/common/report-automatic/expandeable-content';
import { DateField } from '@/components/compose/forms';
import { Signal, useSignal } from '@preact/signals';
import { useCallback, useMemo } from 'preact/hooks';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';

interface Props {
  // table: Table<T>;
  className?: string;
  isOpen: Signal<boolean>;
}

interface DateRangeValues {
  start: string;
  end: string;
}

export const RangeDateFilter = ({ isOpen }: Props) => {
  const { t } = useTranslation();
  const loading = useSignal(false);

  // Función para obtener todas las columnas de fecha
  // const getDateColumns = useCallback(() => {
  //     return table.getAllLeafColumns().filter(column => {
  //         const dateEnable = (column.columnDef as any)?.enableDateFilter;
  //         return dateEnable ? dateEnable : false;
  //     });
  // }, [table]);

  const onSubmit = async (_values: DateRangeValues) => {
    loading.value = true;

    try {
      // const startDate = DateUtils.dateToFrontend(start);
      // const endDate = DateUtils.dateToFrontend(end);
      // const dateColumns = getDateColumns();

      // const filters = dateColumns.map(column => ({
      //     id: column.id,
      //     value: {
      //         start: startDate,
      //         end: endDate
      //     }
      // }));

      // // Aplicar todos los filtros de una vez
      // table.setColumnFilters(prev => [
      //     ...prev.filter(filter => !dateColumns.some(col => col.id === filter.id)),
      //     ...filters
      // ]);

      // Usar filtro global con rango de fechas
      // table.setGlobalFilter({
      //     type: 'dateRange',
      //     start,
      //     end
      // });

      isOpen.value = false;
    } catch (error) {
      console.error('Error applying date range filter:', error);
    } finally {
      loading.value = false;
    }
  };

  const handleClearFilters = () => {};

  const footerContent = useMemo(
    () => (
      <div className='flex justify-between items-center gap-2 p-4'>
        <Button
          name='btn-date-filter-clear'
          label='clear_filters'
          type='button'
          onClick={handleClearFilters}
          icon='319'
          disabled={loading.value}
        />
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
            label='apply_filter'
            form='form-date-range-filter'
            icon='041'
            disabled={loading.value}
          />
        </div>
      </div>
    ),
    [loading.value, handleClearFilters]
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
      {/* <div className='flex flex-row justify-between items-center'>
                <div className='h-6 w-px bg-b-light-dark dark:bg-gray-700 mx-2' />
                <Button
                    name='date-range-filter'
                    onClick={() => isOpen.value = true}
                    icon='319'
                    square
                    transparent
                    borderless
                    selectedColor='bg-primary text-white'
                />
            </div> */}
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
                          validate={(value) => {
                            if (value && values.end) {
                              const startDate = DateUtils.dateToFrontend(value);
                              const endDate = DateUtils.dateToFrontend(
                                values.end
                              );
                              if (startDate && endDate && startDate > endDate) {
                                return t('start_date_must_be_before_end_date');
                              }
                            }
                            return undefined;
                          }}
                        />
                      </div>
                      <div className='col-span-1'>
                        <DateField
                          name='end'
                          label='h_date_end'
                          validate={(value) => {
                            if (value && values.start) {
                              const startDate = DateUtils.dateToFrontend(
                                values.start
                              );
                              const endDate = DateUtils.dateToFrontend(value);
                              if (startDate && endDate && endDate < startDate) {
                                return t('end_date_must_be_after_start_date');
                              }
                            }
                            return undefined;
                          }}
                        />
                      </div>
                    </div>

                    {/* Información sobre las columnas que se filtrarán */}
                    {/* <div className='text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-md'>
                                            <p className='font-medium mb-2'>{t('columns_to_filter')}:</p>
                                            <ul className='list-disc list-inside space-y-1'>
                                                {getDateColumns().map(column => {
                                                    const header = typeof column.columnDef.header === 'string'
                                                        ? column.columnDef.header
                                                        : column.id;
                                                    return (
                                                        <li key={column.id} className='text-xs'>
                                                            {t(header)}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div> */}
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
