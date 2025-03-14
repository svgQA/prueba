import { Badge } from '@/components/common/badge/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import dayjs from 'dayjs';

export const columns: ColumnDef<IShiftResponse>[] = [
  {
    id: 'userName',
    accessorKey: 'user.name',
    size: 180,
    header: 'Empleado',
    enableGrouping: true,
    cell: (info) => {
      const { user } = info.row.original;
      return `${user.name} ${user.surname}`;
    },
  },
  {
    id: 'serviceId',
    accessorKey: 'service.id',
    size: 180,
    header: 'Servicio',
    enableGrouping: true,
  },
  {
    id: 'contractId',
    accessorKey: 'service.contract.id',
    size: 120,
    header: 'Contrato',
  },
  {
    id: 'start',
    accessorKey: 'start',
    size: 150,
    header: 'Inicio',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
    },
  },
  {
    id: 'end',
    accessorKey: 'end',
    size: 150,
    header: 'Finalización',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'Estado',
    cell: (info) => (
      <div className='flex flex-row justify-center'>
        <Badge label={String(info.getValue())} icon='123' color='bg-primary' />
      </div>
    ),
  },
  {
    id: 'report',
    accessorKey: 'report',
    size: 50,
    header: 'Reportes',
    cell: () => (
      <div className='flex flex-row justify-center'>
        <Badge label='2' color='bg-primary' />
      </div>
    ),
  },
  {
    id: 'activitiesProgress',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Progreso',
    cell: (info: any) => {
      const progress = info.getValue() as number;

      let progressColor = '#E05858';

      if (progress < 30) {
        progressColor = '#E05858';
      } else if (progress >= 30 && progress < 70) {
        progressColor = '#FFC772';
      } else if (progress >= 70) {
        progressColor = '#00BDD6';
      }

      return (
        <div className='flex flex-row justify-center'>
          <Gauge progress={progress} color={progressColor} />
        </div>
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
