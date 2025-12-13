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
import { useTranslation } from 'react-i18next';

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
        const name = `${employee?.name} ${employee?.surname}`;
        return (
          <div className='flex items-center gap-2'>
            <Avatar
              name={employee?.name}
              // src={employee?.image}
              size='sm'
              square
            />
            <span
              className='p-1 size-sm cursor-pointer text-left'
              onClick={() => info.row.toggleExpanded()}
            >
              <TextEllipsis text={name} maxWidth='300px' />
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
      enableGrouping: true,
      meta: { headerAlign: 'center' },
      cell: (info) => {
        const contract = String(info.getValue());
        return <TextEllipsis text={contract} maxWidth='250px' />;
      },
    },
    {
      id: 'date',
      accessorKey: 'start',
      size: 120,
      header: 'h_date',
      enableGrouping: false,
      meta: { headerAlign: 'center', type: 'date' },
      cell: (info) => (
        <FormattedDate date={info.getValue() as string} format='date' />
      ),
    },
    {
      // id: 'time-start',
      id: 'start',
      accessorKey: 'start',
      size: 150,
      clickable: true,
      header: 'h_start',
      meta: { headerAlign: 'center', type: 'date' },
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
      // id: 'time-end',
      id: 'end',
      accessorKey: 'end',
      size: 150,
      clickable: true,
      header: 'h_end',
      meta: { headerAlign: 'center', type: 'date' },
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
            <Badge label={String(rowData.status)} width='w-24' />
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
        const report = String(info.row?.original?.report?.length || 0);
        const promedio = Number(info.row?.original?.promedio || 0);
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
      id: 'task',
      accessorKey: 'activitiesProgress',
      size: 50,
      clickable: true,
      header: 'h_task',
      meta: { headerAlign: 'center' },
      cell: (info: any) => {
        const taskData = info.row.original.task;

        const tasks = Array.isArray(taskData) ? taskData : [];

        const total = tasks.length;
        const completed = tasks.filter((t) => t.check === true).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        let progressColor = '#E05858'; // rojo

        if (progress >= 30 && progress < 70) {
          progressColor = '#FFC772'; // amarillo
        } else if (progress >= 70) {
          progressColor = '#00BDD6'; // verde
        }

        return (
          <div className='flex flex-col justify-center items-center'>
            <Gauge
              size={10}
              gauges={[
                { progress: progress, color: progressColor },
                { progress: 45, color: 'green' },
              ]}
            />
            {/*
            <Gauge progress={progress} color={progressColor} />
          */}
          </div>
        );
      },
    },
    {
      id: 'round',
      accessorKey: 'activitiesProgress',
      size: 50,
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
            <Gauge
              size={10}
              gauges={[
                { progress: roundPct, color: progressColor },
                { progress: 45, color: 'green' },
              ]}
            />
            {/*
            <Gauge progress={roundPct} color={progressColor} />
            */}
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
        const { t } = useTranslation();
        const model = checkOut
          ? []
          : [
              {
                label: !checkIn ? 'Check In' : 'Check Out', // t('h_check_in') : t('h_check_out'),
                icon: 'vox-icon vx-icon-048 text-primary',
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
                  label: t('actions.edit'),
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
            label: t('actions.delete'),
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
          {
            label: t('actions.download'),
            keyName: 'download',
            icon: 'vox-icon vx-icon-057 text-primary',
            onClick: () => {
              onClickAction({
                id: s_id,
                type: 'shift',
                action: ROW_ACTIONS.DOWNLOAD,
              });
            },
          },
        ];

        return <DropdownActionsMenu actions={actions} />;
      },
    },
  ];
};
