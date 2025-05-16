import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IServicio } from '../service';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export const columns: ColumnDef<IServicio>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'Nombre',
    cell: (info) => {
      const name = info.getValue() as string;
      return <TextEllipsis text={name} maxWidth='200px' />;
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'Descripción',
    cell: (info) => {
      const description = info.getValue() as string;
      return <TextEllipsis text={description} maxWidth='230px' />;
    },
  },
  {
    id: 'roundId',
    accessorKey: 'round.name',
    size: 60,
    header: 'Ronda',
  },
  {
    id: 'contractId',
    accessorKey: 'contract.name',
    size: 60,
    header: 'Contrato',
  },
  {
    id: 'placeId',
    accessorKey: 'place.name',
    size: 180,
    header: 'Place',
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
