import { IReportResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
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
): ColumnDef<IReportResponse>[] => [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'h_title',
    size: 200,
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
    accessorKey: 'subtitle',
    id: 'subtitle',
    header: 'subtitle',
    size: 200,
    cell: (info) => <TextEllipsis text={info.getValue() as string} maxWidth='250px' />,
  },
  {
    accessorKey: 'description',
    id: 'description',
    header: 'Descripción',
    size: 200,
    cell: (info) => <TextEllipsis text={info.getValue() as string} maxWidth='250px' />,
  },
  {
    accessorKey: 'period',
    id: 'period',
    header: 'Periodo',
    size: 100,
    cell: (info) => info.getValue(),
  },
  {
    id: 'modules',
    header: 'Módulos',
    size: 200,
    cell: (info) => {
      const extraData = info.row.original.extraData as any;
      if (extraData && Array.isArray(extraData.modules)) {
        return extraData.modules.map((m: any) => m.name).join(', ');
      }
      return '-';
    },
  },
  {
    id: 'projects',
    header: 'Proyectos',
    size: 200,
    cell: (info) => {
      const extraData = info.row.original.extraData as any;
      if (extraData && Array.isArray(extraData.projects)) {
        return extraData.projects.map((p: any) => p.name).join(', ');
      }
      return '-';
    },
  },
  {
    id: 'emails',
    header: 'Correos',
    size: 250,
    cell: (info) => {
      const extraData = info.row.original.extraData as any;
      if (extraData && Array.isArray(extraData.emails)) {
        return extraData.emails.join(', ');
      }
      return '-';
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    size: 50,
    header: 'h_updated',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    id: 'action',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;
      const actions: IDropdownAction[] = [
        // {
        //   label: 'update',
        //   icon: 'vox-icon vx-icon-123 text-primary',
        //   onClick: () => {
        //     onClickAction({
        //       id: String(id),
        //       type: 'form',
        //       action: ROW_ACTIONS.UPDATE,
        //     });
        //   },
        // },
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
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
