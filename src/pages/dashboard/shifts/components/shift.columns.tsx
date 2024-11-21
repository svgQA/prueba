import { FunctionComponent } from 'preact';
import { Shift } from '../utils/shifts';
import { ColumnDef } from '@tanstack/react-table';

// Componente para el ícono de envío
interface SendIconProps {
  onClick: () => void;
}
export const SendIcon: FunctionComponent<SendIconProps> = ({ onClick }) => (
  <button onClick={onClick} className='text-blue-500 hover:text-blue-700'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
    </svg>
  </button>
);

// Componente para mostrar las notificaciones
interface NotificationBadgeProps {
  count: number;
}
export const NotificationBadge: FunctionComponent<NotificationBadgeProps> = ({
  count,
}) => (
  <span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-180 bg-red-600 rounded-full'>
    {count}
  </span>
);

// Barra de progreso para mostrar el estado de las actividades
interface ProgressBarProps {
  progress: number;
}
export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  progress,
}) => (
  <div className='flex items-center w-full'>
    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2'>
      <div
        className='bg-blue-600 h-2.5 rounded-full'
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <span className='text-sm font-medium'>{progress}%</span>
  </div>
);

// Botones de acción para editar o eliminar
interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}
export const ActionButtons: FunctionComponent<ActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => (
  <div className='flex space-x-2'>
    <button onClick={onEdit} className='text-blue-500 hover:text-blue-700'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
      </svg>
    </button>
    <button onClick={onDelete} className='text-red-500 hover:text-red-700'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 180-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
    </button>
  </div>
);

// Ícono para expandir/cerrar las filas
interface InfoIconProps {
  onClick: () => void;
  isExpanded: boolean;
}
export const InfoIcon: FunctionComponent<InfoIconProps> = ({
  onClick,
  isExpanded,
}) => (
  <button
    onClick={onClick}
    className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
  >
    <span
      className={`vx-icon mx-1 vx-${isExpanded ? 'logo' : 'sensor'} size-sm`}
    />
  </button>
);

// Agregamos columnas de "Ciudad" y "Dirección"
export const columns: ColumnDef<Shift>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
    // cell: (info) => (
    //   <div className='flex items-center w-20 bg-blue-300'>
    //     <span>{String(info.getValue())}</span>
    //   </div>
    // ),
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
    // cell: (info: any) => info.getValue(), // Renderiza la ciudad
  },
  {
    id: 'address',
    accessorKey: 'address',
    size: 180,
    header: 'Dirección',
    // cell: (info: any) => info.getValue(), // Renderiza la dirección
  },
  {
    id: 'startTime',
    accessorKey: 'startTime',
    size: 180,
    header: 'Hora inicio',
    //   cell: (info: any) =>
    //     new Date(info.getValue() as string).toLocaleTimeString(),
  },
  {
    id: 'endTime',
    accessorKey: 'endTime',
    size: 180,
    header: 'Hora fin',
    //   cell: (info: any) =>
    //     new Date(info.getValue() as string).toLocaleTimeString(),
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
    size: 180,
    header: 'Notificaciones',
    cell: (info: any) => (
      <NotificationBadge count={info.getValue() as number} />
    ),
  },
  {
    id: 'activitiesProgress',
    accessorKey: 'activitiesProgress',
    size: 180,
    header: 'Progreso',
    cell: (info: any) => <ProgressBar progress={info.getValue() as number} />,
  },
  {
    id: 'actions',
    size: 180,
    header: 'Acciones',
    cell: () => (
      <ActionButtons
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    ),
  },
];
