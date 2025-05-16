import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IProject } from '../projects';
import dayjs from 'dayjs';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { Avatar } from '@/components/common/Avatar';
const status: { key: string; label: string; color: string }[] = [
  {
    key: 'IN_PROGRESS',
    label: 'En progreso',
    color: 'info',
  },
  { key: 'COMPLETED', label: 'Completado', color: 'success' },
  { key: 'PENDING', label: 'Pendiente', color: 'error' },
];
const priorities: { key: string; label: string; color: string }[] = [
  {
    key: 'LOW',
    label: 'Baja',
    color: 'info',
  },
  { key: 'MEDIUM', label: 'Media', color: 'warning' },
  { key: 'HIGH', label: 'Alta', color: 'error' },
];

export const columns: ColumnDef<IProject>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'client',
    accessorKey: 'client',
    size: 120,
    header: 'Cliente',
    cell: (info) => {
      const client = info.getValue() as any;
      return (
        <div className='flex items-center gap-2'>
          <Avatar square size='sm' src={client?.image} />
          <TextEllipsis
            text={client?.name + ' ' + client?.surname}
            maxWidth='300px'
          />
        </div>
      );
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 120,
    header: 'Nombre',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 120,
    header: 'Descripción',
    cell: (info) => {
      const description = info.getValue() as string;
      return <TextEllipsis text={description} maxWidth='300px' />;
    },
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    size: 70,
    header: 'Inicio',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      if (!dateStr) return '';
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    size: 70,
    header: 'Fin',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      if (!dateStr) return '';
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    id: 'state',
    accessorKey: 'state',
    size: 50,
    header: 'Estado',
    cell: (info) => {
      const value = info.getValue() as string;
      const state = status.find((sta) => sta.key == value);
      return (
        <Badge
          label={state?.label}
          status={state?.color as 'info' | 'error' | 'warning' | 'success'}
          outline
          full
          size='xs'
        />
      );
    },
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    size: 50,
    header: 'prioridad',
    cell: (info) => {
      const value = info.getValue() as string;
      const priority = priorities.find((sta) => sta.key == value);
      return (
        <Badge
          label={priority?.label}
          status={priority?.color as 'info' | 'error' | 'warning' | 'success'}
          outline
          full
          size='xs'
        />
      );
    },
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
