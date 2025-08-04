import { useState, useEffect, useCallback } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ReportService } from '@/services/form/reports';
import { Input } from '@/components/common/input/input';
import { useNavigation } from '@/utils/utilities/navigation';
import { useSignal } from '@preact/signals';
import { periodOptions } from '../utils/report.data';
import { IOption } from '@/components/common/multi/interface';
import { IModuleReport, IReport, modulesReport } from '@/types/form';
import { useUserStore } from '@/store/slices';
import { ServiceService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { MultiSelect } from '../../create/MultiSelect';
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';
import { MultipleInput } from '@/components/common/multi/multi';

const ReportUpsertForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { selectedCompany } = useUserStore();
  const { navigateUpsert } = useNavigation();

  const loading = useSignal<boolean>(false);
  const modules = useSignal<IOption[]>([]);
  const projects = useSignal<IOption[]>([]);
  const periods = useSignal<IOption[]>(periodOptions);
  const emails = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<any>({});


  useEffect(() => {
    fetchInitialValues();
  }, [id, modules.value, projects.value, periods.value]);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices()]);
      modules.value = Object.values(modulesReport).map((mod, index) => ({
        label: mod,
        value: index,
      }));
    }
  }, [selectedCompany]);

  const fetchInitialValues = async () => {
    if (!id) return;
    const response = await ReportService.get_report_by_id(Number(id));
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      title: initialData.title,
      subtitle: initialData.subtitle,
      description: initialData.description,
      period: periods.value.find((opt) => opt.label === initialData.period), // <-- esto está correcto
      modules: initialData.extraData?.modules
        ? initialData.extraData.modules.map((mod: any) =>
          modules.value.find((opt) => opt.value === mod.id)
        )
        : [],
      projects:
        initialData.extraData?.projects &&
          initialData.extraData?.projects.length > 0
          ? projects.value.find(
            (opt) => opt.value === initialData.extraData?.projects[0].value
          )
          : null,
      emails: initialData.extraData?.emails,
    });
  };

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (!request.getStatus()) return;
    projects.value = request.getMany();
  }, []);

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;
    const selectedModules: IModuleReport[] = Array.isArray(model.modules)
      ? model.modules.map((mod: IOption) => ({
        name: mod.label,
        id: mod.value,
      }))
      : model.modules
        ? [{ name: model.modules.label, id: model.modules.value }]
        : [];

    let report: IReport = {
      title: model.title,
      subtitle: model.subtitle,
      description: model.description,
      period: model.period.label,
      extraData: {
        modules: selectedModules,
        projects: Array.isArray(model.projects)
          ? model.projects
          : [model.projects],
        emails: model.emails.map((email: IOption) => email.label)
      },
    };

    let response = id
      ? await ReportService.update_report(report, Number(id))
      : await ReportService.create_report(report);
    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    navigateUpsert('/forms/report');
    loading.value = false;
  };

  const getEmailsService = async (id: string) => {
    const service = await ServiceService.getServiceById(id);
    if (!service.getStatus()) return;
    const serviceData = service.getOne();
    if (!serviceData.contract?.client?.email) return;
    emails.value = [
      {
        label: serviceData.contract.client.email,
        value: serviceData.contract.client.id,
      },
    ];
    setInitialValues({ emails: emails.value, ...initialValues });
  }

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        mutators={{
          ...arrayMutators,
        }}
        render={({ handleSubmit, form, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-report-automatic-create-update'
            onKeyDown={preventKeyDown}
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting}
              pristine={true}
              form='form-report-automatic-create-update'
              label={id ? 'edit' : 'save'}
            />
            <div className='flex flex-col justify-center border-t dark:border-t-light-dark py-2'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='col-span-1'>
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
                        onChange={(option?: IOption) => {
                          input.onChange(option);
                          if (option && option.value) {
                            getEmailsService(String(option.value));
                          }
                        }}
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <label
                    htmlFor={`${id}-input`}
                    className='capitalize block text-sm font-medium'
                  >
                    {t('h_modules')}
                  </label>
                  <Field<IOption[]> name='modules'>
                    {({ input }) => (
                      <MultiSelect
                        options={modules.value}
                        placeholder={t('p_select')}
                        selectedIds={
                          Array.isArray(input.value)
                            ? input.value.map((opt: IOption) => opt.value)
                            : []
                        }
                        getLabel={(option: IOption) => option.label}
                        getId={(option: IOption) => option.value}
                        onChange={(selectedIds: (string | number)[]) => {
                          const selectedOptions = modules.value.filter((opt) =>
                            selectedIds.includes(opt.value)
                          );
                          input.onChange(selectedOptions);
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>

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
                <div className='col-span-1'>
                  <Field<IOption[]> name='emails'>
                    {({ input, meta }) => (
                      <MultipleInput
                        meta={meta}
                        name='input-emails'
                        value={input.value || []}
                        onChange={(value: IOption[], _name?: string) => {
                          input.onChange(value);
                        }}
                        placeholder='p_select'
                        label='h_emails'
                        buttonIcon='044'
                        icon='086'
                        bottom
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
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default ReportUpsertForm;
