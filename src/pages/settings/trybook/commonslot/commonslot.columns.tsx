// common-slot.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

/** Tipo mínimo que usa la tabla (exportado para reusar en la página) */
export type CommonSlotRow = {
  uuid: string;
  code?: string | null;
  zoneId?: number | null;
  isOccupied?: boolean | null;

  zone?: {
    id?: number | null;
    name?: string | null;
    placeId?: number | null;
    place?: { id?: number | null; name?: string | null } | null;
  } | null;

  placeId?: number | null;
  place?: { id?: number | null; name?: string | null } | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export const columns: ColumnDef<CommonSlotRow>[] = [
  {
    id: 'code',
    header: 'trybook.commonslot.table.code',
    size: 160,
    cell: ({ row }) => {
      const { code } = row.original;
      return <span>{code ?? '-'}</span>;
    },
  },
  {
    id: 'zone',
    header: 'trybook.commonslot.table.zone',
    size: 220,
    cell: ({ row }) => {
      const r = row.original;
      const label = r.zone?.name ?? String(r.zoneId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'place',
    header: 'trybook.commonslot.table.place',
    size: 220,
    cell: ({ row }) => {
      const r = row.original;
      const label =
        r.zone?.place?.name ??
        r.place?.name ??
        String(r.placeId ?? r.zone?.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'status',
    header: 'h_status',
    size: 120,
    cell: ({ row }) => {
      const isOccupied = !!row.original.isOccupied;
      const text = isOccupied ? 'Ocupado' : 'Libre';
      const cls = isOccupied ? 'text-red-500' : 'text-green-600';
      return <span className={cls}>{text}</span>;
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
