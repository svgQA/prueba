// residence.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<any>[] = [
  {
    id: 'residence',
    header: 'trybook.residence.table.residence',
    size: 320,
    cell: (info) => {
      const r = info.row.original as any;
      const type = r.type === 'APARTMENT' ? 'Apto' : 'Casa';
      const hn = r.houseNumber ?? '';
      const blk = r.block ? ` - ${r.block}` : '';
      const flr = r.type === 'APARTMENT' && r.floor && r.floor > 0 ? ` Piso ${r.floor}` : '';
      return <span>{`${type} ${hn}${flr}${blk}`}</span>;
    },
  },
  {
    id: 'owner',
    header: 'trybook.residence.table.owner',
    size: 240,
    cell: (info) => {
      const u = (info.row.original as any).user;
      const full = u ? `${u.name ?? ''} ${u.surname ?? ''}`.trim() : '';
      return <span>{full || '-'}</span>;
    },
  },
  {
    id: 'place',
    header: 'trybook.residence.table.place',
    size: 220,
    cell: (info) => {
      const row = info.row.original as any;
      const label = row.place?.name ?? String(row.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'actions',
    header: 'h_action',
    size: 120,
    enableSorting: false,
    enableHiding: false,
    cell: (info) => {
      const { uuid } = info.row.original as any;
      return (
        <div className="w-full flex justify-center gap-1">
          <ButtonAction id={uuid} type="shift" action={ROW_ACTIONS.UPDATE} icon="123" />
          <ButtonAction id={uuid} type="shift" action={ROW_ACTIONS.DELETE} icon="053" color="!text-red-500" />
        </div>
      );
    },
  },
];
