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
    header: 'l_code',
    cell: ({ row }) => {
      const { code } = row.original;
      return <span>{code ?? '-'}</span>;
    },
  },
  {
    id: 'zone',
    header: 'l_zone',
    cell: ({ row }) => {
      const r = row.original;
      const label = r.zone?.name ?? String(r.zoneId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'place',
    header: 'l_set_place',
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
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const { uuid } = row.original;
      return (
        <div className='w-full flex justify-end gap-1 items-center'>
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
