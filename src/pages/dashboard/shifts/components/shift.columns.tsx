import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import { Avatar } from '@/components/common/Avatar';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { Badge } from '@/components/common/badge/badge';
import { NColumnDef } from '@/components/common/table/type';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate, DateContrast } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { useTranslation } from 'react-i18next';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): NColumnDef<IShiftResponse>[] => {
  const { t } = useTranslation();

  return [
    {
      id: 'employee',
      clickable: true,
      accessorKey: 'employee.name',
      size: 180,
      header: t('shifts.columns.user'),
      enableGrouping: true,
      cell: (info) => {
        const { employee } = info.row.original;
        return (
          <div className='flex items-center'>
            <Avatar
              name={employee?.name}
              src={employee?.image}
              size='sm'
              square
            />
            <span
              className='p-1 size-sm cursor-pointer text-left'
              onClick={() => info.row.toggleExpanded()}
            >
              {employee?.name} {employee?.surname}
            </span>
          </div>
        );
      },
    },
    {
      id: 'service',
      accessorKey: 'service.name',
      size: 180,
      header: t('shifts.columns.service'),
      clickable: true,
      enableGrouping: true,
      cell: (info) => {
        const service = String(info.getValue());
        return <TextEllipsis text={service} maxWidth='250px' />;
      },
    },
    {
      id: 'contract',
      accessorKey: 'service.contract.name',
      size: 120,
      header: t('shifts.columns.contract'),
      clickable: true,
      cell: (info) => {
        const contract = String(info.getValue());
        return <TextEllipsis text={contract} maxWidth='250px' />;
      },
    },
    {
      id: 'fecha',
      accessorKey: 'start',
      size: 120,
      header: t('shifts.columns.date'),
      enableGrouping: false,
      cell: (info) => (
        <FormattedDate date={info.getValue() as string} format='date' />
      ),
    },
    {
      id: 'time-start',
      accessorKey: 'start',
      size: 150,
      clickable: true,
      header: t('shifts.columns.start'),
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <DateContrast
            scheduledDate={rowData.start}
            actualDate={rowData.checkIn}
            type='start'
            // showLocation
          />
        );
      },
    },
    {
      id: 'time-end',
      accessorKey: 'end',
      size: 150,
      clickable: true,
      header: t('shifts.columns.end'),
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <DateContrast
            scheduledDate={rowData.end}
            actualDate={rowData.checkOut}
            type='end'
            // showLocation
          />
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      size: 120,
      header: t('shifts.columns.status'),
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      size: 120,
      header: t('shifts.columns.duration'),
      clickable: true,
      cell: (info) => {
        const rowData = info.row.original;
        const checkInData = rowData.checkIn;
        const checkOutData = rowData.checkOut;
        let dateDifferent = { hours: 0, minutes: 0 };
        let checkDifferent = { hours: 0, minutes: 0 };

        if (rowData.start && rowData.end) {
          dateDifferent = DateUtils.getTimeDifference(
            rowData.start,
            rowData.end
          );
        }

        if (checkInData?.time && checkOutData?.time) {
          checkDifferent = DateUtils.getTimeDifference(
            checkInData.time,
            checkOutData.time
          );
        }

        return (
          <div className='inline-flex items-center px-2 py-0.5 text-sm'>
            <span>
              {dateDifferent.hours}h {dateDifferent.minutes}m
            </span>
            <span className='mx-1'>→</span>
            <span>
              {checkDifferent.hours}h {checkDifferent.minutes}m
            </span>
          </div>
        );
      },
    },
    {
      id: 'report',
      accessorKey: 'report',
      size: 50,
      header: t('shifts.columns.report'),
      cell: (_: any) => <Badge label={`2 → 12h`} outline full size='xs' />,
    },
    {
      id: 'shift',
      accessorKey: 'activitiesProgress',
      clickable: true,
      size: 50,
      header: t('shifts.columns.shift'),
      cell: (info: any) => {
        const { activityPct } = info.row.original;
        const progress = activityPct;

        let progressColor = '#E05858';

        if (progress >= 30 && progress < 70) {
          progressColor = '#FFC772';
        } else if (progress >= 70) {
          progressColor = '#00BDD6';
        }

        return <Gauge progress={progress} color={progressColor} />;
      },
    },
    {
      id: 'round',
      accessorKey: 'activitiesProgress',
      size: 100,
      clickable: true,
      header: t('shifts.columns.round'),
      cell: (info: any) => {
        const { roundPct } = info.row.original;
        const progress = roundPct;

        let progressColor = '#E05858';

        if (progress >= 30 && progress < 70) {
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
      id: 'client',
      accessorKey: 'service.contract.client.name',
      size: 120,
      clickable: true,
      header: t('shifts.columns.client'),
      enableGrouping: true,
      cell: (info) => {
        const client = String(info.getValue());
        return <TextEllipsis text={client} maxWidth='250px' />;
      },
    },
    {
      id: 'actions',
      size: 10,
      cell: (info) => {
        const { id, checkIn, checkOut } = info.row.original;
        const s_id = String(id);
        const model = checkOut
          ? []
          : [
              {
                label: !checkIn ? 'Marcar check-in' : 'Marcar check-out',
                icon: 'vox-icon vx-icon-312 text-primary',
                onClick: () => {
                  onClickAction({
                    id: s_id,
                    type: 'shift',
                    action: !checkIn
                      ? ROW_ACTIONS.CHECK_IN
                      : ROW_ACTIONS.CHECK_OUT,
                  });
                },
              },
            ];

        const uModel =
          checkIn || checkOut
            ? []
            : [
                {
                  label: 'Editar turno',
                  icon: 'vox-icon vx-icon-123 text-primary',
                  onClick: () => {
                    onClickAction({
                      id: s_id,
                      type: 'shift',
                      action: ROW_ACTIONS.UPDATE,
                    });
                  },
                },
              ];

        const actions: IDropdownAction[] = [
          ...uModel,
          ...model,
          {
            label: 'Eliminar turno',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () => {
              onClickAction({
                id: s_id,
                type: 'shift',
                action: ROW_ACTIONS.DELETE,
              });
            },
          },
        ];

        return <DropdownActionsMenu actions={actions} />;
      },
    },
  ];
};
