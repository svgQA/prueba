import { FunctionComponent } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';

import dayjs from 'dayjs';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IDropdownAction, DropdownActionsMenu } from '@/components/common/table/components/dropdown.actions.menu';

// Define our custom properties
type CustomColumnProps = {
  iconGroup?: string;
  colorIconGroup?: string;
  getIconGroup?: (row: Memo) => { icon: string; color: string };
};

// Create a type that combines ColumnDef with our custom properties
type CustomColumnDef<TData> = ColumnDef<TData> & CustomColumnProps;
// import i18next from 'i18next';

// Función para obtener traducciones
// const t = (key: string) => i18next.t(key);

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

export const getColumns = (
  onClickAction: (params: { id: string; type: string; action: ROW_ACTIONS }) => void
): CustomColumnDef<Memo>[] => [
    // {
    //   id: 'id',
    //   accessorKey: 'id',
    //   header: 'ID',
    //   cell: (info) => (
    //     <div className='flex items-center'>
    //       <span>{String(info.getValue())}</span>
    //     </div>
    //   ),
    // },
    // {
    //   id: 'city',
    //   accessorKey: 'city',
    //   header: 'Ciudad',
    // },
    // {
    //   id: 'address',
    //   accessorKey: 'address',
    //   header: 'Dirección',
    //   cell: (info) => <span>{String(info.getValue())}</span>,
    // },
    // {
    //   id: 'noveltyDate',
    //   accessorKey: 'noveltyDate',
    //   header: 'Fecha Novedad',
    //   cell: (info) => <FormattedDate date={info.getValue() as string} />,
    // },
    // {
    //   id: 'contact',
    //   accessorKey: 'contact',
    //   header: 'Contacto',
    // },
    {
      id: 'noveltyType',
      accessorKey: 'novelty.name',
      header: 'Novedad',
      enableGrouping: true,
      getIconGroup: (row: Memo) => {
        if (row.priority === 5) {
          return { icon: '165', color: 'text-error' };
        }

        if (row.priority === 4) {
          return { icon: '182', color: 'text-caution' };
        }

        return { icon: '319', color: 'text-primary' };
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Descripción',
      enableGrouping: true,
    },
    {
      id: 'name',
      accessorFn: (row) => `${row?.extraData?.client.name}`,
      header: 'Usuario',
      enableGrouping: true,
    },
    {
      id: 'status',
      accessorKey: 'state',
      header: 'Estado',
      enableGrouping: true,
      cell: (info: any) => {
        const status = info.getValue() as string;
        let statusText = status;
        let bgColor = 'bg-primary-opacity';
        let textColor = 'text-primary';

        if (status === 'OPENED') {
          statusText = 'En Revisión';
          bgColor = 'bg-secondary-opacity';
          textColor = 'text-secondary';
        }

        return (
          <div className='flex flex-row justify-start'>
            <span className='p-1 size-sm cursor-pointer'>
              <div
                className={`px-3 py-1 rounded-full font-medium text-sm ${bgColor} ${textColor}`}
              >
                {statusText}
              </div>
            </span>
          </div>
        );
      },
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Prioridad',
      enableGrouping: true,
      cell: (info: any) => {
        const priority = info.getValue() as number;
        let bgColor = 'bg-primary-opacity';
        let textColor = 'text-primary';

        if (priority === 5) {
          bgColor = 'bg-error-opacity';
          textColor = 'text-error';
        } else if (priority === 4) {
          bgColor = 'bg-caution-opacity';
          textColor = 'text-caution';
        }

        return (
          //   <PBadge priority={info.getValue() as 'Alta' | 'Media' | 'Baja'} />
          <div className='flex flex-row justify-start'>
            <span className='p-1 size-sm cursor-pointer'>
              <div
                className={`px-3 py-1 rounded-full font-medium text-sm ${bgColor} ${textColor}`}
              >
                {priority === 5 ? 'Alta' : ''}
                {priority === 4 ? 'Media' : ''}
                {priority !== 5 && priority !== 4 ? 'Baja' : ''}
              </div>
            </span>
          </div>
        );
      },
    },
    {
      id: 'supervisor',
      accessorKey: 'extraData.company.name',
      header: 'supervisor',
      enableGrouping: true,
      meta: { expander: 'extraData' },
      cell: (info) => {
        return (
          <span
            className=' p-1 size-sm cursor-pointer'
            onClick={() => info.row.toggleExpanded()}
          >
            {info.getValue() as string}
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
            label: 'Editar memo',
            icon: 'vox-icon vx-icon-123 text-primary',
            onClick: () => {
              onClickAction({ id: String(id), type: 'memo', action: ROW_ACTIONS.UPDATE });
            },
          },
          {
            label: 'Eliminar memo',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () => {
              onClickAction({ id: String(id), type: 'memo', action: ROW_ACTIONS.DELETE });
            },
          },
        ];

        return (
          <div className="w-full flex justify-center">
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    }

  ];
