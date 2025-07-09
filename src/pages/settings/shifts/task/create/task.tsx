import { Signal, useSignal } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { FormService, TaskService } from '@/services';
import { IOption } from '@/components/common/multi/interface';
import { DateUtils } from '@/utils/utilities/dates';
import { useTranslation } from 'react-i18next';
import { TaskFormCreate } from './task.form';

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
  const [_, navigate] = useLocation();
  const forms = useSignal<IOption[]>([]);

  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (model: Record<string, any>) => {
    // console.log(model);
    if (id) {
      const request = await TaskService.updateTask(model, id);
      if (!request.getStatus()) return;
      ToastManager.success('s_update_success');
    } else {
      const request = await TaskService.createTask(model);
      if (!request.getStatus()) return;
      ToastManager.success('s_created_success');
    }

    navigate('/rounds/task');
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

  useEffect(() => {
    Promise.all([getFormsHandler(), setInitialValues()]);
  }, []);

  return (
    <Section className='pt-2 px-40'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='text-2xl font-bold text-primary'>{t('l_new_task')}</h1>
        </div>
      </div>
      <div className='flex flex-col justify-center mt-16'>
        <TaskFormCreate
          onSubmit={onSubmit}
          forms={forms.value}
          initialValues={initialValues.value}
          append
        />
      </div>
    </Section>
  );
};
