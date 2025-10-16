// site.columns.ts (antes residence.columns.ts)
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

// Tipos de Site (ahora incluye OFFICE)
export type SiteType = 'HOUSE' | 'APARTMENT' | 'OFFICE';

// Estructura de cada fila que llega del back
export type SiteRow = {
  uuid: string;

  type: SiteType;
  houseNumber?: string | null;
  block?: string | null;
  floor?: number | null;

  placeId?: number | null;
  place?: {
    id?: number | null;
    name?: string | null;
    type?: 'INDUSTRIAL' | 'RESIDENTIAL' | null; // opcional si lo traes
  } | null;

  // N:M: residents -> [{ user: { id, name, surname } }]
  residents?: Array<{
    user?: { id?: number; name?: string | null; surname?: string | null } | null;
  }> | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

const typeLabel = (t?: SiteType) =>
  t === 'APARTMENT' ? 'Apto' : t === 'OFFICE' ? 'Oficina' : 'Casa';

export const columns: ColumnDef<SiteRow>[] = [
  {
    id: 'site',
    header: 'l_residence', // si tu i18n sigue usando esta key, la dejo igual
    size: 320,
    cell: ({ row }) => {
      const r = row.original;
      const t = typeLabel(r.type);
      const hn = r.houseNumber ?? '';
      const blk = r.block ? ` - ${r.block}` : '';
      const flr =
        r.type === 'APARTMENT' && typeof r.floor === 'number' && r.floor > 0
          ? ` Piso ${r.floor}`
          : '';
      return <span>{`${t} ${hn}${flr}${blk}`}</span>;
    },
  },
  {
    id: 'owners',
    header: 'h_owner',
    size: 260,
    cell: ({ row }) => {
      const res = row.original.residents ?? [];
      const names = res
        .map((ru) => {
          const u = ru?.user;
          const full = `${u?.name ?? ''} ${u?.surname ?? ''}`.trim();
          return full || null;
        })
        .filter(Boolean) as string[];

      return <span>{names.length ? names.join(', ') : '-'}</span>;
    },
  },
  {
    id: 'place',
    header: 'l_set_place',
    size: 240,
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
        <div className="w-full flex justify-center gap-1">
          <ButtonAction
            id={String(uuid)}
            type="shift"             // lo dejo tal cual lo tenías
            action={ROW_ACTIONS.UPDATE}
            icon="123"
          />
          <ButtonAction
            id={String(uuid)}
            type="shift"
            action={ROW_ACTIONS.DELETE}
            icon="053"
            color="!text-red-500"
          />
        </div>
      );
    },
  },
];
