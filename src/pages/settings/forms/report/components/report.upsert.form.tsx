import { useMemo, useState } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ReportService } from '@/services/form/reports';
import { IReportRequest } from '@/types/form/service';
import { MultiSelect } from '../../create/MultiSelect';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { Button } from '@/components/common/button/button';
import { ReportUpsertFormProps } from '../utils/interface';
import { useNavigation } from '@/utils/utilities/navigation';
import { IModuleReport, IProjectsReport } from '@/types/form';
import { useSignal } from '@preact/signals';
import { periodOptions, reportModuleOptions, reportProjectOptions } from '../utils/report.data';
import { IOption } from '@/components/common/multi/interface';

const ReportUpsertForm = ({ initialData = {}, onSaved }: ReportUpsertFormProps) => {
    const [loading, setLoading] = useState(false);
    const modules = useSignal<IModuleReport[]>(reportModuleOptions);
    const projects = useSignal<IProjectsReport[]>(reportProjectOptions);
    const periods = useSignal<IOption[]>(periodOptions);
    const { navigateUpsert } = useNavigation();
    const isEdit = Boolean(initialData && initialData.id);

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

    const handleSubmit = async (values: any, _form?: any) => {
        setLoading(true);
        const payload: IReportRequest = {
            ...values,
            companyId: values.companyId,
            smart_groups: values.smart_groups,
            extraData: {
                modules: values.extraData.modules,
                projects: values.extraData.projects,
                emails: values.extraData.emails,
            },
        };

        let response = (isEdit && initialData.id) ?
            await ReportService.update_report(payload, initialData.id) :
            await ReportService.create_report(payload);
        if (!response.getStatus()) return;
        ToastManager.success((isEdit && initialData.id) ? 's_updated_success' : 's_created_success');
        navigateUpsert('/forms/report');
        onSaved && onSaved();
        setLoading(false);
    };

    return (
        <div className="px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design">
            <Form
                onSubmit={handleSubmit}
                initialValues={initialValues}
                mutators={{
                    ...arrayMutators,
                }}
                render={({ handleSubmit }) => (
                    <form id="form-report-create-update" onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field name="title">
                                {({ input, meta }) => (
                                    <Input {...input} type="text" label="Título *" required disabled={loading} error={meta.touched && meta.error} />
                                )}
                            </Field>
                            <Field name="subtitle">
                                {({ input, meta }) => (
                                    <Input {...input} type="text" label="Subtítulo" disabled={loading} error={meta.touched && meta.error} />
                                )}
                            </Field>
                            <Field name="period">
                                {({ input, meta }) => (
                                    <SmartSelector
                                        {...input}
                                        options={periods.value}
                                        value={periods.value.find((opt) => opt.value === input.value)}
                                        onChange={(opt) => input.onChange(opt?.value)}
                                        placeholder="Selecciona un periodo"
                                        label="Periodo"
                                        disabled={loading}
                                        meta={meta}
                                    />
                                )}
                            </Field>
                            <Field name="extraData.modules">
                                {({ input }) => (
                                    <MultiSelect
                                        options={modules.value.map((m: any) => ({ value: m.id, label: m.name }))}
                                        selectedIds={input.value?.map((m: any) => m.id) || []}
                                        onChange={(selectedIds) => {
                                            const selected = modules.value.filter((m: any) => selectedIds.includes(m.id));
                                            input.onChange(selected);
                                        }}
                                        getLabel={(item) => item.label}
                                        getId={(item) => item.value}
                                        placeholder="Selecciona uno o más módulos"
                                    />
                                )}
                            </Field>
                            <Field name="extraData.projects">
                                {({ input }) => (
                                    <MultiSelect
                                        options={projects.value.map((p: any) => ({ value: p.id, label: p.name }))}
                                        selectedIds={input.value?.map((p: any) => p.id) || []}
                                        onChange={(selectedIds) => {
                                            const selected = projects.value.filter((p) => selectedIds.includes(p.id));
                                            input.onChange(selected);
                                        }}
                                        getLabel={(item) => item.label}
                                        getId={(item) => item.value}
                                        placeholder="Selecciona uno o más proyectos"
                                    />
                                )}
                            </Field>
                            <div className="md:col-span-3">
                                <Field name="extraData.emails">
                                    {({ input }) => (
                                        <MultiSelect
                                            options={(input.value || []).map((e: string) => ({ id: e, name: e }))}
                                            selectedIds={input.value || []}
                                            onChange={input.onChange}
                                            getLabel={(item: { id: string; name: string }) => item.name}
                                            getId={(item: { id: string; name: string }) => item.id}
                                            placeholder="Agrega uno o más correos (escribe y presiona enter)"
                                        />
                                    )}
                                </Field>
                            </div>
                            <div className="md:col-span-3">
                                <Field name="description">
                                    {({ input, meta }) => (
                                        <TextArea
                                            {...input}
                                            type="text"
                                            label="Descripción"
                                            rows={3}
                                            disabled={loading}
                                            error={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button
                                name='btn-submit'
                                type="submit"
                                className="btn btn-primary w-full"
                                label={isEdit ? 'Editar' : 'Guardar'}
                                disabled={loading}
                            />
                        </div>
                    </form>
                )}
            />
        </div >
    );
};

export default ReportUpsertForm; 