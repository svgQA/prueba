import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import dayjs from 'dayjs';
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
        <span
          className='p-1 size-sm cursor-pointer text-left'
          onClick={() => info.row.toggleExpanded()}
        >
          {employee?.name} {employee?.surname}
        </span>
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
        console.error('Error al formatear la fecha:', error);
        return '-';
      }
    },
  },
  {
    id: 'start-time',
    accessorKey: 'start',
    size: 150,
    header: 'Inicio',
    cell: (info) => {
      const rowData = info.row.original;
      const checkInData = rowData.checkIn;
      const endDate = new Date(rowData.end);
      const now = new Date();

      let colorClass = 'border-gray-500 text-gray-700';

      if (checkInData?.location) {
        const twoDaysBefore = new Date(endDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

        if (now < twoDaysBefore) {
          colorClass = 'border-primary text-primary';
        } else if (now <= endDate) {
          colorClass = 'border-secondary text-secondary';
        } else {
          colorClass = 'border-error text-error';
        }
      }

      const scheduledTime = '19:00';
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
          className={`p-1 size-sm cursor-pointer inline-flex items-center px-2 py-0.5 rounded-md border ${colorClass} text-sm`}
        >
          <span>{scheduledTime}</span>
          <span className='mx-1'>→</span>
          <span>{actualTime}</span>
        </div>
      );
    },
  },
  {
    id: 'start-end',
    accessorKey: 'end',
    size: 150,
    header: 'Finalización',
    cell: (info) => {
      const rowData = info.row.original;
      const checkOutData = rowData.checkOut;
      const endDate = new Date(rowData.end);
      const now = new Date();

      let colorClass = 'border-gray-500 text-gray-700';

      if (checkOutData?.location) {
        const twoDaysBefore = new Date(endDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

        if (now < twoDaysBefore) {
          colorClass = 'border-primary text-primary';
        } else if (now <= endDate) {
          colorClass = 'border-secondary text-secondary';
        } else {
          colorClass = 'border-error text-error';
        }
      }

      const scheduledTime = '07:00';
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
          className={`p-1 size-sm cursor-pointer inline-flex items-center px-2 py-0.5 rounded-md border ${colorClass} text-sm`}
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
    id: 'duracion',
    accessorKey: 'duration',
    size: 120,
    header: 'Duración',
    cell: (info) => {
      const rowData = info.row.original;
      const checkInData = rowData.checkIn;
      const checkOutData = rowData.checkOut;
      const scheduledDuration = '12h';

      let actualDuration = '...';
      if (checkInData?.time && checkOutData?.time) {
        const checkInTime = new Date(checkInData.time);
        const checkOutTime = new Date(checkOutData.time);
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(
          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        actualDuration = `${diffHours}h ${diffMinutes}m`;
      }

      return (
        <div className='inline-flex items-center px-2 py-0.5 text-gray-700 text-sm'>
          <span>{scheduledDuration}</span>
          <span className='mx-1'>→</span>
          <span>{actualDuration}</span>
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
        className='inline-flex items-center px-2 py-0.5 text-gray-700 text-sm rounded-md border border-b-dark'
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
