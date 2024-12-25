import { Badge } from '@/components/common/badge/badge';
import { Shift } from '../utils/shifts';
import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';

export const columns: ColumnDef<Shift>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'employeeName',
    accessorKey: 'employeeName',
    size: 180,
    header: 'Empleado',
  },
  {
    id: 'employeeId',
    accessorKey: 'employeeId',
    size: 180,
    header: 'ID Empleado',
  },
  {
    id: 'city',
    accessorKey: 'city',
    size: 180,
    header: 'Ciudad',
  },
  {
    id: 'address',
    accessorKey: 'address',
    size: 180,
    header: 'Dirección',
  },
  {
    id: 'startTime',
    accessorKey: 'startTime',
    size: 180,
    header: 'Hora inicio',
  },
  {
    id: 'endTime',
    accessorKey: 'endTime',
    size: 180,
    header: 'Hora fin',
  },
  {
    id: 'duration',
    accessorKey: 'duration',
    size: 180,
    header: 'Duración',
  },
  {
    id: 'notifications',
    accessorKey: 'notifications',
    size: 100,
    header: 'Notificaciones',
    cell: (info: any) => (
      <div className='flex flex-row justify-center'>
        <Badge label={info.getValue()} icon='123' color='bg-primary' />
      </div>
    ),
  },
  {
    id: 'activitiesProgress',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Progreso',
    cell: (info: any) => (
      <div className='flex flex-row justify-center'>
        <Gauge progress={info.getValue() as number} />
      </div>
    ),
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
            data-type='shift'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='shift'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
