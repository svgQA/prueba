import { ColumnDef } from '@tanstack/react-table';
import { Memo } from '../utils/memos';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Badge } from '@/components/common/badge/badge';
import { Avatar } from '@/components/common/Avatar';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { NColumnDef } from '@/components/common/table/type';
import { FloatBadge } from '@/components/common/badge/float';
import { FormattedDate } from '@/components/compose/forms';

// Define our custom properties
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
): CustomColumnDef<Memo>[] => [
  {
    id: 'name',
    // accessorFn:(row) => `${row?.extraData?.client.name}`,
    header: 'Usuario',
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
      return <TextEllipsis text={description} maxWidth='300px' />;
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
    header: 'Turno',
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
    header: 'Actualizado Por',
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
    header: 'Historial',
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
    header: 'Fecha',
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='date' />;
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Actualizado',
    enableGrouping: true,
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='date' />;
    },
  },
  // {
  //   id: 'actions',
  //   size: 20,
  //   cell: (info) => {
  //     const { id } = info.row.original;
  //     const actions: IDropdownAction[] = [
  //       {
  //         label: 'Editar memo',
  //         icon: 'vox-icon vx-icon-123 text-primary',
  //         onClick: () => {
  //           onClickAction({
  //             id: String(id),
  //             type: 'memo',
  //             action: ROW_ACTIONS.UPDATE,
  //           });
  //         },
  //       },
  //       {
  //         label: 'Eliminar memo',
  //         icon: 'vox-icon vx-icon-053 text-red-500',
  //         color: 'text-red-600',
  //         onClick: () => {
  //           onClickAction({
  //             id: String(id),
  //             type: 'memo',
  //             action: ROW_ACTIONS.DELETE,
  //           });
  //         },
  //       },
  //     ];

  //     return <DropdownActionsMenu actions={actions} />;
  //   },
  // },
];
