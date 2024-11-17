import { FunctionComponent } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';
import { PBadge } from '@/components/common';

import dayjs from 'dayjs';

export const ProgressBar: FunctionComponent<{ progress: number }> = ({
  progress,
}) => (
  <div className='flex items-center w-full'>
    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
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
    className='rounded-full hover:bg-gray-200 transition-colors duration-200'
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
      <span className='vx-icon-025" size-sm'></span>
      <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
    </div>
  );
};

export const columns: ColumnDef<Memo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <div className='flex items-center'>
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
      <PBadge priority={info.getValue() as 'Alta' | 'Media' | 'Baja'} />
    ),
  },
];
