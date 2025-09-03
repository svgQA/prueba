// common-slot.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<any>[] = [
  {
    id: 'code',
    header: 'trybook.commonslot.table.code',
    size: 160,
    cell: (info) => {
      const { code } = info.row.original as any;
      return <span>{code ?? '-'}</span>;
    },
  },
  {
    id: 'zone',
    header: 'trybook.commonslot.table.zone',
    size: 220,
    cell: (info) => {
      const row = info.row.original as any;
      // Prefer the populated relation, fallback to raw id
      const label = row.zone?.name ?? String(row.zoneId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'place',
    header: 'trybook.commonslot.table.place',
    size: 220,
    cell: (info) => {
      const row = info.row.original as any;
      // Try zone.place.name, or direct place relation, then ids as last resort
      const label =
        row.zone?.place?.name ??
        row.place?.name ??
        String(row.placeId ?? row.zone?.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'status',
    header: 'h_status',
    size: 120,
    cell: (info) => {
      const { isOccupied } = info.row.original as any;
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
    cell: (info) => {
      const { uuid } = info.row.original as any; // slots usan UUID
      return (
        <div className="w-full flex justify-center gap-1">
          <ButtonAction id={String(uuid)} type="shift" action={ROW_ACTIONS.UPDATE} icon="123" />
          <ButtonAction id={String(uuid)} type="shift" action={ROW_ACTIONS.DELETE} icon="053" color="!text-red-500" />
        </div>
      );
    },
  },
];
