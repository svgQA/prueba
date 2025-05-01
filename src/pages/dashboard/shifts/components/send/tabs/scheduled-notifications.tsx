import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const ScheduledNotifications = () => {
  const { t } = useTranslation();
  const [scheduled] = useState([
    {
      id: '1',
      title: t('shifts.notifications.scheduled.reminderTitle'),
      description: t('shifts.notifications.scheduled.reminderDescription'),
      sendAt: '2025-04-03T08:00:00Z',
      status: 'pending',
    },
    {
      id: '2',
      title: t('shifts.notifications.scheduled.formTitle'),
      description: t('shifts.notifications.scheduled.formDescription'),
      sendAt: '2025-04-01T14:00:00Z',
      status: 'sent',
    },
  ]);

  return (
    <div className='space-y-4'>
      <h4 className='text-md font-medium'>
        {t('shifts.notifications.scheduled.title')}
      </h4>

      <div className='border rounded border-gray-200 bg-white shadow-sm divide-y'>
        {scheduled.map((item) => (
          <div key={item.id} className='p-4 flex flex-col gap-1'>
            <div className='font-semibold'>{item.title}</div>
            <div className='text-sm text-gray-600'>{item.description}</div>
            <div className='text-xs text-gray-400'>
              {t('shifts.notifications.scheduled.send')}:{' '}
              {new Date(item.sendAt).toLocaleString()}
            </div>
            <div className='text-xs'>
              {t('shifts.notifications.scheduled.status')}:{' '}
              <span className='font-medium'>
                {t(`shifts.notifications.scheduled.${item.status}`)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='border-t pt-4'>
        <h5 className='text-sm font-semibold mb-2'>
          {t('shifts.notifications.scheduled.scheduleNew')}
        </h5>
        <div className='space-y-2'>
          <input
            type='text'
            placeholder={t(
              'shifts.notifications.scheduled.titleOverridePlaceholder'
            )}
            className='w-full border px-3 py-2 rounded text-sm'
          />
          <input
            type='datetime-local'
            className='w-full border px-3 py-2 rounded text-sm'
          />
          <button className='px-4 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700'>
            {t('shifts.notifications.scheduled.scheduleButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
