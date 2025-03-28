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
            <Badge label='' icon='190' textColor='text-secondary' size='md' />
          ) : (
            <Badge label='' icon='190' textColor='text-error' size='md' />
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
      // let progressColor = 'bg-error'; // Rojo por defecto para progreso <= 30%

      // if (progress < 30) {
      //   progressColor = 'bg-error';
      // } else if (progress >= 30 && progress < 70) {
      //   progressColor = 'bg-caution';
      // } else if (progress >= 70) {
      //   progressColor = 'bg-primary';
      // }

      // return (
      //   <div className='flex flex-row justify-center'>
      //     {/* Pasar el color dinámico al componente Gauge */}
      //     <Gauge progress={progress} color={progressColor} />
      //   </div>
      // );

      let progressColorClass = 'bg-error'; 
      let textColorClass = 'text-error';

      if (progress >= 30 && progress < 70) {
        progressColorClass = 'bg-caution';
        textColorClass = 'text-caution';
      } else if (progress >= 70) {
        progressColorClass = 'bg-primary';
        textColorClass = 'text-primary';
      }

      return (
        <div className='flex flex-row justify-center'>
          <div className="flex items-center w-full max-w-[120px]">
            <div className="relative flex-1 h-2 bg-gray-200 rounded-full mr-2">
              <div
                className={`absolute top-0 left-0 h-2 rounded-full ${progressColorClass}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${textColorClass}`}>
              {progress}%
            </span>
          </div>
        </div>
      );
    },
  },
];
