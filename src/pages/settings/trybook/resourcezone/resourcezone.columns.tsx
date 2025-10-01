// resource-zone.columns.ts
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export type ResourceZoneType = 'EQUIPMENT' | 'TOOL' | 'GAME' | 'OTHER';

export type ResourceZoneRow = {
  id: number;
  name: string;
  type: ResourceZoneType;

  zoneId?: number | null;
  zone?: {
    id?: number | null;
    name?: string | null;
    place?: { id?: number | null; name?: string | null } | null;
  } | null;

  quantity?: number | null;
  isBookable?: boolean | null;
  requiresApproval?: boolean | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

const TYPE_LABEL: Record<ResourceZoneType, string> = {
  EQUIPMENT: 'Equipo',
  TOOL: 'Herramienta',
  GAME: 'Recreación',
  OTHER: 'Otro',
};

export const columns: ColumnDef<ResourceZoneRow>[] = [
  {
    id: 'name',
    header: 'l_name',
    size: 280,
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{r.name}</span>
          <span className='text-xs opacity-70'>
            {TYPE_LABEL[r.type] ?? r.type}
          </span>
        </div>
      );
    },
  },
  {
    id: 'zone',
    header: 'h_common_area',
    size: 260,
    cell: ({ row }) => {
      const z = row.original.zone;
      const place = z?.place?.name ? ` · ${z.place?.name}` : '';
      const label = z?.name ?? String(row.original.zoneId ?? '');
      return (
        <span>
          {label}
          {place}
        </span>
      );
    },
  },
  {
    id: 'config',
    header: 'setting',
    size: 220,
    cell: ({ row }) => {
      const { quantity, isBookable, requiresApproval } = row.original;
      return (
        <span className='text-sm'>
          {`Qty: ${quantity ?? 1} · Reservable: ${isBookable ? 'Sí' : 'No'} · Aprobación: ${requiresApproval ? 'Sí' : 'No'}`}
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
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className='w-full flex justify-center gap-1'>
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
