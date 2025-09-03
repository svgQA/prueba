// common-zone.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

const TYPE_LABEL: Record<string, string> = {
  PARKING: 'Parqueadero',
  POOL: 'Piscina',
  GYM: 'Gimnasio',
  OTHER: 'Otro',
};

export const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    header: 'trybook.commonzone.table.name',
    size: 260,
    cell: (info) => {
      const { name } = info.row.original as any;
      return <span>{name ?? '-'}</span>;
    },
  },
  {
    id: 'type',
    header: 'trybook.commonzone.table.type',
    size: 160,
    cell: (info) => {
      const { type } = info.row.original as any; // 'PARKING' | 'POOL' | 'GYM' | 'OTHER'
      return <span>{TYPE_LABEL[type] ?? type ?? '-'}</span>;
    },
  },
  {
    id: 'place',
    header: 'trybook.commonzone.table.place',
    size: 220,
    cell: (info) => {
      const row = info.row.original as any;
      const label = row.place?.name ?? String(row.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'status',
    header: 'h_status',
    size: 120,
    cell: (info) => {
      const { isActive } = info.row.original as any;
      return (
        <span className={isActive ? 'text-green-600' : 'text-gray-400'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'h_action',
    size: 120,
    enableSorting: false,
    enableHiding: false,
    cell: (info) => {
      const { id } = info.row.original as any; // numérico
      return (
        <div className="w-full flex justify-center gap-1">
          <ButtonAction id={String(id)} type="shift" action={ROW_ACTIONS.UPDATE} icon="123" />
          <ButtonAction id={String(id)} type="shift" action={ROW_ACTIONS.DELETE} icon="053" color="!text-red-500" />
        </div>
      );
    },
  },
];
