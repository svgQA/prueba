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
    header: 'Empleado',
    enableGrouping: true,
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
    id: 'fecha',
    accessorKey: 'start',
    size: 120,
    header: 'Fecha',
    enableGrouping: false,
    cell: (info) => {
      const dateStr = info.getValue() as string;
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
    id: 'start-end',
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
          colorClass = 'border-blue-400 text-blue-700';
        } else if (now <= endDate) {
          colorClass = 'border-green-400 text-green-700';
        } else {
          colorClass = 'border-red-400 text-red-700';
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
          colorClass = 'border-blue-400 text-blue-700';
        } else if (now <= endDate) {
          colorClass = 'border-green-400 text-green-700';
        } else {
          colorClass = 'border-red-400 text-red-700';
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
    // cell: (info) => (
    //   <div className='flex flex-row justify-center'>
    //     <Badge label={String(info.getValue())} icon='123' color='bg-primary' />
    //   </div>
    // ),
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
        <div className='inline-flex items-center px-2 py-0.5 rounded-md border border-gray-500 text-gray-700 text-sm'>
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
      <div className='flex flex-col items-center justify-center'>
        <div
          onClick={() => info.row.toggleExpanded()}
          className='p-1 size-sm cursor-pointer w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium'
        >
          2
        </div>
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
