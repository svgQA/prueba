// src/pages/dashboard/correspondence/components/correspondence.columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { ICorrespondence } from '../utils';
import dayjs from 'dayjs';

/**
 * Columnas para la tabla de Correspondencia.
 * Son similares a las de Access, con la posibilidad de grouping
 * y la funcionalidad de filtrado/paginación que provee la tabla principal.
 */
export const correspondenceColumns: ColumnDef<ICorrespondence>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'sender',
    accessorKey: 'sender',
    size: 160,
    header: 'Remitente',
  },
  {
    id: 'owner',
    accessorKey: 'owner',
    size: 180,
    header: 'Propietario',
    enableGrouping: true, // Podemos habilitar grouping por propietario
  },
  {
    id: 'receivedAt',
    accessorKey: 'receivedAt',
    size: 160,
    header: 'Hora Recibido',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'houseNumber',
    size: 140,
    header: 'Casa/Apto',
    enableGrouping: true, // Podemos agrupar por ubicación
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 140,
    header: 'Estado',
    enableGrouping: true,
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Entregado'
              ? 'bg-green-600 text-white'
              : 'bg-orange-400 text-white'
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    id: 'whoPickedUp',
    accessorKey: 'whoPickedUp',
    size: 180,
    header: 'Quién recibe',
  },
];
