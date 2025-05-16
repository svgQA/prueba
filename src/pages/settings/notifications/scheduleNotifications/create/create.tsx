import { useEffect, useState } from 'preact/hooks';
import { Form } from 'react-final-form';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { useLocation } from 'wouter';
import { appendHistory } from '@/pages/settings/store/settings';
import { SchedulerService, TemplateService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { IOption } from '@/components/common/smart-selector/smart-select';

export const ScheduledNotificationForm = () => {
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [_, navigate] = useLocation();
  const [pendingSubmission, setPendingSubmission] = useState(false);

  useEffect(() => {
    document.title = 'VX - Programar Nueva Notificación';
    const fetchTemplates = async () => {
      const response = await TemplateService.getTemplates();
      if (!response.getStatus()) return;
      const formatted = response.getMany().map((tpl: any) => ({
        label: tpl.title,
        value: tpl.id,
      }));
      setTemplates(formatted);
    };
    fetchTemplates();
  }, []);

  const redirectToList = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.scheduledNotification.to,
      label: 'notificaciones',
      id: 'template-notifications',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  const handleSubmit = async (values: any) => {
    console.log(values);

    const {
      templateId,
      overrideTitle,
      overrideDescription,
      sendAt,
      repeatEveryMinutes,
      maxRepeats,
      repeatUntil,
    } = values;

    // templateId ya es string, no .value
    if (!templateId.value || typeof templateId.value !== 'string') {
      ToastManager.warning('Debes seleccionar una plantilla obligatoriamente.');
      return;
    }

    if (!sendAt || typeof sendAt !== 'string') {
      ToastManager.warning('Debes indicar la fecha de envío.');
      return;
    }

    const payload = {
      templateId: templateId.value, // ✅ ahora sí es string
      sendAt: new Date(sendAt),
      filters: { userIds: [], shiftToday: false },
      sentTo: [1],
      overrideTitle: overrideTitle?.trim() || undefined,
      overrideDescription: overrideDescription?.trim() || undefined,
      repeatEveryMinutes: repeatEveryMinutes ? parseInt(repeatEveryMinutes) : undefined,
      maxRepeats: maxRepeats ? parseInt(maxRepeats) : undefined,
      repeatUntil: repeatUntil ? new Date(repeatUntil) : undefined,
    };

    setPendingSubmission(true);
    const res = await SchedulerService.scheduleNotification(payload);
    setPendingSubmission(false);

    if (res.getStatus()) {
      ToastManager.success('Notificación programada exitosamente');
      redirectToList();
    } else {
      ToastManager.error('Error al programar notificación');
    }
  };


  return (
    <Section padding>
      <h2 className='text-xl font-semibold mb-6'>Detalles de la Notificación</h2>
      <Form
        onSubmit={handleSubmit}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            <Input
              id='overrideTitle'
              name='overrideTitle'
              type='text'
              label='Título *'
              placeholder='Ingrese el título de la notificación...'
              value={values.overrideTitle || ''}
              onChange={(e) => (values.overrideTitle = e.currentTarget.value)}
            />

            <TextArea
              id='overrideDescription'
              name='overrideDescription'
              label='Descripción *'
              placeholder='Ingrese una descripción...'
              className='col-span-2'
              value={values.overrideDescription || ''}
              onChange={(e: any) => (values.overrideDescription = e.currentTarget.value)}
            />

            <Input
              id='sendAtInput'
              name='sendAt'
              type='datetime-local'
              label='Fecha de Inicio *'
              value={values.sendAt || ''}
              onChange={(e) => (values.sendAt = e.currentTarget.value)}
            />

            <Input
              id='repeatUntilInput'
              name='repeatUntil'
              type='datetime-local'
              label='Fecha de Finalización *'
              value={values.repeatUntil || ''}
              onChange={(e) => (values.repeatUntil = e.currentTarget.value)}
            />

            <Input
              id='repeatEveryMinutes'
              name='repeatEveryMinutes'
              type='number'
              label='Intervalo de Repetición'
              placeholder='Ej: 30'
              min={1}
              value={values.repeatEveryMinutes || ''}
              onChange={(e) => (values.repeatEveryMinutes = e.currentTarget.value)}
            />

            <Input
              id='maxRepeats'
              name='maxRepeats'
              type='number'
              label='Máximo de Repeticiones'
              placeholder='Ej: 5'
              min={1}
              value={values.maxRepeats || ''}
              onChange={(e) => (values.maxRepeats = e.currentTarget.value)}
            />

            <div className='col-span-2'>
              <SmartSelector
                id='templateSelector'
                name='templateId'
                options={templates}
                placeholder='Selecciona una plantilla...'
                value={templates.find((t) => t.value === values.templateId) || undefined}
                onChange={(option) => {
                  values.templateId = option?.value || ''; // 🔥 guardamos solo el string value
                }}
              />

            </div>

            <div className='col-span-2 flex justify-end gap-2 mt-6'>
              <Button
                name='cancel-create-scheduled'
                label='Cancelar'
                onClick={redirectToList}
                borderless
              />
              <Button
                name='submit-create-scheduled'
                label={pendingSubmission ? 'Enviando...' : 'Programar Notificación'}
                type='submit'
                className='bg-primary text-white hover:bg-primary-opacity'
                disabled={pendingSubmission}
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};

export default ScheduledNotificationForm;
