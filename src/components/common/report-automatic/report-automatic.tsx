import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ReportAutomaticProps } from './interface';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';
import { IOption, SmartSelector } from '../smart-selector/smart-select';
import { Field, Form } from 'react-final-form';
import { useSignal } from '@preact/signals';
import { Input } from '../input/input';
import { IReport } from '@/types/form';
import { ReportService } from '@/services/form/reports';
import { ToastManager } from '@/utils/toast/toast-manager';
import { periodOptions } from '@/pages/settings/forms/report/utils/report.data';
import { ServiceService } from '@/services';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { DateField } from '@/components/compose/forms';

export const ReportAutomatic = ({ modules }: ReportAutomaticProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const loading = useSignal(false);
  const projects = useSignal<IOption[]>([]);
  const periods = useSignal<IOption[]>(periodOptions);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices()]);
    }
  }, [selectedCompany]);

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (request.getStatus()) {
      projects.value = request.getMany();
    }
  }, []);

  const onSubmit = async (model: any, form: any) => {
    loading.value = true;

    let report: IReport = {
      title: model.title,
      subtitle: model.subtitle,
      description: model.description,
      period: model.period.label,
      extraData: {
        modules: [{ id: 1, name: modules }],
        projects: Array.isArray(model.projects)
          ? model.projects
          : [model.projects],
      },
      startDate: DateUtils.dateToBackend(model.start),
      endDate: DateUtils.dateToBackend(model.end),
    };

    const reportResponse = await ReportService.create_report_automatic(report);
    if (!reportResponse.getStatus()) return;
    downloadReport(reportResponse.getOne());
    setIsOpen(false);
    loading.value = false;
    form.reset();
  };

  const downloadReport = async (urlObj: { url: string }) => {
    if (!urlObj?.url) {
      ToastManager.error(t('form.report.errorUrl'));
      return;
    }

    const url = urlObj.url;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition'); // Extraer nombre desde Content-Disposition si existe
      let filename = 'Report.pdf';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (match?.[1]) {
          filename = match[1].replace(/['"]/g, ''); // limpia comillas si vienen
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      ToastManager.success(
        `${t('form.report.title')} ${filename} ${t('form.report.download_file_success')}`
      );
    } catch (error) {
      ToastManager.error(t('form.report.download_file_error'));
    }
  };

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-report-automatic-close'
          label='cancel'
          type='button'
          onClick={() => setIsOpen(false)}
          icon='041'
          disabled={loading.value}
        />
        <Button
          name='btn-report-automatic-save'
          type='submit'
          label='save'
          form='form-report-automatic-create'
          icon='041'
          disabled={loading.value}
        />
      </div>
    ),
    []
  );

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <div className='flex flex-row justify-between items-center'>
        <div className='h-6 w-px bg-b-light-dark dark:bg-gray-700 mx-2' />
        <Button
          name='group-none-filter'
          onClick={() => setIsOpen(!isOpen)}
          icon='306'
          square
          transparent
          borderless
        />
      </div>
      {isOpen && (
        <Modal
          name='report-automatic-modal'
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title={t('form.report.title_automatic')}
          width='min-w-[800px]'
          header={<h3>{t('form.report.title_automatic')}</h3>}
          footer={footerContent}
        >
          <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
            <Form
              onSubmit={onSubmit}
              initialValues={() => {}}
              render={({ handleSubmit }) => {
                return (
                  <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                    id='form-report-automatic-create'
                    onKeyDown={preventKeyDown}
                  >
                    <Field<IOption> name='projects'>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          meta={meta}
                          id='select-projects'
                          icon='191'
                          label='h_projects'
                          options={projects.value}
                          menuPortalTarget={document.body}
                          placeholder='p_select'
                          disabled={loading.value}
                        />
                      )}
                    </Field>
                    <div className='flex flex-col justify-center border-t dark:border-t-light-dark py-2'>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='col-span-1'>
                          <Field<string> name='title'>
                            {({ input, meta }) => (
                              <Input
                                {...input}
                                placeholder='h_title'
                                label='h_title'
                                meta={meta}
                                icon='120'
                                type='text'
                                disabled={loading.value}
                              />
                            )}
                          </Field>
                        </div>
                        <div className='col-span-1'>
                          <Field<string> name='subtitle'>
                            {({ input, meta }) => (
                              <Input
                                {...input}
                                placeholder='h_subtitle'
                                label='h_subtitle'
                                meta={meta}
                                icon='120'
                                type='text'
                                disabled={loading.value}
                              />
                            )}
                          </Field>
                        </div>
                        <div className='col-span-1'>
                          <Field<string> name='description'>
                            {({ input, meta }) => (
                              <Input
                                {...input}
                                placeholder='h_description'
                                label='h_description'
                                meta={meta}
                                icon='120'
                                type='text'
                                disabled={loading.value}
                              />
                            )}
                          </Field>
                        </div>
                        <div className='col-span-1'>
                          <Field<IOption> name='period'>
                            {({ input, meta }) => (
                              <SmartSelector
                                {...input}
                                meta={meta}
                                id='select-period'
                                icon='191'
                                label='h_period'
                                options={periods.value}
                                menuPortalTarget={document.body}
                                placeholder='p_select'
                                disabled={loading.value}
                              />
                            )}
                          </Field>
                        </div>
                        <div class='col-span-1'>
                          <DateField name='start' label='h_date_start' />
                        </div>
                        <div class='col-span-1'>
                          <DateField name='end' label='h_date_end' />
                        </div>
                      </div>
                    </div>
                  </form>
                );
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
