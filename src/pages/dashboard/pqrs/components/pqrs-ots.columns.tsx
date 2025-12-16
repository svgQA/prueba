import { ColumnDef } from '@tanstack/react-table';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Badge } from '@/components/common/badge/badge';
// import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { NColumnDef } from '@/components/common/table/type';
import { FormattedDate } from '@/components/compose/forms';
import { ICOtsRequest } from '../utils/interface';
import { Chip } from '@/components/common/chip/chip';

type CustomColumnProps = {
  iconGroup?: string;
  colorIconGroup?: string;
  getIconGroup?: (row: ICOtsRequest) => { icon: string; color: string };
};

type CustomColumnDef<TData> = ColumnDef<TData> &
  CustomColumnProps &
  NColumnDef<TData>;

export const getColumns = (
  _onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): CustomColumnDef<ICOtsRequest>[] => {
  return [
    {
      id: 'title',
      header: 'h_title',
      meta: { headerAlign: 'left' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        return pqrs?.extraData?.title ?? '';
      },
      cell: (info) => {
        const value = info.getValue() as string;
        return value && value.length ? value : '-';
      },
    },
    {
      id: 'clientName',
      header: 'h_client',
      meta: { headerAlign: 'left' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        return pqrs?.clientName ?? '';
      },
      cell: (info) => {
        const value = info.getValue() as string;
        return value && value.length ? value : '-';
      },
    },
    {
      id: 'pqrsType',
      header: 'h_type',
      meta: { headerAlign: 'center' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        return pqrs?.extraData?.pqrsType ?? null;
      },
      cell: (info) => {
        const type = info.getValue() as string | null;
        return type ? (
          <Badge label={type} status={'info'} outline />
        ) : (
          <span>-</span>
        );
      },
    },
    {
      id: 'hasResources',
      header: 'h_resource',
      meta: { headerAlign: 'center' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        const resources = (pqrs?.resources ?? pqrs?.resource ?? []) as any[];
        const rawFiles = (pqrs?.raw?.files ?? []) as any[];
        const count = (Array.isArray(resources) ? resources.length : 0) +
          (Array.isArray(rawFiles) ? rawFiles.length : 0);
        return count > 0;
      },
      cell: (info) => {
        const has = info.getValue() as boolean;
        return (
          <Badge
            label={has ? 'Sí' : 'No'}
            status={has ? 'success' : 'info'}
            outline
          />
        );
      },
    },
    {
      id: 'priority',
      header: 'h_priority',
      meta: { headerAlign: 'center' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        // Prefer explicit priority name if present
        const direct = pqrs?.priority?.name;
        if (direct) return direct;

        // Fallback: try to infer from the latest inference that contains prioridad
        const infs = pqrs?.inferences;
        if (Array.isArray(infs) && infs.length) {
          for (let i = infs.length - 1; i >= 0; i--) {
            const inf = infs[i] as any;
            const prName = inf?.inference?.prioridad?.name ?? inf?.prioridad?.name ?? null;
            if (prName) return prName;
          }
        }
        return null;
      },
      cell: (info) => {
        const value = info.getValue() as string | null;
        if (!value) return '-';
        const normalized = value.toLowerCase();
        const status: 'info' | 'error' | 'warning' | 'success' =
          normalized === 'alta'
            ? 'error'
            : normalized === 'media'
              ? 'warning'
              : normalized === 'baja'
                ? 'success'
                : 'info';
        return <Badge label={value} status={status} outline />;
      },
    },
    {
      id: 'area',
      accessorKey: 'area',
      header: 'h_area',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info: any) => {
        const area = info.getValue() as { id: number; name: string };

        return (
          <Badge
            label={area.name}
            status={'info'}
            full
            outline
          />
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'h_status',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info: any) => {
        const status = info.getValue() as string;
        let statusText = 'info';
        if (status === 'OPENED') {
          statusText = 'success';
        } else if (status === 'IN_PROGRESS') {
          statusText = 'warning';
        } else if (status === 'CLOSED') {
          statusText = 'error';
        } else if (status === 'CANCELLED') {
          statusText = 'warning';
        }

        return (
          <Badge
            label={status}
            status={statusText as 'info' | 'error' | 'warning' | 'success'}
            full
            outline
          />
        );
      },
    },
    {
      id: 'inferencesCount',
      header: 'h_inference',
      meta: { headerAlign: 'end' },
      accessorFn: (row) => {
        const pqrs = Array.isArray(row.pqrs) ? row.pqrs?.[0] : row.pqrs;
        const infs = pqrs?.inferences;
        return Array.isArray(infs) ? infs.length : 0;
      },
      cell: (info) => {
        const count = info.getValue() as number;
        return <Chip
          label={count.toString() ?? ''}
          width='sm'
          icon='320'
        />;
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'h_created',
      meta: { headerAlign: 'end', type: 'date' },
      cell: (info) => {
        return <FormattedDate date={String(info.getValue())} format='date' />;
      },
    },
    // {
    //   id: 'updatedAt',
    //   accessorKey: 'updatedAt',
    //   header: 'h_updated',
    //   enableGrouping: true,
    //   meta: { headerAlign: 'center', type: 'date' },
    //   cell: (info) => {
    //     return <FormattedDate date={String(info.getValue())} format='date' />;
    //   },
    // },
  ];
};
