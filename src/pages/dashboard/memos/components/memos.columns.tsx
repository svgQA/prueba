import { FunctionComponent } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';

import dayjs from 'dayjs';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { Badge } from '@/components/common/badge/badge';
import { Avatar } from '@/components/common/Avatar';

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
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): CustomColumnDef<Memo>[] => [
  {
    id: 'name',
    accessorFn: (row) => `${row?.extraData?.client.name}`,
    header: 'Usuario',
    enableGrouping: true,
    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <div className='flex items-center gap-2 justify-start'>
          <Avatar name={name} size='sm' square />
          {name}
        </div>
      );
    },
  },
  {
    id: 'noveltyType',
    accessorKey: 'novelty.name',
    header: 'Novedad',
    enableGrouping: true,
    getIconGroup: (row: Memo) => {
      if (row.priority === 'Alta') {
        return { icon: '165', color: 'text-error' };
      }

      if (row.priority === 'Media') {
        return { icon: '182', color: 'text-caution' };
      }

      return { icon: '319', color: 'text-primary' };
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Descripción',
    size: 200,
    enableGrouping: true,
    cell: (info) => {
      const description = info.getValue() as string;
      return (
        <div className='max-w-[300px]'>
          <span className='block truncate' title={description}>
            {description}
          </span>
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'state',
    header: 'Estado',
    enableGrouping: true,
    cell: (info: any) => {
      const status = info.getValue() as string;
      let statusText = 'info';
      if (status === 'OPENED') {
        statusText = 'success';
      } else if (status === 'CLOSED') {
        statusText = 'error';
      } else if (status === 'IN_REVISION') {
        statusText = 'warning';
      }

      return (
        <Badge
          label={status}
          status={statusText as 'info' | 'error' | 'warning' | 'success'}
          full
          outline
        />
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
      let status = 'info';
      let label = 'Baja';
      if (priority === 5) {
        status = 'error';
        label = 'Alta';
      } else if (priority === 4) {
        status = 'warning';
        label = 'Media';
      }

      return (
        <Badge
          label={label}
          status={status as 'info' | 'error' | 'warning' | 'success'}
          full
          outline
        />
      );
    },
  },
  {
    id: 'supervisor',
    accessorKey: 'extraData.company.name',
    header: 'Supervisor',
    enableGrouping: true,
    meta: { expander: 'extraData' },
    cell: (info) => {
      const supervisor = info.getValue() as string;
      return (
        <div className='flex items-center gap-1 justify-start'>
          <Avatar name={supervisor} size='sm' square />
          {supervisor}
        </div>
      );
    },
  },
  {
    id: 'updatedBy',
    accessorKey: 'userEdit',
    header: 'Actualizado Por',
    cell: (info) => {
      const value = info.getValue() as string;
      const displayValue = value?.trim()
        ? value
        : info.row.original?.extraData?.client?.name;
      return (
        <div className='flex items-center gap-1 justify-start'>
          <Avatar name={displayValue} size='sm' square />
          <p
            className='p-1 size-sm cursor-pointer'
            onClick={() => info.row.toggleExpanded()}
          >
            {displayValue}
          </p>
        </div>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Fecha',
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
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      const actions: IDropdownAction[] = [
        {
          label: 'Editar memo',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'memo',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        {
          label: 'Eliminar memo',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'memo',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return <DropdownActionsMenu actions={actions} />;
    },
  },
];
