import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Badge } from '@/components/common/badge/badge';
import { Avatar } from '@/components/common/Avatar';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { NColumnDef } from '@/components/common/table/type';
import { FloatBadge } from '@/components/common/badge/float';
import { FormattedDate } from '@/components/compose/forms';

type CustomColumnProps = {
  iconGroup?: string;
  colorIconGroup?: string;
  getIconGroup?: (row: Memo) => { icon: string; color: string };
};

// Create a type that combines ColumnDef with our custom properties
type CustomColumnDef<TData> = ColumnDef<TData> &
  CustomColumnProps &
  NColumnDef<TData>;

export const getColumns = (
  _onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): CustomColumnDef<Memo>[] => {
  return [
    {
      id: 'name',
      // accessorFn:(row) => `${row?.extraData?.client.name}`,
      header: 'h_user',
      accessorKey: 'user.name',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        // const name = info.getValue() as string;
        const { name, surname } = info.row?.original?.user;
        return (
          <div className='flex items-center gap-2 justify-start'>
            <Avatar name={name} size='sm' square />
            {name} {surname}
          </div>
        );
      },
    },
    {
      id: 'noveltyType',
      accessorFn: (row) => `${row?.novelty?.name}`,
      // accessorKey: 'novelty.name',
      header: 'h_novelty',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
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
      header: 'h_description',
      size: 200,
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const description = info.getValue() as string;
        return <TextEllipsis text={description} maxWidth='300px' />;
      },
    },
    {
      id: 'status',
      accessorKey: 'state',
      header: 'h_status',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
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
      header: 'h_priority',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info: any) => {
        const priority = info.getValue() as string;
        let status = 'info';
        if (priority === 'Alta') {
          status = 'error';
        } else if (priority === 'Media') {
          status = 'warning';
        }

        return (
          <Badge
            label={priority}
            status={status as 'info' | 'error' | 'warning' | 'success'}
            full
            outline
          />
        );
      },
    },
    /*
    {
      id: 'shift',
      // accessorKey: 'relatedShift.employee.name',
      accessorFn: (row) => `${row?.relatedShift?.employee?.name}`,
      header: 'h_shift',
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const relatedShift = info.row.original?.relatedShift;
        const { id } = relatedShift?.employee || {
          // name: '',
          // surname: '',
          id: '',
        };
        return (
          <FloatBadge label={id}>
            <Badge label={relatedShift?.status} width='w-auto' />
          </FloatBadge>
        );
      },
    },
  {
    id: 'updatedBy',
    accessorKey: 'userEdit.name',
    header: t('memos.columns.name'),
    cell: (info) => {
      const value = info.getValue() as string;
      const displayValue = value?.trim()
        ? value
        : info.row.original?.extraData?.client?.name;
      return (
        <div className='flex items-center gap-1 justify-start'>
          <Avatar name={displayValue} size='sm' square />
          {displayValue}
        </div>
      );
    },
  },
  */
    {
      id: 'history',
      accessorKey: 'messages',
      header: 'h_history',
      clickable: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <div className='flex items-center gap-1 justify-center'>
            <FloatBadge label={value || '-'}>
              <span className='vx-icon vx-icon-113 cursor-pointer'></span>
            </FloatBadge>
          </div>
        );
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'h_created',
      meta: { headerAlign: 'center' },
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: 'h_updated',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
  ];
};
