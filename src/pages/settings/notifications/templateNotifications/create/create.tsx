import { useState, useEffect } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { TemplateServiceFront } from '@/services/notification/template';
import { FormService } from '@/services/form/form';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '@/pages/settings/store/settings';
import { toast } from 'react-toastify';
import { TaskService } from '@/services';

export const TemplateCreateForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useForm, setUseForm] = useState(false);
  const [formId, setFormId] = useState('');
  const [useTasks, setUseTasks] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [forms, setForms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]); // ✅ Tareas
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

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.warning('Título y descripción son obligatorios');
      return;
    }

    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      data: {},
    };

    if (useForm && formId) payload.data.formId = formId;
    if (useTasks && taskId) payload.data.taskId = taskId;

    setLoading(true);
    const res = await TemplateServiceFront.createTemplate(payload);
    setLoading(false);

    if (res.getStatus()) {
      toast.success('Plantilla creada exitosamente');
      redirectToList();
    } else {
      toast.error('Error al crear plantilla');
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      const res = await FormService.getBasicForms();
      if (res.getStatus()) setForms(res.getMany());
    };

    if (useForm && forms.length === 0) {
      fetchForms();
    }
  }, [useForm]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await TaskService.getBasicTasks();
      if (res.getStatus()) setTasks(res.getMany());
    };

    if (useTasks && tasks.length === 0) {
      fetchTasks();
    }
  }, [useTasks]);

  return (
    <div className='w-full px-4 sm:px-6'>
      <form className='space-y-6 w-full'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Título <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={title}
            onInput={(e) => setTitle(e.currentTarget.value)}
            className='mt-1 w-full border rounded px-3 py-2'
            placeholder='Ingrese el título de la plantilla...'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Descripción <span className='text-red-500'>*</span>
          </label>
          <textarea
            value={description}
            onInput={(e) => setDescription(e.currentTarget.value)}
            className='mt-1 w-full border rounded px-3 py-2'
            placeholder='Ingrese una descripción...'
            rows={4}
            required
          />
        </div>

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
                className='toggle'
              />
            </div>
            <select
              disabled={!useForm}
              className='w-full border rounded px-3 py-2'
              value={formId}
              onChange={(e) => setFormId(e.currentTarget.value)}
            >
              <option value=''>Seleccione un formulario...</option>
              {forms.map((form) => (
                <option key={form.value} value={form.value}>
                  {form.label}
                </option>
              ))}
            </select>
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
                className='toggle'
              />
            </div>
            <div className='flex gap-2'>
              <select
                disabled={!useTasks}
                className='w-full border rounded px-3 py-2'
                value={taskId}
                onChange={(e) => setTaskId(e.currentTarget.value)}
              >
                <option value=''>Seleccione una tarea...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.description}
                  </option>
                ))}
              </select>

              <button
                type='button'
                disabled={!useTasks}
                className='bg-gray-200 px-3 rounded text-xl'
                title='Agregar tarea'
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4 pt-4'>
          <Button
            name='cancel-template'
            label={'Cancelar'}
            className='bg-white text-grey p-2'
            onClick={redirectToList}
          />
          <Button
            name='create-template'
            label={loading ? 'Creando...' : 'Crear Plantilla'}
            className='bg-primary text-white p-2'
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};
