import { FunctionComponent } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import { Memo } from './memos.d';
import dayjs from 'dayjs';

// Componentes adicionales que ya tenías en este archivo
export const ProgressBar: FunctionComponent<{ progress: number }> = ({
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

export const InfoIcon: FunctionComponent<{
  onClick: () => void;
  isExpanded: boolean;
}> = ({ onClick, isExpanded }) => (
  <button
    onClick={onClick}
    className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
  >
    <span
      className={`vx-icon mx-1 vx-${isExpanded ? 'logo' : 'sensor'} size-sm`}
    />
  </button>
);

export const FormattedDate: FunctionComponent<{ date: string }> = ({
  date,
}) => {
  return (
    <div className='flex items-center'>
      <span className='vx-icon mx-1 vx-sensor size-sm'></span>
      <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
    </div>
  );
};

export const PriorityBadge: FunctionComponent<{
  priority: 'Alta' | 'Media' | 'Baja';
}> = ({ priority }) => {
  const bgColor =
    priority === 'Alta'
      ? 'rgb(224,88,88)'
      : priority === 'Media'
        ? 'rgb(255,128,0)'
        : 'rgb(0,189,214)';

  return (
    <div
      className='flex items-center justify-center py-1 rounded text-white text-sm w-[90px]'
      style={{ backgroundColor: bgColor }}
    >
      <span className='vx-icon mx-1 vx-sensor size-sm'></span>
      <span>{priority}</span>
    </div>
  );
};

// Definición de las columnas
export const memosColumns: ColumnDef<Memo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    // Modificamos la celda para agregar el ícono junto al ID
    cell: (info) => (
      <div className='flex items-center'>
        <span className='vx-icon mx-1 vx-sensor size-sm'></span>
        <span>{String(info.getValue())}</span>
      </div>
    ),
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: 'Nombre',
  },
  {
    accessorKey: 'city',
    header: 'Ciudad',
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
    cell: (info) => <span>{String(info.getValue())}</span>,
  },
  {
    accessorKey: 'noveltyType',
    header: 'Tipo Novedad',
  },
  {
    accessorKey: 'noveltyDate',
    header: 'Fecha Novedad',
    cell: (info) => <FormattedDate date={info.getValue() as string} />,
  },
  {
    accessorKey: 'contact',
    header: 'Contacto',
  },
  {
    accessorKey: 'priority',
    header: 'Prioridad',
    cell: (info) => (
      <PriorityBadge priority={info.getValue() as 'Alta' | 'Media' | 'Baja'} />
    ),
  },
  {
    id: 'expand',
    // header: 'Más',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <InfoIcon
          onClick={() => row.toggleExpanded()}
          isExpanded={row.getIsExpanded()}
        />
      </div>
    ),
    header: () => <div className='text-right'>Más</div>,
  },
];
