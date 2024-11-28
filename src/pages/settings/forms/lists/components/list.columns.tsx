import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { IListResponse } from '@/types/form';
import { Button } from '@/components/common';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const columns = (
  action: (value: any) => void
): ColumnDef<IListResponse>[] => {
  return [
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      cell: (info) => info.getValue() || '-',
      size: 150,
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: 'Fecha de creación',
      cell: (info) => dayjs(info.getValue() as string).fromNow(),
      size: 200,
    },
    {
      id: 'actions',
      cell: (info) => {
        return (
          <Button
            name='action-cell'
            type='button'
            icon='123'
            rounded
            onClick={() => action(info.row.original)}
          />
        );
      },
      size: 30,
    },
  ];
};
