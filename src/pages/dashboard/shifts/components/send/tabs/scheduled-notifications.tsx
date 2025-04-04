import { useState } from 'preact/hooks';

export const ScheduledNotifications = () => {
  const [scheduled] = useState([
    {
      id: '1',
      title: 'Recordatorio mañana',
      description: 'Recuerda tu turno de mañana',
      sendAt: '2025-04-03T08:00:00Z',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Formulario mensual',
      description: 'Completa el formulario mensual',
      sendAt: '2025-04-01T14:00:00Z',
      status: 'sent',
    },
  ]);

  return (
    <div className='space-y-4'>
      <h4 className='text-md font-medium'>Notificaciones programadas</h4>

      <div className='border rounded border-gray-200 bg-white shadow-sm divide-y'>
        {scheduled.map((item) => (
          <div key={item.id} className='p-4 flex flex-col gap-1'>
            <div className='font-semibold'>{item.title}</div>
            <div className='text-sm text-gray-600'>{item.description}</div>
            <div className='text-xs text-gray-400'>Envío: {new Date(item.sendAt).toLocaleString()}</div>
            <div className='text-xs'>Estado: <span className='font-medium'>{item.status}</span></div>
          </div>
        ))}
      </div>

      <div className='border-t pt-4'>
        <h5 className='text-sm font-semibold mb-2'>Programar nueva notificación (visual)</h5>
        <div className='space-y-2'>
          <input type='text' placeholder='Título override' className='w-full border px-3 py-2 rounded text-sm' />
          <input type='datetime-local' className='w-full border px-3 py-2 rounded text-sm' />
          <button className='px-4 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700'>Programar</button>
        </div>
      </div>
    </div>
  );
};