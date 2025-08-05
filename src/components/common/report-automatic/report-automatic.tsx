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
import { ServiceService } from '@/services';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { DateField } from '@/components/compose/forms';
import { modulesReport } from '@/types/form';
import { IOptionCheck, SelectCheck } from '../select-check';
import { fileManager } from '@/utils/network/file/file';

export const ReportAutomatic = ({ modules }: ReportAutomaticProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const loading = useSignal(false);
  const projects = useSignal<IOption[]>([]);
  const format = useSignal<IOptionCheck[]>([]);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices()]);
      getFormatOptions();
    }
  }, [selectedCompany]);

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (request.getStatus()) {
      projects.value = request.getMany();
    }
  }, []);

  const getFormatOptions = () => {
    format.value = [
      { value: 'pdf', label: 'PDF', icon: '306', color: 'primary' },
      { value: 'excel', label: 'Excel', icon: '307', color: 'secondary' },
    ];
  }

  const onSubmit = async (model: any, form: any) => {
    loading.value = true;

    let report: IReport = {
      title: model.title,
      subtitle: model.subtitle,
      description: model.description,
      extraData: {
        modules: [{ id: 1, name: modules }],
        projects: Array.isArray(model.projects)
          ? model.projects
          : [model.projects],
      },
      startDate: DateUtils.dateToBackend(model.start),
      endDate: DateUtils.dateToBackend(model.end),
    };

    let reportResponse = await (model.format === 'pdf'
      ? ReportService.create_report_automatic(report)
      : ReportService.create_report_automatic_excel(report));

    if (reportResponse.getStatus()) {
      const info: any = (model.format === 'pdf') ? reportResponse.getOne() : reportResponse.getMany();
      model.format === 'pdf'
        ? await fileManager.downloadFile(info)
        : await fileManager.generateExcel(info.map((item: any) => ({ header: item.name, data: item.table })), 'report');
      setIsOpen(false);
      form.reset();
    }

    loading.value = false;
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
          title={t('s_title_automatic')}
          width='min-w-[800px]'
          header={<h3>{modules === modulesReport.Memo ? t('s_title_history') : t('s_title')}</h3>}
          footer={footerContent}
        >
          <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
            <Form
              onSubmit={onSubmit}
              initialValues={() => { }}
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
                          label='h_service'
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
                        <div className='col-span-2'>
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
                        <div class='col-span-1'>
                          <DateField name='start' label='h_date_start' />
                        </div>
                        <div class='col-span-1'>
                          <DateField name='end' label='h_date_end' />
                        </div>
                        <div class='col-span-2'>
                          <Field<string>
                            name='format'
                            initialValue='pdf'
                          >
                            {({ input }) => (
                              <SelectCheck
                                {...input}
                                options={format.value}
                                label='h_format'
                                loading={loading.value}
                                onChange={(option: any) => {
                                  input.onChange(option.value);
                                }}
                              />
                            )}
                          </Field>
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
