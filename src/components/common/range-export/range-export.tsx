import { useEffect, useState } from 'preact/hooks';
import { Button } from '../button/button';
import { useSignal } from '@preact/signals';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { DateField } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { FormService } from '@/services/form/form';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IFormResponse } from '@/types/form';
import { SmartSelector } from '../smart-selector/smart-select';

const MODAL_STYLES =
  'absolute right-0 top-full mt-2 w-[500px] min-h-[200px] max-w-[90vw] shadow-lg rounded-md modal-shadow p-0 bg-white dark:bg-b-dark-dark text-t-light dark:text-t-dark border border-gray-200 dark:border-gray-700 z-40 animate-fade-in';

export const RangeExport = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const forms = useSignal<IFormResponse[]>([]);
  const loading = useSignal(false);

  const handleExport = async (values: {
    startDate: string;
    endDate: string;
    formId?: { value: number };
  }) => {
    if (!values.startDate || !values.endDate) {
      ToastManager.error(t('file_invalid_date_range'));
      return;
    }

    const start = new Date(DateUtils.dateToFrontend(values.startDate));
    const end = new Date(DateUtils.dateToFrontend(values.endDate));

    if (end < start) {
      ToastManager.error(t('invalid_end_date'));
      return;
    }

    loading.value = true;

    const response = await FormService.generateReportResponse({
      startDate: DateUtils.dateToBackend(values.startDate, 'date'),
      endDate: DateUtils.dateToBackend(values.endDate, 'date'),
      formId: values.formId?.value,
    });

    if (response.getStatus()) {
      const result = response.getOne();
      if (result.data?.buffer) {
        const byteCharacters = atob(result.data.buffer);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type:
            result.data.mimeType ||
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
  
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.data.filename || 'data_export.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        ToastManager.success(t('file_exportSuccess'));
      } else {
        ToastManager.success(t('file_export_processing'));
      }
    }

   
    setIsOpen(false);
    loading.value = false;
  };

  const handleClose = () => {
    setIsOpen(false);
    loading.value = false;
  };

  useEffect(() => {
    getFormsHandler();
  }, []);

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (response.getStatus()) {
      forms.value = response.getMany() as IFormResponse[];
    }
  };

  return (
    <div className='relative flex items-center'>
      <div className='h-6 w-px bg-b-light-dark dark:bg-gray-700 mx-2' />
      <Button
        name='group-range-export'
        onClick={() => setIsOpen(true)}
        icon='341'
        square
        transparent
        borderless
      />
      {isOpen && (
        <div className={MODAL_STYLES}>
          <div className='flex flex-row w-full items-center pt-2 p-3 border-b-2 border-b-b-light-light dark:border-b-dark-light'>
            <h3 className='flex-1'>{t('file_export_by_date_range')}</h3>
            <Button
              name='btn-close'
              onClick={handleClose}
              type='button'
              rounded
              icon='192'
              transparent
              borderless
            />
          </div>

          <div className='px-4 py-6'>
            <Form onSubmit={handleExport}>
              {({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit} id='form-range-export'>
                  <div className='flex flex-col gap-2'>
                    <SmartSelector
                      name='formId'
                      label='l_form'
                      icon='094'
                      options={forms.value.map((form) => ({
                        label: form.title,
                        value: form.id,
                      }))}
                      disabled={loading.value}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-3 mb-4'>
                    <DateField
                      name='startDate'
                      label='h_date_start'
                      format='date'
                      disabled={loading.value}
                    />
                    <DateField
                      name='endDate'
                      label='h_date_end'
                      format='date'
                      disabled={loading.value}
                    />
                  </div>
                  <div className='flex gap-2 justify-end'>
                    <Button
                      name='btn-range-export-cancel'
                      label={t('file_cancel')}
                      type='button'
                      onClick={handleClose}
                      icon='041'
                      disabled={loading.value}
                      transparent
                    />
                    <Button
                      name='btn-range-export-apply'
                      type='submit'
                      label={t('file_export')}
                      icon='341'
                      disabled={
                        loading.value || !values.startDate || !values.endDate
                      }
                      loading={loading.value}
                    />
                  </div>
                </form>
              )}
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
