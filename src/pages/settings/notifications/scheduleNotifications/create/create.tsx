import { useEffect, useState } from 'preact/hooks';
import { Form } from 'react-final-form';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { SchedulerService, TemplateService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { IOption } from '@/components/common/smart-selector/smart-select';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

export const ScheduledNotificationForm = () => {
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const { go } = useNavigation();

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_programmed');
  }, []);

  const fetchTemplates = async () => {
    const response = await TemplateService.getTemplates();
    if (!response.getStatus()) return;
    const formatted = response.getMany().map((tpl: any) => ({
      label: tpl.title,
      value: tpl.id,
    }));
    setTemplates(formatted);
  };

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchTemplates();
    }
  }, [selectedCompany, location]);

  const redirectToList = () => {
    go({
      to: PAGES_LIST_ROUTER.dashboard.setting.notification.scheduled.to,
      label: 'notificaciones',
      base: 'setting',
      id: 'notification:scheduled:state',
    });
  };

  const handleSubmit = async (values: any) => {
    const {
      templateId,
      overrideTitle,
      overrideDescription,
      sendAt,
      repeatEveryMinutes,
      maxRepeats,
      repeatUntil,
    } = values;

    if (!templateId || typeof templateId !== 'string') {
      ToastManager.warning('s_select_template');
      return;
    }

    if (!sendAt || typeof sendAt !== 'string') {
      ToastManager.warning('s_select_date');
      return;
    }

    const payload = {
      templateId,
      sendAt: new Date(sendAt),
      filters: { userIds: [], shiftToday: false },
      sentTo: [1],
      overrideTitle: overrideTitle?.trim() || undefined,
      overrideDescription: overrideDescription?.trim() || undefined,
      repeatEveryMinutes: repeatEveryMinutes
        ? parseInt(repeatEveryMinutes)
        : undefined,
      maxRepeats: maxRepeats ? parseInt(maxRepeats) : undefined,
      repeatUntil: repeatUntil ? new Date(repeatUntil) : undefined,
    };

    setPendingSubmission(true);
    const res = await SchedulerService.scheduleNotification(payload);
    setPendingSubmission(false);

    if (res.getStatus()) {
      ToastManager.success('s_created_success');
      redirectToList();
    } else {
      ToastManager.error('s_created_error');
    }
  };

  return (
    <>
      {showConfirmModal && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center'>
          <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>
              Confirmar programación
            </h3>
            <p className='text-sm text-gray-700 mb-6'>
              Las notificaciones programadas serán enviadas únicamente a los
              usuarios que tengan turnos activos dentro de los horarios
              establecidos para la programación. ¿Deseas continuar?
            </p>
            <div className='flex justify-end gap-4'>
              <Button
                name='cancel-confirm-modal'
                label='Cancelar'
                onClick={() => setShowConfirmModal(false)}
                borderless
              />
              <Button
                name='confirm-schedule'
                label='Confirmar y Programar'
                onClick={async () => {
                  setShowConfirmModal(false);
                  await handleSubmit(formValues);
                }}
                className='bg-primary text-white hover:bg-primary-opacity'
              />
            </div>
          </div>
        </div>
      )}

      <Form
        onSubmit={(values) => {
          setFormValues({
            ...values,
            templateId: values.templateId?.value || '',
          });
          setShowConfirmModal(true);
        }}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
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
                disabled={pendingSubmission}
              />
            </div>
            <Input
              id='overrideTitle'
              name='overrideTitle'
              type='text'
              label='h_name'
              placeholder='Ingrese el título de la notificación...'
              value={values.overrideTitle || ''}
              onChange={(e) => (values.overrideTitle = e.currentTarget.value)}
            />

            <Input
              id='overrideDescription'
              name='overrideDescription'
              label='description'
              placeholder='p_write'
              value={values.overrideDescription || ''}
              onChange={(e: any) =>
                (values.overrideDescription = e.currentTarget.value)
              }
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
              onChange={(e) =>
                (values.repeatEveryMinutes = e.currentTarget.value)
              }
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
                value={
                  templates.find((t) => t.value === values.templateId?.value) ||
                  undefined
                }
                onChange={(option) => {
                  values.templateId = option || '';
                }}
              />
            </div>
          </form>
        )}
      />
    </>
  );
};
