import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns = (): ColumnDef<INotificationScheduledItem>[] => [
  {
    id: 'title',
    accessorKey: 'overrideTitle',
    header: 'Título',
    size: 200,
    cell: (info) => (
      <span className="p-1 size-sm">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'description',
    accessorKey: 'overrideDescription',
    header: 'Descripción',
    size: 250,
    cell: (info) => (
      <span className="line-clamp-2 max-w-[250px]" title={info.getValue() as string}>
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'sendAt',
    accessorKey: 'sendAt',
    header: 'Programado para',
    size: 180,
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return (
        <time dateTime={date.toISOString()} className="p-1 size-sm">
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </time>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Estado',
    size: 120,
    cell: (info) => {
      const value = info.getValue() as string;
      const color =
        value === 'pending' ? 'text-yellow-600' :
        value === 'sent' ? 'text-green-600' :
        'text-red-600';
      return <span className={color}>{value.toUpperCase()}</span>;
    },
  },
];
