// src/pages/dashboard/access/components/access.columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { IAccess } from '../utils';
import dayjs from 'dayjs';

export const accessColumns: ColumnDef<IAccess>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'Nombre',
    // enableGrouping: true, // Agrupación si lo deseas
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    size: 140,
    header: 'Teléfono',
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    size: 140,
    header: 'Hora Ingreso',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
    },
  },
  {
    id: 'checkOut',
    accessorKey: 'checkOut',
    size: 140,
    header: 'Hora Salida',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'houseNumber',
    size: 140,
    header: 'Casa/Apto',
    enableGrouping: true,
  },
  // Lo demás se visualiza en el expansible
];
