import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/common/badge/badge';
import { IUserResponse } from '@/types/auth/service';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import i18next from 'i18next';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { Avatar } from '@/components/common/Avatar';
import { TextEllipsis } from '@/components/common/text-ellipsis';
// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IUserResponse>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: t('users.columns.name'),
    cell: (info) => {
      const { name, surname, image } = info.row.original;
      return (
        <div className='flex items-center gap-2'>
          <Avatar name={name} src={image} size='sm' square />
          <TextEllipsis text={`${name} ${surname}`} maxWidth='250px' />
          {/*
          <span
            className='p-1 size-sm cursor-pointer text-left'
            // onClick={() => info.row.toggleExpanded()}
          >
            {`${name} ${surname}`}
          </span>
          */}
        </div>
      );
    },
  },
  {
    id: 'cardId',
    accessorKey: 'cardId',
    size: 180,
    header: t('users.columns.id'),
  },
  {
    id: 'email',
    accessorKey: 'email',
    size: 180,
    header: t('users.columns.email'),
  },
  {
    id: 'company',
    accessorKey: 'companies',
    size: 180,
    header: t('users.columns.company'),
    enableGrouping: true,
    cell: (info) => {
      const { companies } = info.row.original;
      return (
        <div className='flex justify-center gap-1 flex-row'>
          {companies.map((company) => (
            <div key={company.id} className='flex items-center gap-2'>
              <Avatar name={company.company.name} size='sm' square />
              {/* <span>{company.company.name}</span> */}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'department',
    accessorKey: 'extraData.state',
    size: 180,
    header: t('users.columns.department'),
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.state;
      return <div className='flex justify-center'>{value}</div>;
    },
  },
  {
    id: 'ciudad',
    accessorKey: 'extraData.city',
    size: 180,
    header: t('users.columns.city'),
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.city;
      return <div className='flex justify-center'>{value}</div>;
    },
  },
  {
    id: 'conections',
    accessorKey: 'conections',
    header: 'Conexión',
    size: 100,
    cell: (info) => {
      const value = info.getValue() as number;

      let iconColor = 'success' as 'success' | 'error' | 'info' | 'warning'; // secondary por defecto
      if (value >= 1 && value < 3) {
        iconColor = 'error'; // error
      } else if (value >= 3) {
        iconColor = 'info'; // gray-text-light
      }

      return (
        <div className='flex items-center justify-center gap-2'>
          <Badge icon='user-status' status={iconColor} size='md' width='w-16' />
        </div>
      );
    },
  },
  {
    id: 'openRate',
    header: 'Tasa de apertura',
    size: 150,
    cell: (info) => {
      const { tasks } = info.row.original as {
        tasks?: { assigned: number; resolved: number };
      };
      const assignedTasks = tasks?.assigned ?? 0;
      const resolvedTasks = tasks?.resolved ?? 0;

      const hasTasks = assignedTasks > 0;
      const openRate = hasTasks
        ? Math.round((resolvedTasks / assignedTasks) * 100)
        : 0;

      let barColor = 'bg-caution';
      if (openRate >= 70) barColor = 'bg-m6';
      else if (openRate <= 30) barColor = 'bg-error';

      return (
        <div className='flex items-center gap-2 w-full'>
          <div className='flex-1 h-2 bg-b-light-dark dark:bg-b-dark-light rounded-full overflow-hidden'>
            {hasTasks && (
              <div
                className={`h-full ${barColor}`}
                style={{ width: `${openRate}%` }}
              />
            )}
          </div>
          <span className='text-xs font-semibold'>
            {hasTasks ? `${openRate}%` : '%'}
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

      const actions: IDropdownAction[] = [
        {
          label: t('user.columns.actions.profile'),
          icon: 'vox-icon vx-icon-229 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'form',
              action: ROW_ACTIONS.PROFILE,
            });
          },
        },
        {
          label: t('user.columns.actions.edit'),
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
          label: t('user.columns.actions.delete'),
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

      return (
        <div className='w-full flex justify-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
