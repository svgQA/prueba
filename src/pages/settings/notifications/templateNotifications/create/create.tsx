import { useState, useEffect } from 'preact/hooks';
import { Form } from 'react-final-form';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { TemplateService } from '@/services';
import { FormService } from '@/services/form/form';
import { TaskService } from '@/services';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '@/pages/settings/store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TaskFormCreate } from '@/pages/settings/shifts/task/create/task.form';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
import { useSignal } from '@preact/signals';

export const TemplateCreateForm = () => {
  const [useForm, _setUseForm] = useState(false);
  const [useTasks, _setUseTasks] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, _setLoading] = useState(false);
  const [_, navigate] = useLocation();

  const redirectToList = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification
        .to,
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
  
    console.log('🟢 Payload para backend:', output);
  
    const result = await TemplateService.createTemplate(output);
    if (!result.getStatus()) {
      ToastManager.error('s_created_error');
      return;
    }
  
    ToastManager.success('s_send_success');
  };
  
  useEffect(() => {
    const fetchForms = async () => {
      const res = await FormService.getSimpleList();
      if (res.getStatus()) setForms(res.getMany());
    };
    if (useForm && forms.length === 0) fetchForms();
  }, [useForm]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await TaskService.getSimpleList();
      if (res.getStatus()) setTasks(res.getMany());
    };
    if (useTasks && tasks.length === 0) fetchTasks();
  }, [useTasks]);

  const tasksResponse = useSignal<ITask[]>([]);
  const onTaskAdd = (model: any) => {
    tasksResponse.value = [...tasksResponse.value, model];
  };

  return (
    <div className='w-full px-4 sm:px-6'>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, values }) => (
          <form className='space-y-6 w-full' onSubmit={handleSubmit}>
            <Input
              name='title'
              id='template-title'
              label='Título *'
              placeholder='Ingrese el título de la plantilla...'
              value={values.title || ''}
              onChange={(e) => (values.title = e.currentTarget.value)}
              required
            />

            <TextArea
              name='description'
              id='template-description'
              label='Descripción *'
              placeholder='Ingrese una descripción...'
              value={values.description || ''}
              onChange={(e) => (values.description = e.currentTarget.value)}
              required
            />

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

            <div className='flex justify-end gap-4 pt-4'>
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
          </form>
        )}
      />
    </div>
  );
};
