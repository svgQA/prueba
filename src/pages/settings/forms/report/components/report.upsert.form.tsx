import { useEffect, useMemo, useState } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ReportService } from '@/services/form/reports';
import { IReportRequest } from '@/types/form/service';
import { GeneralService } from '@/services/general/general';
import { ModuleService } from '@/services/general/module';
import { ContractService } from '@/services/shift/contract';
import { MultiSelect } from '../../create/MultiSelect';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { Button } from '@/components/common/button/button';
import { ReportUpsertFormProps } from '../utils/interface';

export const periodOptions = [
    { label: 'Diario', value: 'DAILY' },
    { label: 'Semanal', value: 'WEEKLY' },
    { label: 'Mensual', value: 'MONTHLY' },
    { label: 'Trimestral', value: 'QUARTERLY' },
    { label: 'Anual', value: 'YEARLY' },
];

const ReportUpsertForm = ({ initialData = {}, onSaved }: ReportUpsertFormProps) => {
    const [loading, setLoading] = useState(false);
    const [smartGroups, setSmartGroups] = useState<{ id: number; name: string }[]>([]);
    const [modules, setModules] = useState<{ id: number; name: string }[]>([]);
    const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetchSmartGroups();
        fetchModules();
        fetchProjects();
    }, []);

    const fetchSmartGroups = async () => {
        const res = await GeneralService.getSmartGroups();
        if (res.getStatus()) setSmartGroups(res.getMany());
    };
    const fetchModules = async () => {
        const res = await ModuleService.getModules('REPORT');
        if (res.getStatus()) {
            const mapped = res.getMany().map((m: any) => ({ id: m.id, name: m.title || m.name }));
            setModules(mapped);
        }
    };
    const fetchProjects = async () => {
        const res = await ContractService.getSimpleList();
        if (res.getStatus()) {
            const mapped = res.getMany().map((p: any) => ({ id: p.value, name: p.label }));
            setProjects(mapped);
        }
    };

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

    const handleSubmit = async (values: any, form: any) => {
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
        try {
            let response;
            if (isEdit && initialData.id) {
                response = await ReportService.update_report(payload, initialData.id);
            } else {
                response = await ReportService.create_report(payload);
            }
            if (response.getStatus()) {
                ToastManager.success(isEdit ? 'Reporte actualizado' : 'Reporte creado');
                onSaved && onSaved();
            } else {
                ToastManager.error('Error al guardar el reporte');
            }
        } catch (e) {
            ToastManager.error('Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design">
            <Form
                onSubmit={handleSubmit}
                initialValues={initialValues}
                mutators={{
                    ...arrayMutators,
                }}
                render={({ handleSubmit, values, form, submitting }) => (
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
                                        options={periodOptions}
                                        value={periodOptions.find((opt) => opt.value === input.value) || undefined}
                                        onChange={(opt) => input.onChange(opt?.value)}
                                        placeholder="Selecciona un periodo"
                                        label="Periodo"
                                        disabled={loading}
                                        meta={meta}
                                    />
                                )}
                            </Field>
                            <Field name="smart_groups">
                                {({ input, meta }) => (
                                    <MultiSelect
                                        options={smartGroups}
                                        selectedIds={input.value || []}
                                        onChange={input.onChange}
                                        getLabel={(item) => item.name}
                                        getId={(item) => item.id}
                                        placeholder="Selecciona uno o más grupos inteligentes"
                                    />
                                )}
                            </Field>
                            <Field name="extraData.modules">
                                {({ input, meta }) => (
                                    <MultiSelect
                                        options={modules}
                                        selectedIds={input.value?.map((m: any) => m.id) || []}
                                        onChange={(selectedIds) => {
                                            const selected = modules.filter((m) => selectedIds.includes(m.id));
                                            input.onChange(selected);
                                        }}
                                        getLabel={(item) => item.name}
                                        getId={(item) => item.id}
                                        placeholder="Selecciona uno o más módulos"
                                    />
                                )}
                            </Field>
                            <Field name="extraData.projects">
                                {({ input, meta }) => (
                                    <MultiSelect
                                        options={projects}
                                        selectedIds={input.value?.map((p: any) => p.id) || []}
                                        onChange={(selectedIds) => {
                                            const selected = projects.filter((p) => selectedIds.includes(p.id));
                                            input.onChange(selected);
                                        }}
                                        getLabel={(item) => item.name}
                                        getId={(item) => item.id}
                                        placeholder="Selecciona uno o más proyectos"
                                    />
                                )}
                            </Field>
                            <div className="md:col-span-3">
                                <Field name="extraData.emails">
                                    {({ input, meta }) => (
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