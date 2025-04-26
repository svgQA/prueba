import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import dayjs from 'dayjs';

export const columns = (): ColumnDef<INotificationScheduledItem>[] => [
  {
    id: 'title',
    accessorKey: 'overrideTitle',
    header: 'Título',
    size: 200,
    cell: (info) => (
      <span className='p-1 size-sm font-medium text-gray-text-light'>
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'description',
    accessorKey: 'overrideDescription',
    header: 'Descripción',
    size: 300,
    cell: (info) => (
      <span
        className='line-clamp-2 max-w-[300px] text-sm text-gray-text-light'
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Estado',
    size: 140,
    cell: (info) => {
      const value = info.getValue() as string;
      let colorClass = 'bg-gray-border text-gray-text-dark';

      if (value === 'sent')
        colorClass = 'bg-secondary text-white'; // Enviada -> Verde
      else if (value === 'pending')
        colorClass = 'bg-primary text-white'; // Pendiente -> Azul
      else if (value === 'failed') colorClass = 'bg-error text-white'; // Fallida -> Rojo

      return (
        <div
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </div>
      );
    },
  },
  {
    id: 'sendAt',
    accessorKey: 'sendAt',
    header: 'Fecha Programada',
    size: 180,
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return '-';
      return (
        <time
          dateTime={new Date(value).toISOString()}
          className='p-1 size-sm text-sm text-gray-text-light'
        >
          {dayjs(value).format('DD/MM/YYYY HH:mm')}
        </time>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Fecha de creación',
    size: 180,
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return '-';
      return (
        <time
          dateTime={new Date(value).toISOString()}
          className='p-1 size-sm text-sm text-gray-text-light'
        >
          {dayjs(value).format('DD/MM/YYYY HH:mm')}
        </time>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    size: 80,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center group relative'>
          <span className='vox-icon vx-icon-233 p-1 size-sm cursor-pointer' />
          <div className='absolute left-full ml-2 hidden group-hover:flex bg-white shadow-lg rounded p-1'>
            <span
              className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
              data-id={id}
              data-type='scheduledNotification'
              data-action={ROW_ACTIONS.UPDATE}
            />
            <span
              className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
              data-id={id}
              data-type='scheduledNotification'
              data-action={ROW_ACTIONS.DELETE}
            />
          </div>
        </div>
      );
    },
  },
];
