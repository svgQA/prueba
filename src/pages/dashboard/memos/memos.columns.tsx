import { FunctionComponent } from 'preact';
import { ChevronDown, ChevronUp, Calendar, Shield, Key } from 'lucide-react'; // Importar el ícono Key
import { ColumnDef } from '@tanstack/react-table';
import { Memo } from './memos.d';

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
    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);

export const FormattedDate: FunctionComponent<{ date: string }> = ({
  date,
}) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  const formattedDateStr = `${day}-${month}-${year} ${hours}:${minutes}`;

  return (
    <div className='flex items-center'>
      <Calendar className='mr-2 text-cyan-500' size={16} />
      <span>{formattedDateStr}</span>
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
      <Shield className='mr-2' size={20} />
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
        <Key className='text-cyan-500 mr-2' size={16} />
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
    header: () => <div className='text-right'>Más</div>,
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <button
          onClick={() => row.toggleExpanded()}
          className='flex items-center'
        >
          {row.getIsExpanded() ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>
    ),
  },
];
