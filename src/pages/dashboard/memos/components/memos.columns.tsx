import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return [
    {
      id: 'name',
      // accessorFn:(row) => `${row?.extraData?.client.name}`,
      header: t('memos.columns.user'),
      accessorKey: 'user.name',
      enableGrouping: true,
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
      accessorKey: 'novelty.name',
      header: t('memos.columns.noveltyType'),
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
      header: t('memos.columns.description'),
      size: 200,
      enableGrouping: true,
      cell: (info) => {
        const description = info.getValue() as string;
        return <TextEllipsis text={description} maxWidth='300px' />;
      },
    },
    {
      id: 'status',
      accessorKey: 'state',
      header: t('memos.columns.status'),
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
      header: t('memos.columns.priority'),
      enableGrouping: true,
      cell: (info: any) => {
        const priority = info.getValue() as string;
        let status = 'info';
        let label = 'Baja';
        if (priority === 'Alta') {
          status = 'error';
          label = 'Alta';
        } else if (priority === 'Media') {
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
      id: 'shift',
      // accessorKey: 'relatedShift.employee.name',
      accessorFn: (row) => `${row?.relatedShift?.employee?.name}`,
      header: t('memos.columns.shifts'),
      cell: (info) => {
        const relatedShift = info.row.original?.relatedShift;
        const status = relatedShift?.status ? `(${relatedShift?.status})` : '';
        const { name, surname } = relatedShift?.employee || {
          name: '',
          surname: '',
        };
        return (
          <div className='flex items-center gap-1 justify-start'>
            {/* <Avatar name={name} size='sm' square /> */}
            {name} {surname} {status}
          </div>
        );
      },
    },
    /*
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
      header: t('memos.columns.history'),
      clickable: true,
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
      header: t('memos.columns.date'),
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: t('memos.columns.updated'),
      enableGrouping: true,
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
  ];
};
