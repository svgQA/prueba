import { FunctionComponent, useEffect, useState } from 'react';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { SchedulerServiceFront } from '@/services/schedule';
import { TemplateServiceFront } from '@/services/template';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { Table } from '@/components/common/table/table';
import { columns } from './components/scheduled.columns';
import { useSignal } from '@preact/signals';

export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const isLoading = useSignal(false);
  const [statusFilter, _] = useState<'pending' | 'sent' | 'failed' | 'all'>(
    'all'
  );
  const [templates, setTemplates] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    templateId: '',
    overrideTitle: '',
    overrideDescription: '',
    sendAt: '',
    repeatEveryMinutes: '',
    maxRepeats: '',
    repeatUntil: '',
  });

  useEffect(() => {
    document.title = 'VX - Scheduled Notifications';
    fetchNotifications();
  }, [statusFilter]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await TemplateServiceFront.getTemplates();
        if (response.getStatus()) setTemplates(response.getMany());
      } catch (error) {
        console.error('❌ Error al obtener plantillas:', error);
      }
    };
    fetchTemplates();
  }, []);

  const fetchNotifications = async () => {
    isLoading.value = true;
    try {
      const response = await SchedulerServiceFront.getAll(statusFilter);
      notifications.value = response.getMany();
    } catch (error) {
      console.error('❌ Error al obtener notificaciones programadas:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleCreateNotification = async () => {
    const {
      templateId,
      overrideTitle,
      overrideDescription,
      sendAt,
      repeatEveryMinutes,
      maxRepeats,
      repeatUntil,
    } = formData;

    if (!sendAt || (!templateId && (!overrideTitle || !overrideDescription))) {
      alert(
        'Debes completar los campos obligatorios o seleccionar una plantilla.'
      );
      return;
    }

    try {
      await SchedulerServiceFront.scheduleNotification({
        templateId,
        sendAt: new Date(sendAt),
        filters: { userIds: [], shiftToday: false },
        sentTo: [1],
        overrideTitle: overrideTitle || undefined,
        overrideDescription: overrideDescription || undefined,
        repeatEveryMinutes: repeatEveryMinutes
          ? parseInt(repeatEveryMinutes)
          : undefined,
        maxRepeats: maxRepeats ? parseInt(maxRepeats) : undefined,
        repeatUntil: repeatUntil ? new Date(repeatUntil) : undefined,
      });

      setFormData({
        templateId: '',
        overrideTitle: '',
        overrideDescription: '',
        sendAt: '',
        repeatEveryMinutes: '',
        maxRepeats: '',
        repeatUntil: '',
      });
      setShowForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('❌ Error al programar notificación:', error);
    }
  };

  return (
    <Section padding>
      {/* Formulario */}
      {showForm && (
        <div className='border p-6 mb-6 rounded bg-white space-y-4 shadow-sm'>
          <h4 className='text-lg font-semibold text-gray-800'>
            Creación de Notificación Programada
          </h4>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Título
              </label>
              <input
                type='text'
                placeholder='Ingrese el título de la notificación...'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.overrideTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overrideTitle: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <textarea
                placeholder='Ingrese una descripción...'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.overrideDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overrideDescription: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha de Inicio
              </label>
              <input
                type='datetime-local'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.sendAt}
                onChange={(e) =>
                  setFormData({ ...formData, sendAt: e.currentTarget.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha de Finalización
              </label>
              <input
                type='datetime-local'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.repeatUntil}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    repeatUntil: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Intervalo de Repetición
              </label>
              <input
                type='number'
                placeholder='Ej: 30'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.repeatEveryMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    repeatEveryMinutes: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Máximo de Repeticiones
              </label>
              <input
                type='number'
                placeholder='Ej: 5'
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.maxRepeats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxRepeats: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Grupos Destinatarios
              </label>
              <select
                className='w-full border px-3 py-2 rounded text-sm'
                value={formData.templateId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templateId: e.currentTarget.value,
                  })
                }
              >
                <option value=''>Seleccione grupos...</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              name='cancel-schedule'
              label='Cancelar'
              className='border border-gray-300 text-gray-700 bg-white'
              onClick={() => setShowForm(false)}
            />
            <Button
              name='create-schedule'
              label='Programar Notificación'
              className='bg-cyan-600 text-white hover:bg-cyan-700'
              onClick={handleCreateNotification}
            />
          </div>
        </div>
      )}
      {/* Mostrar solo el botón cuando el formulario está oculto */}
      {!showForm && (
        <div className='flex justify-start'>
          <Button
            name='new-scheduled'
            label='+ Nueva Programación'
            className='bg-cyan-600 text-white hover:bg-cyan-700'
            onClick={() => setShowForm(true)}
          />
        </div>
      )}
      {/* Tabla de notificaciones */}
      <Table<INotificationScheduledItem>
        data={notifications.value}
        columns={columns()}
        pageSize={10}
        showExpandableIcon={false}
      />
    </Section>
  );
};
