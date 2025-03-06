import { Badge } from '@/components/common/badge/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse, IUser } from '@/types/shift/activity';
import dayjs from 'dayjs';

export const columns: ColumnDef<IShiftResponse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'userName',
    accessorKey: 'user',
    size: 180,
    header: 'Usuario',
    enableGrouping: true,
    cell: (info) => {
      const user = info.getValue() as IUser;
      return `${user.name} ${user.surname}`;
    },
  },
  {
    id: 'userEmail',
    accessorKey: 'user.email',
    size: 180,
    header: 'Email',
  },
  {
    id: 'userPhone',
    accessorKey: 'user.phone',
    size: 120,
    header: 'Teléfono',
  },
  {
    id: 'serviceRound',
    accessorKey: 'service.round.name',
    size: 150,
    header: 'Ronda',
    enableGrouping: true,
  },
  {
    id: 'servicePlaceName',
    accessorKey: 'service.place.name',
    size: 180,
    header: 'Lugar',
    enableGrouping: true,
  },
  {
    id: 'servicePlaceAddress',
    accessorKey: 'service.place.address',
    size: 200,
    header: 'Dirección',
  },
  {
    id: 'contractName',
    accessorKey: 'service.contract.name',
    size: 180,
    header: 'Contrato',
    enableGrouping: true,
  },
  {
    id: 'start',
    accessorKey: 'start',
    size: 140,
    header: 'Inicio',
    cell: (info) => dayjs(info.getValue() as string).format('DD/MM/YYYY HH:mm'),
  },
  {
    id: 'end',
    accessorKey: 'end',
    size: 140,
    header: 'Fin',
    cell: (info) => dayjs(info.getValue() as string).format('DD/MM/YYYY HH:mm'),
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'Estado',
    cell: (info) => (
      <div className='flex flex-row justify-center'>
        <Badge label={String(info.getValue())} icon='123' color='bg-primary' />
      </div>
    ),
  },
  {
    id: 'activitiesProgress',
    accessorKey: 'activitiesProgress',
    size: 50,
    header: 'Progreso',
    cell: (info: any) => {
      const progress = info.getValue() as number;

      let progressColor = '#E05858';

      if (progress < 30) {
        progressColor = '#E05858';
      } else if (progress >= 30 && progress < 70) {
        progressColor = '#FFC772';
      } else if (progress >= 70) {
        progressColor = '#00BDD6';
      }

      return (
        <div className='flex flex-row justify-center'>
          <Gauge progress={progress} color={progressColor} />
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
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='shift'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='shift'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
