import { useEffect, useState } from 'react';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { SchedulerServiceFront } from '@/services/notification/schedule';
import { TemplateServiceFront } from '@/services/notification/template';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '@/pages/settings/store/settings';
import { toast } from 'react-toastify';

export const ScheduledNotificationForm = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    templateId: '',
    overrideTitle: '',
    overrideDescription: '',
    sendAt: '',
    repeatEveryMinutes: '',
    maxRepeats: '',
    repeatUntil: '',
  });

  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = 'VX - Programar Nueva Notificación';
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

  const handleSubmit = async () => {
    const {
      templateId,
      overrideTitle,
      overrideDescription,
      sendAt,
      repeatEveryMinutes,
      maxRepeats,
      repeatUntil,
    } = formData;

    if (!templateId) {
      toast.warning('Debes seleccionar una plantilla obligatoriamente.');
      return;
    }

    if (!sendAt) {
      toast.warning('Debes indicar la fecha de envío.');
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
      toast.success('Notificación programada exitosamente');
      redirectToList();
    } catch (error) {
      console.error(error);
      toast.error('Error al programar notificación');
    }
  };

  const redirectToList = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications
        .scheduledNotification.to,
      label: 'notificaciones',
      id: 'template-notifications',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  return (
    <Section padding>
      <h2 className='text-xl font-semibold mb-6'>
        Detalles de la Notificación
      </h2>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Título *
          </label>
          <input
            type='text'
            placeholder='Ingrese el título de la notificación...'
            className='w-full border px-3 py-2 rounded text-sm'
            value={formData.overrideTitle}
            onChange={(e) =>
              setFormData({ ...formData, overrideTitle: e.currentTarget.value })
            }
          />
        </div>

        <div className='col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Descripción *
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
            Fecha de Inicio *
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
            Fecha de Finalización *
          </label>
          <input
            type='datetime-local'
            className='w-full border px-3 py-2 rounded text-sm'
            value={formData.repeatUntil}
            onChange={(e) =>
              setFormData({ ...formData, repeatUntil: e.currentTarget.value })
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
              setFormData({ ...formData, maxRepeats: e.currentTarget.value })
            }
          />
        </div>

        <div className='col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Plantilla de notificación *
          </label>
          <select
            className='w-full border px-3 py-2 rounded text-sm'
            value={formData.templateId}
            onChange={(e) =>
              setFormData({ ...formData, templateId: e.currentTarget.value })
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

      <div className='flex justify-end mt-6 gap-2'>
        <Button
          name='cancel-create-scheduled'
          label='Cancelar'
          className='border border-gray-300 text-gray-700 bg-white p-2'
          onClick={redirectToList}
        />
        <Button
          name='submit-create-scheduled'
          label='Programar Notificación'
          className='bg-primary text-white hover:bg-primary-opacity p-2'
          onClick={handleSubmit}
        />
      </div>
    </Section>
  );
};

export default ScheduledNotificationForm;
