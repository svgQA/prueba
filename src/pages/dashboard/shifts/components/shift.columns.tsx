import { Gauge } from '@/components/common/gauge/gauge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IShiftResponse } from '@/types/shift/activity';
import { Avatar } from '@/components/common/Avatar';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { NColumnDef } from '@/components/common/table/type';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate, DateContrast } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { Badge } from '@/components/common/badge/badge';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): NColumnDef<IShiftResponse>[] => {
  return [
    {
      id: 'employee',
      clickable: true,
      accessorKey: 'employee.name',
      size: 180,
      header: 'h_user',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
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
      header: 'h_service',
      clickable: true,
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const service = String(info.getValue());
        return <TextEllipsis text={service} maxWidth='250px' />;
      },
    },
    {
      id: 'contract',
      accessorKey: 'service.contract.name',
      size: 120,
      header: 'h_contract',
      clickable: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const contract = String(info.getValue());
        return <TextEllipsis text={contract} maxWidth='250px' />;
      },
    },
    {
      id: 'fecha',
      accessorKey: 'start',
      size: 120,
      header: 'h_date',
      enableGrouping: false,
      meta: { headerAlign: 'center' },
      cell: (info) => (
        <FormattedDate date={info.getValue() as string} format='date' />
      ),
    },
    {
      id: 'time-start',
      accessorKey: 'start',
      size: 150,
      clickable: true,
      header: 'h_start',
      meta: { headerAlign: 'center' },
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
      header: 'h_end',
      meta: { headerAlign: 'center' },
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
      header: 'h_status',
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <div className='w-full justify-center flex items-center'>
            <Badge label={rowData.status} width='w-24' />
          </div>
        );
      },
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      size: 120,
      header: 'h_duration',
      clickable: true,
      meta: { headerAlign: 'center' },
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
      header: 'h_report',
      clickable: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const report = info.row.original.report.length.toString();
        const promedio = info.row.original.promedio;
        // 1) Con Math.round
        const promedioUnDecimal = Math.round(promedio * 10) / 10;
        return (
          <div className='flex w-full justify-center'>
            <div className='inline-flex items-center space-x-2 px-4 py-1 text-sm border border-gray-300 rounded-lg whitespace-nowrap'>
              <span>{report} R</span>
              <span>→</span>
              <span>{promedioUnDecimal} min</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'shift',
      accessorKey: 'activitiesProgress',
      clickable: true,
      size: 50,
      header: 'h_shift',
      meta: { headerAlign: 'center' },
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
      header: 'h_round',
      meta: { headerAlign: 'center' },
      cell: (info: any) => {
        const { roundPct } = info.row.original;
        let progressColor = '#E05858';

        if (roundPct >= 30 && roundPct < 70) {
          progressColor = '#FFC772';
        } else if (roundPct >= 70) {
          progressColor = '#00BDD6';
        }

        return (
          <div className='flex flex-row justify-center'>
            <Gauge progress={roundPct} color={progressColor} />
          </div>
        );
      },
    },
    {
      id: 'client',
      accessorKey: 'service.contract.client.name',
      size: 120,
      clickable: true,
      header: 'h_client',
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const client = String(info.getValue());
        return <TextEllipsis text={client} maxWidth='250px' />;
      },
    },
    {
      id: 'actions',
      size: 10,
      meta: { headerAlign: 'center' },
      header: 'h_action',
      cell: (info) => {
        const { id, checkIn, checkOut } = info.row.original;
        const s_id = String(id);
        const model = checkOut
          ? []
          : [
              {
                label: !checkIn ? 'check_in' : 'check_out',
                icon: 'vox-icon vx-icon-312 text-primary',
                keyName: 'check',
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
                  label: 'edit',
                  keyName: 'upsert',
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
            label: 'delete',
            keyName: 'delete',
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
