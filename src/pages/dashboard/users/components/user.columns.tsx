import { ColumnDef } from '@tanstack/react-table';
import { User } from '../utils';
import { Gauge } from '@/components/common/gauge/gauge';
//import { Badge } from '@aws-amplify/ui-react';
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
            <Badge label='' icon='190' textColor='text-secondary' />
          ) : (
            <Badge label='' icon='190' textColor='text-error' />
          )}
        </div>
      );
    },
  },
  {
    id: 'taskProgress',
    accessorKey: 'taskProgress',
    size: 180,
    header: 'Progreso de tareas',
    cell: (info) => {
      const progress = info.getValue() as number;

      // Definir el color dinámico basado en el progreso
      let progressColor = '#E05858'; // Rojo por defecto para progreso <= 30%

      if (progress < 30) {
        progressColor = '#E05858';
      } else if (progress >= 30 && progress < 70) {
        progressColor = '#FFC772';
      } else if (progress >= 70) {
        progressColor = '#00BDD6';
      }

      return (
        <div className='flex flex-row justify-center'>
          {/* Pasar el color dinámico al componente Gauge */}
          <Gauge progress={progress} color={progressColor} />
        </div>
      );
    },
  },
];
