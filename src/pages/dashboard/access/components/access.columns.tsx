// src/pages/dashboard/access/components/access.columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { FormattedDate } from '@/components/compose/forms';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';
import { IAccess } from '@/types/access/accesses';
import i18n from '@/i18n';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IAccess>[] => [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'name',
    accessorKey: 'residentName',
    size: 180,
    header: 'h_resident',
    enableGrouping: true,
    cell: (info) => {
      const { residentSurname } = info.row.original;
      const name = info.getValue() as string;
      return (
        <span
          className='truncate max-w-[160px] block'
          title={`${name} ${residentSurname}`}
        >
          {name} {residentSurname}
        </span>
      );
    },
  },
  {
    id: 'personName',
    accessorKey: 'name', // Cambiado de 'checkIn.personName' a 'name'
    size: 160,
    header: 'h_visit',
    enableGrouping: true,
  },
  {
    id: 'ingreso',
    accessorKey: 'entryType',
    size: 140,
    header: 'h_entry_type',
    cell: (info) => {
      let entryType = info.getValue() as string;
      return entryType === 'VEHICLE' ? i18n.t('vehicule') : i18n.t('peatonal');
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'houseNumber', // Cambiado de 'checkIn.house' a 'houseNumber'
    size: 140,
    header: 'h_house_number',
    enableGrouping: true,
    cell: (info) => {
      const { placeName } = info.row.original;
      const houseNumber = info.getValue() as string;
      let houseInfo = houseNumber + (placeName ? ` - ${placeName}` : '');
      return houseNumber ? (
        <span className='truncate max-w-[120px] block' title={houseInfo}>
          {houseInfo}
        </span>
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'observations',
    accessorKey: 'observations',
    size: 200,
    header: 'h_observation',
    cell: (info) => {
      const observations = info.getValue() as string;
      return observations ? (
        <span className='truncate max-w-[180px] block' title={observations}>
          {observations}
        </span>
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'signature',
    size: 100,
    header: 'h_signature',
    cell: (info) => {
      const { checkIn } = info.row.original;
      let signature = null;

      try {
        const checkInData =
          typeof checkIn === 'string' ? JSON.parse(checkIn) : checkIn;
        signature = checkInData?.signature;
      } catch (error) {
        console.error('Error parsing checkIn:', error);
      }

      return signature ? (
        <div
          className='border rounded bg-white p-2 flex items-center justify-center cursor-pointer hover:bg-gray-50'
          style={{ width: 60, height: 60 }}
        >
          <div
            style={{ width: '100%', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: signature }}
          />
        </div>
      ) : (
        <span className='text-gray-400'>✗ {i18n.t('no')}</span>
      );
    },
  },
  {
    id: 'plate',
    accessorKey: 'plate',
    size: 100,
    header: 'h_plate',
    cell: (info) => {
      const plate = info.getValue() as string;
      return (
        <span
          className={plate ? 'truncate max-w-[180px] block' : 'text-gray-400'}
        >
          {plate ? plate : `✗ ${i18n.t('no')}`}
        </span>
      );
    },
  },
  {
    id: 'checkIn',
    size: 140,
    header: 'h_check_in',
    cell: (info) => {
      const { checkIn } = info.row.original;
      let checkInTime = null;

      try {
        const checkInData =
          typeof checkIn === 'string' ? JSON.parse(checkIn) : checkIn;
        checkInTime = checkInData?.time;
      } catch (error) {
        console.error('Error parsing checkIn:', error);
      }

      return checkInTime ? (
        <FormattedDate date={checkInTime} format='datetime' />
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'checkOut',
    size: 140,
    header: 'h_check_out',
    cell: (info) => {
      const { checkOut } = info.row.original;
      let checkOutTime = null;

      try {
        const checkOutData =
          typeof checkOut === 'string' ? JSON.parse(checkOut) : checkOut;
        checkOutTime = checkOutData?.time;
      } catch (error) {
        console.error('Error parsing checkOut:', error);
      }

      return checkOutTime ? (
        <FormattedDate date={checkOutTime} format='datetime' />
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'action',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { uuid } = info.row.original; // Cambiado de 'id' a 'uuid'
      const actions: IDropdownAction[] = [
        {
          label: 'delete',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: uuid, // Usando uuid en lugar de id
              type: 'form',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-center items-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
