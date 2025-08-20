import { Button } from '@/components/common/button/button';
import { ExpandeableContent } from '@/components/common/report-automatic/expandeable-content';
import { DateField } from '@/components/compose/forms';
import { Signal, useSignal } from '@preact/signals';
import { useCallback, useMemo, useEffect } from 'preact/hooks';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { Table } from '@tanstack/react-table';
import { IOption, SmartSelector } from '@/components/common/smart-selector/smart-select';

interface Props<T> {
  table: Table<T>;
  className?: string;
  isOpen: Signal<boolean>;
}

interface IModelsValues {
  start: string;
  end: string;
  columns: IOption[];
}

export interface IRangeValues {
  [key: string]: [string, string];
}

export const RangeDateFilter = <T,>({ isOpen, table }: Props<T>) => {
  const { t } = useTranslation();
  const loading = useSignal(false);
  const columns = useSignal<IOption[]>([]);

  // Ejecutar directamente cuando el componente se monte
  useEffect(() => {
    dateColumns();
  }, [table]);

  const dateColumns = () => {
    return table.getAllLeafColumns().filter(column => {
      const dateEnable = (column.columnDef as any)?.meta.type;

      if (dateEnable === 'date') {
        columns.value.push({
          // @ts-ignore
          value: String(column.columnDef?.accessorKey),
          label: t(String(column.columnDef.header))
        });
        return true;
      }
      return false;
    });
  };

  const onSubmit = async (model: IModelsValues) => {
    loading.value = true;

    const range: IRangeValues = model.columns.reduce((acc, column) => {
      return {
        ...acc,
        [String(column?.value)]: [DateUtils.dateToBackend(model.start), DateUtils.dateToBackend(model.end)] as [string, string]
      };
    }, {} as IRangeValues);

    console.log('Form data:', range);

    isOpen.value = false;
    loading.value = false;
  };

  const handleClearFilters = () => { };

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
                          disabled={loading.value}
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
                          disabled={loading.value}
                        />
                      </div>
                      <div className='col-span-1'>
                        <Field<IOption[]> name='columns'>
                          {({ input, meta }) => (
                            <SmartSelector
                              {...input}
                              meta={meta}
                              id='select-columns'
                              icon='120'
                              label='h_columns'
                              options={columns.value}
                              menuPortalTarget={document.body}
                              placeholder='p_select'
                              multiple={true}
                            />
                          )}
                        </Field>
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
