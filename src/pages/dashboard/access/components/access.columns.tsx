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
      accessorKey: 'name',
      size: 180,
      header: 'h_name',
      enableGrouping: true,
    },
    {
      id: 'ingreso',
      accessorKey: 'entryType',
      size: 140,
      header: 'h_entry_type',
      cell: (info) => {
        let entryType = info.getValue() as string;
        const { plate } = info.row.original;
        return entryType === "VEHICLE" ? i18n.t("vehicule") + ' ' + plate : i18n.t("peatonal");
      }
    },
    {
      id: 'houseNumber',
      accessorKey: 'checkIn.house',
      size: 140,
      header: 'h_house_number',
      enableGrouping: true,
    },
    {
      id: 'personName',
      accessorKey: 'checkIn.personName',
      size: 160,
      header: 'h_person_entry',
      enableGrouping: true,
    },
    {
      id: 'observations',
      accessorKey: 'observations',
      size: 200,
      header: 'h_observation',
      cell: (info) => {
        const observations = info.getValue() as string;
        return observations ? (
          <span className="truncate max-w-[180px] block" title={observations}>
            {observations}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      id: 'signature',
      accessorKey: 'checkIn.signature',
      size: 100,
      header: 'h_signature',
      cell: (info) => {
        const signature = info.getValue() as string;
        return signature ? (
          <span className="text-green-600">✓ {i18n.t('yes')}</span>
        ) : (
          <span className="text-gray-400">✗ {i18n.t('no')}</span>
        );
      },
    },
    {
      id: 'checkIn',
      accessorKey: 'checkIn.time',
      size: 140,
      header: 'h_check_in',
      cell: (info) => {
        return <FormattedDate date={info.getValue() as string} format='datetime' />;
      },
    },
    {
      id: 'checkOut',
      accessorKey: 'checkOut.time',
      size: 140,
      header: 'h_check_out',
      cell: (info) => {
        return <FormattedDate date={info.getValue() as string} format='datetime' />;
      },
    },
    {
      id: 'action',
      size: 20,
      header: 'h_action',
      cell: (info) => {
        const { id } = info.row.original;
        const actions: IDropdownAction[] = [
          // {
          //   label: 'update',
          //   icon: 'vox-icon vx-icon-123 text-primary',
          //   onClick: () => {
          //     onClickAction({
          //       id: String(id),
          //       type: 'form',
          //       action: ROW_ACTIONS.UPDATE,
          //     });
          //   },
          // },
          {
            label: 'delete',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () => {
              onClickAction({
                id: String(id),
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
