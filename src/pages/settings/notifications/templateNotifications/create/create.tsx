import { useState, useEffect } from 'preact/hooks';
import { Form } from 'react-final-form';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { TemplateService } from '@/services';
import { FormService } from '@/services/form/form';
import { TaskService } from '@/services';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '@/pages/settings/store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';

export const TemplateCreateForm = () => {
  const [useForm, setUseForm] = useState(false);
  const [useTasks, setUseTasks] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    const { title, description, formId, taskSelector } = values;

    if (!title?.trim() || !description?.trim()) {
      ToastManager.warning('s_title_and_sub_required');
      return;
    }

    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      data: {},
    };

    if (useForm && formId) payload.data.formId = formId;
    if (useTasks && taskSelector?.value)
      payload.data.taskId = taskSelector.value;

    setLoading(true);
    const res = await TemplateService.createTemplate(payload);
    setLoading(false);

    if (res.getStatus()) {
      ToastManager.success('s_created_success');
      redirectToList();
    } else {
      ToastManager.error('s_deleted_error');
    }
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

              <div className='border rounded p-4 mb-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium flex items-center gap-2'>
                    <span className='vox-icon vx-icon-168 text-base' />
                    Agregar Formulario
                  </span>
                  <input
                    type='checkbox'
                    checked={useForm}
                    onChange={() => setUseForm(!useForm)}
                    className='h-4 w-4'
                  />
                </div>

                <SmartSelector
                  id='form-selector'
                  name='formId'
                  options={forms}
                  placeholder='Seleccione un formulario...'
                  disabled={!useForm}
                  onChange={(option) => {
                    values.formId = option?.value;
                  }}
                />
              </div>

              <div className='border rounded p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium flex items-center gap-2'>
                    <span className='vox-icon vx-icon-169 text-base' />
                    Agregar Tareas
                  </span>
                  <input
                    type='checkbox'
                    checked={useTasks}
                    onChange={() => setUseTasks(!useTasks)}
                    className='h-4 w-4'
                  />
                </div>

                <div className='flex gap-2 flex-col'>
                  <SmartSelector
                    id='task-selector'
                    name='taskSelector'
                    options={tasks.map((task) => ({
                      label: task.description,
                      value: task.id,
                    }))}
                    placeholder='Buscar tarea por descripción...'
                    disabled={!useTasks}
                    onChange={(option) => {
                      values.taskSelector = option;
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                name='cancel-template'
                label='Cancelar'
                className='bg-white text-grey p-2'
                onClick={redirectToList}
              />
              <Button
                name='create-template'
                label={loading ? 'Creando...' : 'Crear Plantilla'}
                className='bg-primary text-white p-2'
                type='submit'
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
