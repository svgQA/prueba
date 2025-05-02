import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/common/badge/badge';
import { IUserResponse } from '@/types/auth/service';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import i18next from 'i18next';
import { IDropdownAction, DropdownActionsMenu } from '@/components/common/table/components/dropdown.actions.menu';
import { Avatar } from '@/components/common/Avatar';
// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const getColumns = (
  onClickAction: (params: { id: string; type: string; action: ROW_ACTIONS }) => void
): ColumnDef<IUserResponse>[] => [
    {
      id: 'name',
      accessorKey: 'name',
      size: 180,
      header: t('users.columns.name'),
      cell: (info) => {
        const { name, surname, image } = info.row.original;
        return (
          <div className='flex items-center'>
            <Avatar name={name} src={image} size='sm' square />
            <span
              className='p-1 size-sm cursor-pointer text-left'
              onClick={() => info.row.toggleExpanded()}
            >
              {`${name} ${surname}`}
            </span>
          </div>
        );
      }
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
      id: 'conections',
      accessorKey: 'conections',
      header: 'Conexión',
      size: 100,
      cell: (info) => {
        const value = info.getValue() as number;

        let iconColor = '#1DD75B'; // secondary por defecto

        if (value >= 1 && value < 3) {
          iconColor = '#EF4444'; // error
        } else if (value >= 3) {
          iconColor = '#6B7280'; // gray-text-light
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-full p-1 bg-b-light">
              <span
                className="vox-icon vx-icon-user-status text-sm"
                style={{ color: iconColor }}
              />
            </div>
            <span className="text-sm text-gray-700">{value}</span>
          </div>
        );
      },
    },
    {
      id: 'openRate',
      header: 'Tasa de apertura',
      size: 150,
      cell: (info) => {
        const { tasks } = info.row.original as { tasks?: { assigned: number; resolved: number } };
        const assignedTasks = tasks?.assigned ?? 0;
        const resolvedTasks = tasks?.resolved ?? 0;

        const hasTasks = assignedTasks > 0;
        const openRate = hasTasks
          ? Math.round((resolvedTasks / assignedTasks) * 100)
          : 0;

        let barColor = 'bg-caution';
        if (openRate >= 70) barColor = 'bg-m6';
        else if (openRate <= 30) barColor = 'bg-error';

        return (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              {hasTasks && (
                <div
                  className={`h-full ${barColor}`}
                  style={{ width: `${openRate}%` }}
                />
              )}
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {hasTasks ? `${openRate}%` : '%'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      size: 20,
      cell: (info) => {
        const { id } = info.row.original;

        const actions: IDropdownAction[] = [
          {
            label: 'Perfil del usuario',
            icon: 'vox-icon vx-icon-229 text-primary',
            onClick: () => {
              onClickAction({ id: String(id), type: 'form', action: ROW_ACTIONS.PROFILE });
            },
          },
          {
            label: 'Editar usuario',
            icon: 'vox-icon vx-icon-123 text-primary',
            onClick: () => {
              onClickAction({ id: String(id), type: 'shift', action: ROW_ACTIONS.UPDATE });
            },
          },
          {
            label: 'Eliminar usuario',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () => {
              onClickAction({ id: String(id), type: 'shift', action: ROW_ACTIONS.DELETE });
            },
          },
        ];

        return (
          <div className="w-full flex justify-center">
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    }

  ];
