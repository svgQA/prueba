// residence.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export type ResidenceType = 'HOUSE' | 'APARTMENT';

export type ResidenceRow = {
  uuid: string;

  type: ResidenceType;
  houseNumber?: string | null;
  block?: string | null;
  floor?: number | null;

  placeId?: number | null;
  place?: { id?: number | null; name?: string | null } | null;

  user?: { id?: number; name?: string | null; surname?: string | null } | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export const columns: ColumnDef<ResidenceRow>[] = [
  {
    id: 'residence',
    header: 'trybook.residence.table.residence',
    size: 320,
    cell: ({ row }) => {
      const r = row.original;
      const type = r.type === 'APARTMENT' ? 'Apto' : 'Casa';
      const hn = r.houseNumber ?? '';
      const blk = r.block ? ` - ${r.block}` : '';
      const flr =
        r.type === 'APARTMENT' && r.floor && r.floor > 0
          ? ` Piso ${r.floor}`
          : '';
      return <span>{`${type} ${hn}${flr}${blk}`}</span>;
    },
  },
  {
    id: 'owner',
    header: 'trybook.residence.table.owner',
    size: 240,
    cell: ({ row }) => {
      const u = row.original.user;
      const full = `${u?.name ?? ''} ${u?.surname ?? ''}`.trim();
      return <span>{full || '-'}</span>;
    },
  },
  {
    id: 'place',
    header: 'trybook.residence.table.place',
    size: 220,
    cell: ({ row }) => {
      const r = row.original;
      const label = r.place?.name ?? String(r.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'actions',
    header: 'h_action',
    size: 120,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const { uuid } = row.original;
      return (
        <div className='w-full flex justify-center gap-1'>
          <ButtonAction
            id={String(uuid)}
            type='shift'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <ButtonAction
            id={String(uuid)}
            type='shift'
            action={ROW_ACTIONS.DELETE}
            icon='053'
            color='!text-red-500'
          />
        </div>
      );
    },
  },
];
