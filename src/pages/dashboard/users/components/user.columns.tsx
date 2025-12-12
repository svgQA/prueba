import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/common/badge/badge';
import { IUserResponse } from '@/types/auth/service';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { Avatar } from '@/components/common/Avatar';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { getPermissionByModuleState } from '@/store/signals/access/permission';
import i18n from '@/i18n';

export const getColumns = (
  t: any,
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
    header: 'h_user',
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { name, surname, image } = info.row.original;
      return (
        <div className='flex items-center gap-2'>
          <Avatar name={name} src={image} size='sm' square />
          <TextEllipsis text={`${name} ${surname}`} maxWidth='250px' />
        </div>
      );
    },
  },
  {
    id: 'cardId',
    accessorKey: 'cardId',
    size: 180,
    header: 'h_identification',
    meta: { headerAlign: 'center' },
  },
  {
    id: 'email',
    accessorKey: 'email',
    size: 180,
    header: 'h_email',
    meta: { headerAlign: 'center' },
  },
  {
    id: 'company',
    // accessorKey: 'companies',
    accessorFn: (row) =>
      row.companies.map((company) => company.company.name).join(', '),
    size: 180,
    header: 'h_company',
    meta: { headerAlign: 'center' },
    enableGrouping: true,
    cell: (info) => {
      const { companies } = info.row.original;
      return (
        <div className='flex justify-center gap-1 flex-row'>
          {companies.map((company) => (
            <div key={company.id} className='flex items-center gap-2'>
              <Avatar name={company.company.name} size='sm' square />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'department',
    accessorKey: 'extraData.state.label',
    size: 180,
    header: 'h_department',
    meta: { headerAlign: 'center' },
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.state?.label;
      return <TextEllipsis text={value} maxWidth='150px' />;
    },
  },
  {
    id: 'ciudad',
    accessorKey: 'extraData.city.label',
    size: 180,
    header: 'h_city',
    meta: { headerAlign: 'center' },
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.city?.label;
      return <TextEllipsis text={value} maxWidth='150px' />;
    },
  },
  {
    id: 'connections',
    accessorKey: 'connectionStatus',
    header: 'h_connection',
    meta: { headerAlign: 'center' },
    size: 100,
    cell: (info) => {
      const { userType } = info.row.original;
      const lastConnection = (info.row.original as any).lastConnection;
      if (userType !== 'CLIENT') {
        let iconColor = 'text-blue-500';

        if (lastConnection) {
          const lastConnectionDate = new Date(lastConnection);
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          iconColor =
            lastConnectionDate >= oneWeekAgo
              ? 'text-green-400'
              : 'text-red-400';
        }

        return (
          <div className='flex flex-row justify-center items-center'>
            <span className={`vx-icon vx-icon-user-status ${iconColor}`} />
          </div>
        );
      }
    },
  },
  {
    id: 'openRate',
    header: 'h_progress',
    meta: { headerAlign: 'center' },
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
    id: 'userType',
    accessorKey: 'userType',
    header: 'h_type',
    meta: { headerAlign: 'center' },
    size: 20,
    cell: (info) => {
      return (
        <div className='flex justify-center items-center'>
          <Badge label={info.getValue() as string} />
        </div>
      );
    },
  },
  {
    id: 'actions',
    meta: { headerAlign: 'center' },
    header: 'h_action',
    size: 20,
    cell: (info) => {
      const { id, userType, cognitoId } = info.row.original;
      const isClient = userType != 'EXTERNAL' && userType != 'CLIENT';
      const actions: IDropdownAction[] = [
        // ...(isClient
        //   ? []
        //   : [
        //       {
        //         label: 'profile',
        //         icon: 'vox-icon vx-icon-229 text-primary',
        //         onClick: () => {
        //           onClickAction({
        //             id: String(id),
        //             type: 'form',
        //             action: ROW_ACTIONS.PROFILE,
        //           });
        //         },
        //       },
        //     ]),
        ...(isClient &&
        getPermissionByModuleState('user', 'profile') &&
        !cognitoId
          ? [
              {
                label: 'profile',
                icon: 'vox-icon vx-icon-229 text-primary',
                onClick: () => {
                  onClickAction({
                    id: String(id),
                    type: 'form',
                    action: ROW_ACTIONS.PROFILE,
                  });
                },
              },
            ]
          : []),
        ...(getPermissionByModuleState('user', 'upsert')
          ? [
              {
                label: t('actions.edit'),
                icon: 'vox-icon vx-icon-123 text-primary',
                onClick: () => {
                  onClickAction({
                    id: String(id),
                    type: 'shift',
                    action: ROW_ACTIONS.UPDATE,
                  });
                },
              },
            ]
          : []),
        ...(getPermissionByModuleState('user', 'delete')
          ? [
              {
                label: t('actions.delete'),
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
            ]
          : []),
      ];

      if (actions.length === 0) {
        actions.push({
          label: i18n.t('permissions.denied'),
          icon: 'text-red-500',
          color: 'text-red-600',
          onClick: () => {},
        });
      }

      return (
        <div className='w-full flex justify-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
