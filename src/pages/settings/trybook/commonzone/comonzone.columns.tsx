// common-zone.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export type CommonZoneType = 'PARKING' | 'POOL' | 'GYM' | 'OTHER';

export type CommonZoneRow = {
  id: number;
  name?: string | null;
  type: CommonZoneType;
  isActive?: boolean | null;

  placeId?: number | null;
  place?: { id?: number | null; name?: string | null } | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

const TYPE_LABEL: Record<CommonZoneType, string> = {
  PARKING: 'Parqueadero',
  POOL: 'Piscina',
  GYM: 'Gimnasio',
  OTHER: 'Otro',
};

export const columns: ColumnDef<CommonZoneRow>[] = [
  {
    id: 'name',
    header: 'l_name',
    cell: ({ row }) => {
      const { name } = row.original;
      return <span>{name ?? '-'}</span>;
    },
  },
  {
    id: 'type',
    header: 'l_table_type',
    cell: ({ row }) => {
      const k = row.original.type;
      return <span>{TYPE_LABEL[k] ?? k}</span>;
    },
  },
  {
    id: 'place',
    header: 'l_set_place',
    cell: ({ row }) => {
      const r = row.original;
      const label = r.place?.name ?? String(r.placeId ?? '');
      return <span>{label}</span>;
    },
  },
  {
    id: 'status',
    header: 'h_status',
    cell: ({ row }) => {
      const isActive = !!row.original.isActive;
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
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className='w-full flex justify-end gap-1 items-center'>
          <ButtonAction
            id={String(id)}
            type='shift'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <ButtonAction
            id={String(id)}
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
