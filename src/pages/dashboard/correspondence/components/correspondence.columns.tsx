// src/pages/dashboard/correspondence/components/correspondence.columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { ICorrespondence } from '../utils';
import { FormattedDate } from '@/components/compose/forms';

/**
 * Columnas para la tabla de Correspondencia.
 * Son similares a las de Access, con la posibilidad de grouping
 * y la funcionalidad de filtrado/paginación que provee la tabla principal.
 */
export const correspondenceColumns: ColumnDef<ICorrespondence>[] = [
  {
    id: 'sender',
    accessorKey: 'sender',
    size: 160,
    header: 'Remitente',
  },
  {
    id: 'notificar',
    //accessorKey: 'notificar',
    header: 'Notificar',
    size: 100,
    cell: (info) => {
      return (
        <span
          className='vox-icon vx-icon-155 p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        />
      );
    },
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
      return (
        <FormattedDate date={info.getValue() as string} format='datetime' />
      );
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
              ? 'bg-secondary text-white'
              : 'bg-error text-white'
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
    header: 'Entregado a...',
  },
];
