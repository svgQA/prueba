import { ColumnDef } from '@tanstack/react-table';
import { User } from '../utils';
import { Gauge } from '@/components/common/gauge/gauge';

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
      const value = info.getValue() as string; // 'Activo' | 'Inactivo' | 'Sin conexión'

      let iconClass = 'vox-icon p-1 size-sm cursor-pointer';
      let containerClass = 'flex justify-center items-center border-2';
      let icon;

      if (value === 'Activo') {
        containerClass += ' border-green-500  bg-green-500';
        icon = 'vx-icon-189 rounded-full size-lg';
      } else if (value === 'Inactivo') {
        containerClass += ' border-red-500 bg-red-500';
        icon = 'vx-icon-190 rounded-full size-lg';
      } else {
        containerClass += ' border-gray-500 bg-gray-500';
        icon = 'vx-icon-186 rounded-full size-lg';
      }

      return (
        <div className='flex justify-center'>
          {/* Contenedor con borde y fondo dinámico */}
          <span className={`${iconClass} ${icon} ${containerClass}`} />
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

      if (progress > 30 && progress <= 60) {
        progressColor = '#FFC772'; // Amarillo para progreso entre 30% y 60%
      } else if (progress > 60 && progress <= 90) {
        progressColor = '#00BDD6'; // Azul para progreso entre 60% y 90%
      } else if (progress > 90) {
        progressColor = '#1DD75B'; // Verde para progreso > 90%
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
