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
import { Badge } from '@/components/common/badge/badge';
import { NColumnDef } from '@/components/common/table/type';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): NColumnDef<IShiftResponse>[] => [
  {
    id: 'employee',
    clickable: true,
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
    clickable: true,
    enableGrouping: true,
    cell: (info) => {
      const service = String(info.getValue());
      return <TextEllipsis text={service} maxWidth='250px' />;
    },
  },
  {
    id: 'contract',
    accessorKey: 'service.contract.name',
    size: 120,
    header: 'Contrato',
    clickable: true,
    cell: (info) => {
      const contract = String(info.getValue());
      return <TextEllipsis text={contract} maxWidth='250px' />;
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
    clickable: true,
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
            colorClass = 'success'; // On time
          } else if (checkInTime > tenMinutesAfter) {
            colorClass = 'info'; // Early
          } else {
            colorClass = 'warning'; // Late
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
        <Badge
          label={`${scheduledTime} → ${actualTime}`}
          status={colorClass as 'info' | 'error' | 'warning' | 'success'}
          outline
          full
          size='xs'
        />
      );
    },
  },
  {
    id: 'time-end',
    accessorKey: 'end',
    size: 150,
    clickable: true,
    header: 'Finalización',
    cell: (info) => {
      const rowData = info.row.original;
      const checkOutData = rowData.checkOut;
      const endDate = new Date(rowData.end);

      let colorClass = 'success';

      if (checkOutData?.location) {
        if (checkOutData?.time) {
          const checkInTime = new Date(checkOutData.time);
          const tenMinutesBefore = new Date(endDate);
          const tenMinutesAfter = new Date(endDate);

          tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
          tenMinutesAfter.setMinutes(tenMinutesAfter.getMinutes() + 10);

          if (checkInTime <= endDate && checkInTime < tenMinutesBefore) {
            colorClass = 'warning';
          } else if (checkInTime > tenMinutesAfter) {
            colorClass = 'error';
          } else {
            colorClass = 'success';
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
        <Badge
          label={`${scheduledTime} → ${actualTime}`}
          status={colorClass as 'info' | 'error' | 'warning' | 'success'}
          outline
          full
          size='xs'
        />
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
    id: 'duration',
    accessorKey: 'duration',
    size: 120,
    header: 'Duración',
    clickable: true,
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
    cell: (_: any) => <Badge label={`2 → 12h`} outline full size='xs' />,
  },
  {
    id: 'shift',
    accessorKey: 'activitiesProgress',
    clickable: true,
    size: 50,
    header: 'Actividades',
    cell: (info: any) => {
      const { activityPct } = info.row.original;
      const progress = activityPct;

      let progressColor = '#E05858';

      if (progress >= 30 && progress < 70) {
        progressColor = '#FFC772';
      } else if (progress >= 70) {
        progressColor = '#00BDD6';
      }

      return <Gauge progress={progress} color={progressColor} />;
    },
  },
  {
    id: 'round',
    accessorKey: 'activitiesProgress',
    size: 100,
    clickable: true,
    header: 'Rondas',
    cell: (info: any) => {
      const { roundPct } = info.row.original;
      const progress = roundPct;

      let progressColor = '#E05858';

      if (progress >= 30 && progress < 70) {
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
    id: 'client',
    accessorKey: 'service.contract.client.name',
    size: 120,
    clickable: true,
    header: 'Cliente',
    enableGrouping: true,
    cell: (info) => {
      const client = String(info.getValue());
      return <TextEllipsis text={client} maxWidth='250px' />;
    },
  },
  {
    id: 'actions',
    size: 10,
    cell: (info) => {
      const { id, checkIn, checkOut } = info.row.original;
      const s_id = String(id);
      const model = checkOut
        ? []
        : [
            {
              label: !checkIn ? 'Marcar check-in' : 'Marcar check-out',
              icon: 'vox-icon vx-icon-312 text-primary',
              onClick: () => {
                onClickAction({
                  id: s_id,
                  type: 'shift',
                  action: !checkIn
                    ? ROW_ACTIONS.CHECK_IN
                    : ROW_ACTIONS.CHECK_OUT,
                });
              },
            },
          ];

      const actions: IDropdownAction[] = [
        {
          label: 'Editar turno',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: s_id,
              type: 'shift',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        ...model,
        {
          label: 'Eliminar turno',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: s_id,
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
  return {
    hours: hours,
    minutes: minutes,
  };
};
