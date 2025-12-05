import { ColumnDef } from '@tanstack/react-table';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { NColumnDef } from '@/components/common/table/type';
import { FormattedDate } from '@/components/compose/forms';
import { ICOtsRequest } from '../utils/interface';

type CustomColumnProps = {
  iconGroup?: string;
  colorIconGroup?: string;
  getIconGroup?: (row: ICOtsRequest) => { icon: string; color: string };
};

type CustomColumnDef<TData> = ColumnDef<TData> &
  CustomColumnProps &
  NColumnDef<TData>;

export const getColumns = (
  _onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): CustomColumnDef<ICOtsRequest>[] => {
  return [
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
        } else if (status === 'CANCELLED') {
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
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'h_created',
      meta: { headerAlign: 'center', type: 'date' },
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: 'h_updated',
      enableGrouping: true,
      meta: { headerAlign: 'center', type: 'date' },
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
  ];
};
