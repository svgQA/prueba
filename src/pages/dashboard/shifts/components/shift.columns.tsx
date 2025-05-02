import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { Avatar } from '@/components/common/Avatar';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IShiftResponse>[] => [
  {
    id: 'employee',
    accessorKey: 'employee.name',
    size: 180,
    header: 'Usuario',
    enableGrouping: true,
    cell: (info) => {
      const { employee } = info.row.original;
      return (
        <div className='flex items-center'>
          <Avatar
            name={employee?.name}
            src={employee?.image}
            size='sm'
            square
          />
          <span
            className='p-1 size-sm cursor-pointer text-left'
            onClick={() => info.row.toggleExpanded()}
          >
            {employee?.name} {employee?.surname}
          </span>
        </div>
      );
    },
  },
  {
    id: 'service',
    accessorKey: 'service.name',
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
    accessorKey: 'service.contract.name',
    size: 120,
    header: 'Contrato',
    cell: (info) => {
      const contract = String(info.getValue());
      return (
        <span
          className='p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {contract}
        </span>
      );
    },
  },
  {
    id: 'fecha',
    accessorKey: 'start',
    size: 120,
    header: 'Fecha',
    enableGrouping: false,
    cell: (info) => {
      const dateStr = String(info.getValue());
      if (!dateStr) return '-';

      try {
        return dayjs(dateStr).format('DD/MM/YYYY');
      } catch (error) {
        return '-';
      }
    },
  },
  {
    id: 'time-start',
    accessorKey: 'start',
    size: 150,
    header: 'Inicio',
    cell: (info) => {
      const rowData = info.row.original;
      const checkInData = rowData.checkIn;
      const startDate = new Date(rowData.start);

      let colorClass = 'border-gray-500 text-gray-700';

      if (checkInData?.location) {
        if (checkInData?.time) {
          const checkInTime = new Date(checkInData.time);
          const tenMinutesBefore = new Date(startDate);
          const tenMinutesAfter = new Date(startDate);

          tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
          tenMinutesAfter.setMinutes(tenMinutesAfter.getMinutes() + 10);

          if (checkInTime <= startDate && checkInTime < tenMinutesBefore) {
            colorClass = 'border-primary text-primary'; // On time
          } else if (checkInTime > tenMinutesAfter) {
            colorClass = 'border-error text-error'; // Early
          } else {
            colorClass = 'border-secondary text-secondary'; // Late
          }
        }
      }

      const scheduledTime = dayjs(startDate).format('HH:mm');
      const formatActualTime = (data: any) => {
        if (!data || !data.time) return '...';
        const date = new Date(data.time);
        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };
      const actualTime = formatActualTime(checkInData);

      return (
        <div
          onClick={() => info.row.toggleExpanded()}
          className={`p-1 size-sm cursor-pointer inline-flex items-center px-2 py-0.5 rounded-md border ${colorClass} text-sm w-full justify-center`}
        >
          <span>{scheduledTime}</span>
          <span className='mx-1'>→</span>
          <span>{actualTime}</span>
        </div>
      );
    },
  },
  {
    id: 'time-end',
    accessorKey: 'end',
    size: 150,
    header: 'Finalización',
    cell: (info) => {
      const rowData = info.row.original;
      const checkOutData = rowData.checkOut;
      const endDate = new Date(rowData.end);
      let colorClass = 'border-gray-500 text-gray-700';

      if (checkOutData?.location) {
        if (checkOutData?.time) {
          const checkInTime = new Date(checkOutData.time);
          const tenMinutesBefore = new Date(endDate);
          const tenMinutesAfter = new Date(endDate);

          tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
          tenMinutesAfter.setMinutes(tenMinutesAfter.getMinutes() + 10);

          if (checkInTime <= endDate && checkInTime < tenMinutesBefore) {
            colorClass = 'border-orange-500 text-orange-500';
          } else if (checkInTime > tenMinutesAfter) {
            colorClass = 'border-primary text-primary';
          } else {
            colorClass = 'border-secondary text-secondary';
          }
        }
      }

      const scheduledTime = dayjs(endDate).format('HH:mm');
      const formatActualTime = (data: any) => {
        if (!data || !data.time) return '...';
        const date = new Date(data.time);
        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };
      const actualTime = formatActualTime(checkOutData);

      return (
        <div
          onClick={() => info.row.toggleExpanded()}
          className={`p-1 size-sm cursor-pointer inline-flex items-center px-2 py-0.5 rounded-md border ${colorClass} text-sm w-full justify-center`}
        >
          <span>{scheduledTime}</span>
          <span className='mx-1'>→</span>
          <span>{actualTime}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'Estado',
  },
  {
    id: 'duración',
    accessorKey: 'duration',
    size: 120,
    header: 'Duración',
    cell: (info) => {
      const rowData = info.row.original;
      const checkInData = rowData.checkIn;
      const checkOutData = rowData.checkOut;
      let dateDifferent = { hours: 0, minutes: 0 };
      let checkDifferent = { hours: 0, minutes: 0 };

      if (rowData.start && rowData.end) {
        dateDifferent = calculateDuration(rowData.start, rowData.end);
      }

      if (checkInData?.time && checkOutData?.time) {
        checkDifferent = calculateDuration(checkInData.time, checkOutData.time);
      }

      return (
        <div className='inline-flex items-center px-2 py-0.5 text-sm'>
          <span>
            {dateDifferent.hours}h {dateDifferent.minutes}m
          </span>
          <span className='mx-1'>→</span>
          <span>
            {checkDifferent.hours}h {checkDifferent.minutes}m
          </span>
        </div>
      );
    },
  },
  {
    id: 'report',
    accessorKey: 'report',
    size: 50,
    header: 'Reportes',
    cell: (info) => (
      <div
        className='inline-flex items-center px-2 py-0.5 text-sm rounded-md border'
        onClick={() => info.row.toggleExpanded()}
      >
        <span>2</span>
        <span className='mx-1'>→</span>
        <span>12h</span>
      </div>
    ),
  },
  {
    id: 'shift',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Actividades',
    cell: (info: any) => {
      // TODO: AJUSTAR EL PROGRESS
      const progress = Math.floor(Math.random() * 101);

      let progressColor = '#E05858';

      if (progress >= 30 && progress < 70) {
        progressColor = '#FFC772';
      } else if (progress >= 70) {
        progressColor = '#00BDD6';
      }

      return (
        <div
          onClick={() => info.row.toggleExpanded()}
          className=' p-1 size-sm cursor-pointer flex flex-row justify-center'
        >
          <Gauge progress={progress} color={progressColor} />
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
      // TODO: AJUSTAR EL PROGRESS
      const progress = Math.floor(Math.random() * 101);

      let progressColor = '#E05858';

      if (progress >= 30 && progress < 70) {
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
    id: 'client',
    accessorKey: 'service.contract.client.name',
    size: 120,
    header: 'Cliente',
    enableGrouping: true,
    cell: (info) => {
      const contract = String(info.getValue());
      return (
        <span
          className='p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {contract}
        </span>
      );
    },
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;

      const actions: IDropdownAction[] = [
        {
          label: 'Editar usuario',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        {
          label: 'Eliminar usuario',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return <DropdownActionsMenu actions={actions} />;
    },
  },
];

const calculateDuration = (start: string, end: string) => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  const diffMs = endTime.diff(startTime);

  // Crear una duración a partir de esa diferencia
  const duration = dayjs.duration(diffMs);

  // Obtener horas y minutos
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  console.log('hours', hours);
  console.log('minutes', minutes);
  return {
    hours: hours,
    minutes: minutes,
  };
};
