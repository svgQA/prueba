import { useEffect, useState } from 'preact/hooks';
import { useParams, useLocation } from 'wouter';
import { SchedulerService } from '@/services';
import { IScheduleNotificationDto } from '@/types/notification/IScheduleNotificationDto';
// import { Section } from '@/components/common/section/section';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { Button } from '@/components/common/button/button';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';

export const ScheduledNotificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<IScheduleNotificationDto>>({});
  const loading = useSignal<boolean>(false);
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      loading.value = true;
      const res = await SchedulerService.getById(id);
      if (res.getStatus()) {
        const data = res.getOne();
        setForm({
          overrideTitle: data.overrideTitle || '',
          overrideDescription: data.overrideDescription || '',
          filters: data.filters || {},
          sentTo: data.sentTo || [],
          sendAt: data.sendAt,
          repeatUntil: data.repeatUntil,
          repeatEveryMinutes: data.repeatEveryMinutes,
          maxRepeats: data.maxRepeats,
          attachmentUrl: data.attachmentUrl || '',
        });
      }
      loading.value = false;
    };
    fetch();
  }, [id]);

  const handleChange = (field: keyof IScheduleNotificationDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    loading.value = true;
    const res = await SchedulerService.updateScheduledNotification(id, form);

    if (res.getStatus()) {
      alert('Notificación actualizada correctamente');
      navigate('/notification/scheduled'); // Ajusta según tu router
    } else {
      alert('Error al actualizar la notificación');
    }
    loading.value = false;
  };

  return (
    <Section loading={loading.value}>
      <div className='flex justify-end gap-4 absolute top-14 right-2'>
        <Button
          name='save-scheduled'
          label='save'
          icon='022'
          onClick={handleSubmit}
          disabled={loading.value}
        />
      </div>
      <div className='space-y-4 grid grid-cols-2'>
        <div className='col-span-1'>
          <Input
            label='h_name'
            name='overrideTitle'
            value={form.overrideTitle || ''}
            onChange={(e) =>
              handleChange('overrideTitle', e.currentTarget.value)
            }
          />
        </div>
        <div className='col-span-1'>
          <Input
            label='description'
            name='overrideDescription'
            value={form.overrideDescription || ''}
            onChange={(e) =>
              handleChange('overrideDescription', e.currentTarget.value)
            }
          />
        </div>
        <Input
          label='Fecha de envío'
          name='sendAt'
          type='datetime-local'
          value={
            form.sendAt ? new Date(form.sendAt).toISOString().slice(0, 16) : ''
          }
          onChange={(e) => handleChange('sendAt', e.currentTarget.value)}
        />
        <Input
          label='Repetir hasta (opcional)'
          name='repeatUntil'
          type='datetime-local'
          value={
            form.repeatUntil
              ? new Date(form.repeatUntil).toISOString().slice(0, 16)
              : ''
          }
          onChange={(e) => handleChange('repeatUntil', e.currentTarget.value)}
        />
        <Input
          label='Repetir cada (minutos)'
          name='repeatEveryMinutes'
          type='number'
          value={form.repeatEveryMinutes ?? ''}
          onChange={(e) =>
            handleChange('repeatEveryMinutes', Number(e.currentTarget.value))
          }
        />
        <Input
          label='Máximo de repeticiones'
          name='maxRepeats'
          type='number'
          value={form.maxRepeats ?? ''}
          onChange={(e) =>
            handleChange('maxRepeats', Number(e.currentTarget.value))
          }
        />
        <Input
          label='Adjunto (URL)'
          name='attachmentUrl'
          value={form.attachmentUrl || ''}
          onChange={(e) => handleChange('attachmentUrl', e.currentTarget.value)}
        />
        <TextArea
          label='Filtros (JSON)'
          name='filters'
          value={JSON.stringify(form.filters || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.currentTarget.value);
              handleChange('filters', parsed);
            } catch (_) {}
          }}
        />
        <TextArea
          label='IDs destinatarios (sentTo)'
          name='sentTo'
          value={JSON.stringify(form.sentTo || [], null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.currentTarget.value);
              handleChange('sentTo', parsed);
            } catch (_) {}
          }}
        />
      </div>
    </Section>
  );
};
