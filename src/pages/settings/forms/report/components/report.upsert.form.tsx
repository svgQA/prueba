import { useCallback, useEffect, useMemo } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ReportService } from '@/services/form/reports';
import { Input } from '@/components/common/input/input';
import { ReportUpsertFormProps } from '../utils/interface';
import { useNavigation } from '@/utils/utilities/navigation';
import { useSignal } from '@preact/signals';
import { periodOptions } from '../utils/report.data';
import { IOption } from '@/components/common/multi/interface';
import { IModuleReport, IReport, modulesReport } from '@/types/form';
import { DateField } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { useUserStore } from '@/store/slices';
import { ServiceService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';

const ReportUpsertForm = ({ initialData = {}, onSaved }: ReportUpsertFormProps) => {
    const { selectedCompany } = useUserStore();

    const modules = useSignal<IOption[]>([]);
    const projects = useSignal<IOption[]>([]);
    const periods = useSignal<IOption[]>(periodOptions);
    const { navigateUpsert } = useNavigation();
    const isEdit = Boolean(initialData && initialData.id);
    const loading = useSignal<boolean>(false);

    const initialValues = useMemo(() => ({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        period: initialData.period || '',
        companyId: initialData.companyId || '',
        smart_groups: initialData.extraData?.smart_groups || [],
        extraData: {
            modules: initialData.extraData?.modules || [],
            projects: initialData.extraData?.projects || [],
            emails: initialData.extraData?.emails || [],
        },
    }), [initialData]);

    useEffect(() => {
        if (selectedCompany) {
            Promise.all([getServices()]);
            modules.value = Object.values(modulesReport).map((mod, index) => ({ label: mod, value: index }));
        }
    }, [selectedCompany]);

    const getServices = useCallback(async () => {
        const request = await ServiceService.getServicesSimpleList();
        if (!request.getStatus()) return;
        projects.value = request.getMany();
    }, []);

    const handleSubmit = async (model: any, _form?: any) => {
        loading.value = true;
        const selectedModules: IModuleReport[] = model.modules?.map((mod: IOption) => ({ name: mod.label, id: mod.value }));

        let report: IReport = {
            title: model.title,
            subtitle: model.subtitle,
            description: model.description,
            period: model.period.label,
            extraData: {
                modules: selectedModules,
                projects: Array.isArray(model.projects) ? model.projects : [model.projects],
            },
            date: DateUtils.dateToBackend(model.date),
        }

        let response = (isEdit && initialData.id) ?
            await ReportService.update_report(report, initialData.id) :
            await ReportService.create_report(report);
        if (!response.getStatus()) return;
        ToastManager.success((isEdit && initialData.id) ? 's_updated_success' : 's_created_success');
        navigateUpsert('/forms/report');
        onSaved && onSaved();
        loading.value = false;
    };

    const preventKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }, []);

    return (
        <div className="px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design">
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
                            label={initialData.id ? 'edit' : 'save'}
                        />
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
                        <Field<IOption> name='modules'>
                            {({ input, meta }) => (
                                <SmartSelector
                                    {...input}
                                    meta={meta}
                                    id='select-projects'
                                    icon='191'
                                    label='h_modulos'
                                    options={modules.value}
                                    menuPortalTarget={document.body}
                                    placeholder='p_select'
                                    disabled={loading.value}
                                    multiple={true}
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
                                    <DateField name='date' label='h_date' />
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            />
        </div >
    );
};

export default ReportUpsertForm; 