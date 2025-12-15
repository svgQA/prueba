import { useState, useEffect } from 'preact/hooks';
import { Field, Form } from 'react-final-form';
// import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { TemplateService } from '@/services';
import { FormService } from '@/services/form/form';
import { TaskService } from '@/services';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '@/utils/hooks/store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TaskFormCreate } from '@/pages/settings/shifts/task/create/task.form';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
import { useSignal } from '@preact/signals';
import { useUserStore } from '@/store/slices';
import { lengthSize } from '@/utils/utilities/validate';
import { Section } from '@/components/common/section/section';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useTranslation } from 'react-i18next';

export const TemplateCreateForm = () => {
  const { t } = useTranslation();
  const [useForm, _setUseForm] = useState(false);
  const [useTasks, _setUseTasks] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const loading = useSignal<boolean>(false);
  const [_, navigate] = useLocation();

  const redirectToList = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notification.template.to,
      label: 'notificaciones',
      id: 'template-notifications',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  const handleSubmit = async (values: any) => {
    loading.value = true;
    const rawTasks = Array.isArray(tasksResponse.value)
      ? tasksResponse.value
      : [];

    const mappedTasks = rawTasks.map((t: any) => {
      if (typeof t !== 'object' || !t.name) return t; // puede ser un ID o algo ya válido

      return {
        ...t,
        formId: t.formId?.value ?? t.formId ?? undefined,
        type: t.type?.value ?? t.type ?? undefined,
        attachmentType:
          t.attachmentType?.value ?? t.attachmentType ?? undefined,
      };
    });

    const output = {
      ...values,
      tasks: mappedTasks,
    };

    const result = await TemplateService.createTemplate(output);

    if (!result.getStatus()) {
      ToastManager.error('s_created_error');
      return;
    }

    ToastManager.success('s_send_success');
    redirectToList();
    loading.value = false;
  };

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    const fetchForms = async () => {
      loading.value = true;
      const res = await FormService.getSimpleList();
      if (res.getStatus()) setForms(res.getMany());
      loading.value = false;
    };
    if (useForm && forms.length === 0 && selectedCompany) fetchForms();
  }, [useForm, selectedCompany]);

  useEffect(() => {
    const fetchTasks = async () => {
      loading.value = true;
      const res = await TaskService.getSimpleList();
      if (res.getStatus()) setTasks(res.getMany());
      loading.value = false;
    };
    if (useTasks && tasks.length === 0 && selectedCompany) fetchTasks();
  }, [useTasks, selectedCompany]);

  const tasksResponse = useSignal<ITask[]>([]);
  const onTaskAdd = (model: any) => {
    tasksResponse.value = [...tasksResponse.value, model];
  };

  const onTaskDelete = (id: string) => {
    tasksResponse.value = tasksResponse.value.filter((task) => task.id !== id);
  };

  return (
    <Section className='pt-2 px-4 sm:px-8 lg:px-20 xl:px-40'>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            className='space-y-6 w-full'
            onSubmit={handleSubmit}
            id='form-template-create'
          >
            <StatusButton
              onClickClean={() => {
                () => form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-template-create'
              label={'save'}
            />
            {/*
            <div className='flex justify-end gap-4 absolute top-14 right-2'>
              <Button
                name='cancel-create-scheduled'
                label={t('cancel')}
                icon='192'
                onClick={redirectToList}
              />
              <Button
                name='submit-create-scheduled'
                label={t('save')}
                type='submit'
                icon='146'
                disabled={loading.value}
              />
            </div>
            */}

            <Field<string> name='title' validate={lengthSize(5, 50)}>
              {({ input, meta }) => (
                <Input
                  name='title'
                  id='template-title'
                  label={`${t('title')} *`}
                  meta={meta}
                  placeholder={t('p_template_title')}
                  value={input.value || ''}
                  onChange={input.onChange}
                  required
                />
              )}
            </Field>

            <Field<string> name='description' validate={lengthSize(5, 200)}>
              {({ input, meta }) => (
                <TextArea
                  name='description'
                  id='template-description'
                  label={`${t('description')} *`}
                  meta={meta}
                  className='resize-none'
                  rows={2}
                  placeholder={t('p_template_desc')}
                  value={input.value || ''}
                  onChange={input.onChange}
                  required
                />
              )}
            </Field>

            <div>
              <h3 className='text-md font-semibold mb-2'>{t('content')}</h3>
              <TaskFormCreate
                onSubmit={onTaskAdd}
                taskList={tasksResponse.value}
                add
                selector
                onDelete={onTaskDelete}
                type='REPORT'
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
