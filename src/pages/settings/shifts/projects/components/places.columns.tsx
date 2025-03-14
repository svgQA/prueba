import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IProject } from '../projects';
import dayjs from 'dayjs';

const status: { key: string; label: string; color: string }[] = [
  {
    key: 'IN_PROGRESS',
    label: 'En progreso',
    color: 'bg-orange-600 text-white',
  },
  { key: 'COMPLETED', label: 'Completado', color: 'bg-secondary text-white' },
  { key: 'PENDING', label: 'Pendiente', color: 'bg-error text-white' },
];
const priorities: { key: string; label: string; color: string }[] = [
  {
    key: 'LOW',
    label: 'Baja',
    color: 'bg-orange-600 text-white',
  },
  { key: 'MEDIUM', label: 'Media', color: 'bg-secondary text-white' },
  { key: 'HIGH', label: 'Alta', color: 'bg-error text-white' },
];

export const columns: ColumnDef<IProject>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'Nombre',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'Descripción',
    cell: (info) => {
      const description = info.getValue() as string;
      return (
        <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
          {description}
        </div>
      );
    },
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    size: 60,
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
    size: 60,
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
    size: 60,
    header: 'Estado',
    cell: (info) => {
      const value = info.getValue() as string;
      const state = status.find((sta) => sta.key == value);
      return (
        <span className={`px-2 py-1 rounded ${state?.color}`}>
          {state?.label}
        </span>
      );
    },
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    size: 180,
    header: 'prioridad',
    cell: (info) => {
      const value = info.getValue() as string;
      const priority = priorities.find((sta) => sta.key == value);
      return (
        <span className={`px-2 py-1 rounded ${priority?.color}`}>
          {priority?.label}
        </span>
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
