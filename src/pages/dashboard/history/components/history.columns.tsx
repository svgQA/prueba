// src/pages/dashboard/history/components/history.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { INotificationHistoryItem } from '@/types/notification/INotificationTypes';
import dayjs from 'dayjs';
import i18next from 'i18next';

// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const columns = ({
  onMarkAsRead,
}: {
  onMarkAsRead: (item: INotificationHistoryItem) => void;
}): ColumnDef<INotificationHistoryItem>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: t('history.columns.title'),
    size: 200,
    cell: (info) => (
      <span className='p-1 size-sm'>{info.getValue() as string}</span>
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: t('history.columns.description'),
    size: 250,
    cell: (info) => (
      <span
        className='line-clamp-2 max-w-[250px]'
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'sentAt',
    accessorKey: 'sentAt',
    header: t('history.columns.sentAt'),
    size: 180,
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return (
        <time dateTime={date.toISOString()} className='p-1 size-sm'>
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </time>
      );
    },
  },
  {
    id: 'hasViewed',
    accessorKey: 'hasViewed',
    header: t('history.columns.status'),
    size: 100,
    cell: (info) => {
      const viewed = info.getValue() as boolean;
      return (
        <span className={viewed ? 'text-green-600' : 'text-red-500'}>
          {viewed ? t('history.columns.read') : t('history.columns.unread')}
        </span>
      );
    },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: t('history.columns.origin'),
    size: 100,
    cell: (info) => (
      <span className='capitalize p-1 size-sm'>
        {info.getValue() === 'manual'
          ? t('history.columns.manual')
          : t('history.columns.scheduled')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: t('history.columns.action'),
    size: 120,
    cell: (info) => {
      const item = info.row.original;
      if (!item.hasViewed && item.scheduledNotificationId) {
        return (
          <button
            className='text-blue-500 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
            onClick={() => onMarkAsRead(item)}
          >
            {t('history.columns.markAsRead')}
          </button>
        );
      }
      return null;
    },
  },
];
