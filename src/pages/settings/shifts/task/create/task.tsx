import { Signal, useSignal } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { FormService, TaskService } from '@/services';
import { IOption } from '@/components/common/multi/interface';
import { DateUtils } from '@/utils/utilities/dates';
import { useTranslation } from 'react-i18next';
import { TaskFormCreate } from './task.form';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';
interface FormData {
  name: string;
  description: string;
  formId: IOption;
  hourStart: string;
  attachmentType: IOption;
  type: IOption;
}

export const TaskCreateSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const forms = useSignal<IOption[]>([]);

  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (model: Record<string, any>) => {
    const output = {
      name: model.name,
      description: model.description,
      formId: model.formId?.value || undefined,
      hourStart: DateUtils.createDateFromHourBackend(model.hourStart),
      type: model.type?.value || undefined,
    };

    if (id) {
      const request = await TaskService.updateTask(output, id);
      if (!request.getStatus()) return;
      ToastManager.success('s_updated_success');
    } else {
      const request = await TaskService.createTask(output);
      if (!request.getStatus()) return;
      ToastManager.success('s_created_success');
    }
    go({
      to: '/shifts/task',
      label: 'm_task',
      id: 'shift:tasks:state',
      base: 'setting',
    });
  };

  const setInitialValues = useCallback(async () => {
    if (!id) return;

    const request = await TaskService.getTaskById(id);
    if (!request.getStatus()) return;
    const task = request.getOne();

    const form = task.formId
      ? forms.value.find((_f) => _f.value === task.formId)
      : undefined;
    initialValues.value = {
      ...task,
      hourStart: DateUtils.hourToFrontend(task.hourStart),
      formId: form,
      type: {
        value: task.type,
        label: task.type,
      },
    };
  }, [id]);

  const getFormsHandler = async () => {
    const response = await FormService.getSimpleList();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const fetchData = async () => {
    await getFormsHandler();
    await setInitialValues();
  };

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchData();
    }
  }, [selectedCompany, location]);

  return (
    <Section className='pt-2 px-40'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='text-2xl font-bold text-primary'>{t('l_new_task')}</h1>
        </div>
      </div>
      <div className='flex flex-col justify-center mt-16'>
        <TaskFormCreate onSubmit={onSubmit} forms={forms.value} append />
      </div>
    </Section>
  );
};
