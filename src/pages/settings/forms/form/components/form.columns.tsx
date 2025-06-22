import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IFormResponse>[] => [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'h_title',
    size: 300,
    cell: (info) => {
      const { title, description } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-md' />
          <div className='flex flex-col ml-3 text-left'>
            <h5 className='font-bold text-left'>{title}</h5>
            <TextEllipsis text={description} maxWidth='250px' />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'group',
    id: 'group',
    size: 300,
    header: 'h_group',
    cell: (info) => {
      const { group } = info.row.original as any;
      return (
        <div className='flex items-center'>
          <Avatar
            name={group?.name || 'group'}
            src={group?.image}
            size='sm'
            square
          />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>{group?.name || 'group'}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    size: 50,
    header: 'h_created',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    size: 50,
    header: 'h_updated',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'category',
    id: 'category',
    size: 250,
    header: 'h_category',
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'action',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id, report } = info.row.original;
      const actions: IDropdownAction[] = [
        {
          label: 'update',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'form',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        ...(report
          ? [
              {
                label: 'report',
                icon: 'vox-icon vx-icon-143 text-primary',
                onClick: () => {
                  onClickAction({
                    id: String(id),
                    type: 'form',
                    action: ROW_ACTIONS.REPORT,
                  });
                },
              },
            ]
          : []),
        {
          label: 'delete',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'form',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-center items-center'>
          <Button
            name='continue'
            label='response'
            icon='030'
            unpadded
            onClick={() => {
              onClickAction({
                id: String(id),
                type: 'form',
                action: ROW_ACTIONS.RESPONSE,
              });
            }}
          ></Button>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
