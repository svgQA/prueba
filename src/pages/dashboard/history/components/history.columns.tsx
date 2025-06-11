import { ColumnDef } from '@tanstack/react-table';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';
import { Badge } from '@/components/common/badge/badge';
import { FloatBadge } from '@/components/common/badge/float';
import { useTranslation } from 'react-i18next';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<INotificationListItem>[] => {
  const { t } = useTranslation();

  return [
    {
      id: 'title',
      accessorKey: 'title',
      header: t('history.columns.title'),
      size: 200,
      cell: (info) => (
        <TextEllipsis text={String(info.getValue())} maxWidth='200px' />
      ),
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: t('history.columns.description'),
      size: 250,
      cell: (info) => (
        <TextEllipsis text={String(info.getValue())} maxWidth='250px' />
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: t('history.columns.type'),
      size: 120,
      cell: (info) => {
        const type = String(info.getValue());
        return (
          <Badge
            status={type === t('history.types.users') ? 'success' : 'warning'}
            label={type}
            outline
          />
        );
      },
    },
    {
      id: 'sentAt',
      accessorKey: 'sentAt',
      header: t('history.columns.sentDate'),
      size: 180,
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='human' />;
      },
    },
    {
      id: 'recipients',
      accessorKey: 'recipients',
      header: t('history.columns.recipients'),
      size: 100,
      cell: (info) => (
        <div className='flex items-center gap-2'>
          <FloatBadge label={Number(info.getValue())}>
            <span className='vox-icon vx-icon-340 text-lg' />
          </FloatBadge>
        </div>
      ),
    },
    {
      id: 'openRate',
      accessorKey: 'openRate',
      header: t('history.columns.openRate'),
      size: 150,
      cell: (info) => {
        const openRate = Number(info.getValue());

        let barColor = 'bg-caution';
        if (openRate >= 70) barColor = 'bg-m6';
        else if (openRate <= 30) barColor = 'bg-error';

        return (
          <div className='flex items-center gap-2 w-full'>
            <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className={`h-full ${barColor}`}
                style={{ width: `${openRate}%` }}
              />
            </div>
            <span className='text-xs font-semibold'>{openRate}%</span>
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
            label: t('history.actions.reschedule'),
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
            label: t('history.actions.delete'),
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
};
