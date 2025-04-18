import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { SchedulerServiceFront } from '@/services/schedule';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { Table } from '@/components/common/table/table';
import { columns } from './components/scheduled.columns';
import { useSignal } from '@preact/signals';

export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const isLoading = useSignal(false);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'sent' | 'failed' | 'all'>('all');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
    const { overrideTitle, overrideDescription, sendAt, repeatEveryMinutes, maxRepeats, repeatUntil } = formData;

    if (!overrideTitle || !overrideDescription || !sendAt) {
      alert('Todos los campos obligatorios deben ser completados.');
      return;
    }

    try {
      await SchedulerServiceFront.scheduleNotification({
        templateId: 'template-id-placeholder', // Reemplaza con lógica real
        sendAt: new Date(sendAt).toString(),
        filters: {
          userIds: [],
          shiftToday: false
        },
        sentTo: [1], // Reemplaza con IDs de usuarios reales
        overrideTitle,
        overrideDescription,
        attachmentUrl: undefined,
        repeatEveryMinutes: repeatEveryMinutes ? parseInt(repeatEveryMinutes) : undefined,
        maxRepeats: maxRepeats ? parseInt(maxRepeats) : undefined,
        repeatUntil: repeatUntil ? new Date(repeatUntil) : undefined,
      });

      setFormData({
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

  const buttonMenu = useMemo(
    () => (
      <div className="flex gap-2">
        {['all', 'pending', 'sent', 'failed'].map((type) => (
          <Button
            name={type}
            key={type}
            label={type.toUpperCase()}
            onClick={() => setStatusFilter(type as any)}
            className={statusFilter === type ? 'bg-primary-opacity p-2' : ''}
          />
        ))}
        <Button name="reload" label="Recargar" icon="316" onClick={fetchNotifications} />
        <Button name="new-scheduled" label={showForm ? 'Cancelar' : '+ Nueva'} icon="122" onClick={() => setShowForm((prev) => !prev)} />
      </div>
    ),
    [statusFilter, showForm]
  );

  return (
    <Section padding>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notificaciones Programadas</h2>
        {buttonMenu}
      </div>

      {showForm && (
        <div className="border p-4 mb-6 rounded bg-gray-50 space-y-2">
          <h4 className="text-md font-medium">Nueva Notificación Programada</h4>
          <input
            type="text"
            placeholder="Título override"
            className="w-full border px-3 py-2 rounded text-sm"
            value={formData.overrideTitle}
            onChange={(e) => setFormData({ ...formData, overrideTitle: e.currentTarget.value })}
          />
          <textarea
            placeholder="Descripción override"
            className="w-full border px-3 py-2 rounded text-sm"
            value={formData.overrideDescription}
            onChange={(e) => setFormData({ ...formData, overrideDescription: e.currentTarget.value })}
          />
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded text-sm"
            value={formData.sendAt}
            onChange={(e) => setFormData({ ...formData, sendAt: e.currentTarget.value })}
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Repetir cada X minutos"
              className="w-full border px-3 py-2 rounded text-sm"
              value={formData.repeatEveryMinutes}
              onChange={(e) => setFormData({ ...formData, repeatEveryMinutes: e.currentTarget.value })}
            />
            <input
              type="number"
              placeholder="Máx. repeticiones"
              className="w-full border px-3 py-2 rounded text-sm"
              value={formData.maxRepeats}
              onChange={(e) => setFormData({ ...formData, maxRepeats: e.currentTarget.value })}
            />
            <input
              type="datetime-local"
              placeholder="Repetir hasta"
              className="w-full border px-3 py-2 rounded text-sm"
              value={formData.repeatUntil}
              onChange={(e) => setFormData({ ...formData, repeatUntil: e.currentTarget.value })}
            />
          </div>

          <Button
            name="schedule-submit"
            label="Programar Notificación"
            className="bg-cyan-600 text-white hover:bg-cyan-700 px-4 py-2 text-sm rounded"
            onClick={handleCreateNotification}
          />
        </div>
      )}

      <Table<INotificationScheduledItem>
        data={notifications.value}
        columns={columns()}
        pageSize={10}
        showExpandableIcon={false}
      />
    </Section>
  );
};
