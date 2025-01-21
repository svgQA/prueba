import { ButtonAction } from '@/components/common/button/column';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IFormat, IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IResponseResponse>[] = [
  {
    accessorKey: 'structure',
    id: 'title',
    header: 'Título',
    cell: (info) => {
      const value = info.getValue() as IFormat;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-sm' />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>{value.label}</div>
            <div className='text-sm text-gray-500'>{value.description}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Última actualización',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    id: 'action',
    size: 30,
    cell: (info) => {
      const { id, status } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          {status === RESPONSE_STATUS.OPENED ? (
            <ButtonAction
              id={id}
              type='response'
              action={ROW_ACTIONS.RESPONSE}
              label='Continue'
            />
          ) : (
            <ButtonAction id={id} type='response' action={ROW_ACTIONS.REPORT} />
          )}
          <ButtonAction
            id={id}
            type='response'
            icon='053'
            action={ROW_ACTIONS.DELETE}
          />
        </div>
      );
    },
  },
];
