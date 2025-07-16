import { useState, useEffect } from 'preact/hooks';
import { Field, Form } from 'react-final-form';
import { Button } from '@/components/common/button/button';
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
import { required } from '@/utils/utilities/validate';

export const TemplateCreateForm = () => {
  const [useForm, _setUseForm] = useState(false);
  const [useTasks, _setUseTasks] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, _setLoading] = useState(false);
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
    const output = {
      ...values,
      tasks: Array.isArray(tasksResponse.value) ? tasksResponse.value : [],
    };

    const result = await TemplateService.createTemplate(output);
    if (!result.getStatus()) {
      ToastManager.error('s_created_error');
      return;
    }

    ToastManager.success('s_send_success');
    redirectToList();
  };

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    const fetchForms = async () => {
      const res = await FormService.getSimpleList();
      if (res.getStatus()) setForms(res.getMany());
    };
    if (useForm && forms.length === 0 && selectedCompany) fetchForms();
  }, [useForm, selectedCompany]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await TaskService.getSimpleList();
      if (res.getStatus()) setTasks(res.getMany());
    };
    if (useTasks && tasks.length === 0 && selectedCompany) fetchTasks();
  }, [useTasks, selectedCompany]);

  const tasksResponse = useSignal<ITask[]>([]);
  const onTaskAdd = (model: any) => {
    tasksResponse.value = [...tasksResponse.value, model];
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, values }) => (
          <form className='space-y-6 w-full' onSubmit={handleSubmit}>
            <div className='flex justify-end gap-4 absolute top-14 right-2'>
              <Button
                name='cancel-create-scheduled'
                label='cancel'
                icon='023'
                onClick={redirectToList}
              />
              <Button
                name='submit-create-scheduled'
                label='save'
                type='submit'
                icon='022'
                disabled={loading}
              />
            </div>

            <Field<string> name='title' validate={required}>
              {({ input, meta }) => (
                <Input
                  name='title'
                  id='template-title'
                  label='Título *'
                  meta={meta}
                  placeholder='Ingrese el título de la plantilla...'
                  value={input.value || ''}
                  onChange={input.onChange}
                  required
                />
              )}
            </Field>

            <Field<string> name='description' validate={required}>
              {({ input, meta }) => (
                <TextArea
                  name='description'
                  id='template-description'
                  label='Descripción *'
                  meta={meta}
                  placeholder='Ingrese una descripción...'
                  value={input.value || ''}
                  onChange={input.onChange}
                  required
                />
              )}
            </Field>

            <div>
              <h3 className='text-md font-semibold mb-2'>Contenido</h3>
              <TaskFormCreate
                onSubmit={onTaskAdd}
                taskList={tasksResponse.value}
                add
                selector
                type='REPORT'
              />
            </div>
          </form>
        )}
      />
    </>
  );
};
