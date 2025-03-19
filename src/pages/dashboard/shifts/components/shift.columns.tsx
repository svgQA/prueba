import { Badge } from '@/components/common/badge/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import dayjs from 'dayjs';

export const columns: ColumnDef<IShiftResponse>[] = [
  {
    id: 'employee',
    accessorKey: 'employee.name',
    size: 180,
    header: 'Usuario',
    cell: (info) => {
      const { employee } = info.row.original;
      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {employee.name} {employee.surname}
        </span>
      );
    },
  },
  {
    id: 'service',
    accessorKey: 'service.id',
    size: 180,
    header: 'Servicio',
    enableGrouping: true,
    meta: { expander: 'serviceId' },

    cell: (info) => {
      const serviceId = info.getValue() as number;
      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {serviceId}
        </span>
      );
    },
  },
  {
    id: 'contract',
    accessorKey: 'service.contract.id',
    size: 120,
    header: 'Contrato',
    cell: (info) => {
      const contractId = info.getValue() as number;
      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {contractId}
        </span>
      );
    },
  },
  {
    id: 'date',
    accessorKey: 'start',
    size: 150,
    header: 'fecha',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('YYYY-MM-DD');
    },
  },
  {
    id: 'start-end',
    accessorKey: 'start',
    size: 150,
    header: 'Inicio',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {dayjs(dateStr).format('HH:mm')}
        </span>
      );
    },
  },
  {
    id: 'start-end',
    accessorKey: 'end',
    size: 150,
    header: 'Finalización',
    cell: (info) => {
      const dateStr = info.getValue() as string;

      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {dayjs(dateStr).format('HH:mm')}
        </span>
      );
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
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'Duración',
    cell: () => (
      <div className='flex flex-row justify-center'>
        <Badge label='12' color='bg-primary' />
      </div>
    ),
  },
  {
    id: 'report',
    accessorKey: 'report',
    size: 50,
    header: 'Reportes',
    cell: (info) => (
      <span
        className=' p-1 size-sm cursor-pointer'
        onClick={() => info.row.toggleExpanded()}
      >
        <Badge label='12' color='bg-primary' />
      </span>
    ),
  },
  {
    id: 'shift',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Actividades',
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
          <span
            className=' p-1 size-sm cursor-pointer'
            onClick={() => info.row.toggleExpanded()}
          >
            <Gauge progress={progress} color={progressColor} />
          </span>
        </div>
      );
    },
  },
  {
    id: 'round',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Rondas',
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
          <span
            className=' p-1 size-sm cursor-pointer'
            onClick={() => info.row.toggleExpanded()}
          >
            <Gauge progress={progress} color={progressColor} />
          </span>
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
