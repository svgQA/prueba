import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/common/badge/badge';
import { IUserResponse } from '@/types/auth/service';
import { ButtonAction } from '@/components/common/button/column';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import i18next from 'i18next';

// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const userColumns: ColumnDef<IUserResponse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: t('users.columns.name'),
    cell: (info) => {
      const { name, surname } = info.row.original;
      return <div className='flex justify-center'>{`${name} ${surname}`}</div>;
    },
  },
  {
    id: 'cardId',
    accessorKey: 'cardId',
    size: 180,
    header: t('users.columns.id'),
  },
  {
    id: 'email',
    accessorKey: 'email',
    size: 180,
    header: t('users.columns.email'),
  },
  {
    id: 'company',
    accessorKey: 'extraData.company',
    size: 180,
    header: t('users.columns.company'),
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.company || 'N/A';
      return <div className='flex justify-center'>{value}</div>;
    },
  },
  {
    id: 'department',
    accessorKey: 'extraData.area',
    size: 180,
    header: t('users.columns.department'),
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.area || 'N/A';
      return <div className='flex justify-center'>{value}</div>;
    },
  },
  {
    id: 'ciudad',
    accessorKey: 'extraData.city',
    size: 180,
    header: t('users.columns.city'),
    enableGrouping: true,
    cell: (info) => {
      const { extraData } = info.row.original;
      const value = extraData?.city || 'N/A';
      return <div className='flex justify-center'>{value}</div>;
    },
  },
  {
    id: 'connection',
    accessorKey: 'connection',
    size: 100,
    header: t('users.columns.connection'),
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
    header: t('users.columns.taskProgress'),
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
          <div className='flex items-center w-full max-w-[120px]'>
            <div className='relative flex-1 h-2 bg-gray-200 rounded-full mr-2'>
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
  {
    id: 'actions',

    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <ButtonAction
            id={id}
            type='form'
            action={ROW_ACTIONS.PROFILE}
            icon='229'
          />
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.DELETE}
            icon='053'
            color='!text-red-500'
          />
        </div>
      );
    },
  },
];
