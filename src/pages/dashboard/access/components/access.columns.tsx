// src/pages/dashboard/access/components/access.columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { IAccess } from '../utils';
import { FormattedDate } from '@/components/compose/forms';

export const accessColumns: ColumnDef<IAccess>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'h_name',
    // enableGrouping: true, // Agrupación si lo deseas
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    size: 140,
    header: 'h_phone',
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    size: 140,
    header: 'h_check_in',
    cell: (info) => {
      return <FormattedDate date={info.getValue() as string} format='time' />;
    },
  },
  {
    id: 'checkOut',
    accessorKey: 'checkOut',
    size: 140,
    header: 'h_check_out',
    cell: (info) => {
      return <FormattedDate date={info.getValue() as string} format='time' />;
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'houseNumber',
    size: 140,
    header: 'h_house_number',
    enableGrouping: true,
  },
  // Lo demás se visualiza en el expansible
];
