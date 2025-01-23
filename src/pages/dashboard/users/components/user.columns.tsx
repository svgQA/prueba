import { ColumnDef } from '@tanstack/react-table';
import { User } from '../utils';
import { Gauge } from '@/components/common/gauge/gauge';
//import { ROW_ACTIONS } from '@/components/common/table/enum'; // Ajusta según tu ruta
import { Badge } from '@/components/common/badge/badge';

export const userColumns: ColumnDef<User>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 50,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'Nombre',
    enableGrouping: true, // habilitar agrupación si deseas
  },
  {
    id: 'identification',
    accessorKey: 'identification',
    size: 180,
    header: 'Identificación',
    enableGrouping: true,
  },
  {
    id: 'email',
    accessorKey: 'email',
    size: 180,
    header: 'E-mail',
  },
  {
    id: 'company',
    accessorKey: 'company',
    size: 180,
    header: 'Compañía',
    enableGrouping: true,
  },
  {
    id: 'department',
    accessorKey: 'department',
    size: 180,
    header: 'Departamento',
    enableGrouping: true,
  },
  {
    id: 'connection',
    accessorKey: 'connection',
    size: 100,
    header: 'Conexión',
    cell: (info) => {
      const value = info.getValue() as string; // 'Activo' | 'Inactivo'
      // Podrías usar un badge distinto para "Activo" (verde) / "Inactivo" (rojo)
      return (
        <div className='flex justify-center'>
          {value === 'Activo' ? (
            <Badge label='' icon='190' /*color='bg-green-500'*/ />
          ) : (
            <Badge label='' icon='190' /*color='bg-red-500'*/ />
          )}
        </div>
      );
    },
  },
  {
    id: 'taskProgress',
    accessorKey: 'taskProgress',
    size: 180,
    header: 'Progreso',
    cell: (info) => (
      <div className='flex flex-row justify-center'>
        <Gauge progress={info.getValue() as number} />
      </div>
    ),
  },
];
