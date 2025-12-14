/* Incluye loader (overlay) mientras carga el shift para evitar UI incompleta. */
import { Modal } from '@/components/common/modal/modal';
import { Task } from '@/components/compose/gantt';
import { ShiftService } from '@/services';
import { IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import { useEffect, useMemo } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Avatar } from '@/components/common/Avatar';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { DateUtils } from '@/utils/utilities/dates';
import { useTranslation } from 'react-i18next';
import { TextEllipsis } from '@/components/common/text-ellipsis';

interface IShiftFormProps {
  closed?: boolean;
  onClose?: () => void;
  taskSelected?: Task;
  onSupervision?: () => void;
  posAction?: () => void;
}

const Badge = (props: { children: any; className?: string }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${props.className || ''}`}
  >
    {props.children}
  </span>
);

const InfoRow = (props: {
  label: string;
  value?: any;
  icon?: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${props.className || ''}`}
    >
      <div className='min-w-[140px] text-xs text-t-light-dark dark:text-t-dark'>
        {props.label}
      </div>

      <div className='flex-1 flex items-center justify-end text-right gap-2'>
        {props.icon && (
          <span className='w-4 flex items-center justify-center'>
            <span
              className={`vox-icon vx-icon-${props.icon} text-primary !text-sm`}
            />
          </span>
        )}

        <div className='text-sm font-medium text-gray-700 dark:text-gray-200 break-words'>
          {props.value || '-'}
        </div>
      </div>
    </div>
  );
};

const InfoBlock = (props: { title: string; children: any }) => (
  <div className='rounded-lg border border-b-light dark:border-b-dark-light bg-b-light dark:bg-b-dark-light overflow-hidden'>
    <div className='px-4 py-2 border-b border-b-light dark:border-b-dark-light'>
      <div className='text-xs font-semibold uppercase tracking-wide text-t-light-dark dark:text-t-dark'>
        {props.title}
      </div>
    </div>
    <div className='p-4'>{props.children}</div>
  </div>
);

const Divider = () => (
  <div className='h-px bg-b-light dark:bg-b-dark-light opacity-70 my-2' />
);

const MapCard = (props: {
  title: string;
  time: string;
  name: string;
  lat: number;
  lng: number;
}) => {
  return (
    <div className='bg-white dark:bg-b-dark-dark rounded-lg overflow-hidden border border-b-light dark:border-b-dark-light'>
      <div className='flex items-center justify-between px-3 py-2 border-b border-b-light dark:border-b-dark-light'>
        <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
          {props.title}
        </span>
        <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
          {props.time || '-'}
        </span>
      </div>
      <div className='h-44'>
        <MapLibrePointsMap
          sendPoints={() => {}}
          name={props.name}
          center={{ lat: props.lat, lng: props.lng }}
          pointsAmount={1}
          pointsRef={[{ id: 1, position: { lat: props.lat, lng: props.lng } }]}
          condition={false}
          errorCondition=''
          radialPoint={null}
          errorRadialPoint=''
          radius={50}
          draggable={false}
          width='100%'
          clickPoint={() => {}}
        />
      </div>
    </div>
  );
};

const LoaderOverlay = () => {
  return (
    <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-b-dark-dark/70 backdrop-blur-[1px] rounded-lg'>
      <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-b-dark-dark border border-b-light dark:border-b-dark-light shadow-sm'>
        <div className='w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-transparent animate-spin' />
        <div className='text-sm font-medium text-gray-700 dark:text-gray-200'>
          Cargando...
        </div>
      </div>
    </div>
  );
};

export const ShiftForm = ({
  taskSelected,
  closed,
  onClose,
  posAction,
}: IShiftFormProps) => {
  const { t } = useTranslation();
  const shift = useSignal<IShiftResponse>();
  const loading = useSignal(false);

  const showReplicateForm = useSignal(false);
  const replicateDate = useSignal('');

  const getShiftHandler = async () => {
    if (!taskSelected) return;

    loading.value = true;
    try {
      const response = await ShiftService.get_shift(taskSelected.id);
      if (!response.getStatus()) return;
      shift.value = response.getOne();
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    if (closed) getShiftHandler();
  }, [closed]);

  const toggleReplicateClick = () => {
    showReplicateForm.value = !showReplicateForm.value;
  };

  const setReplicateHandler = async (date: string) => {
    if (!taskSelected?.id) return;

    loading.value = true;
    try {
      const response = await ShiftService.set_replicate({
        date,
        id: taskSelected.id,
      });
      if (!response.getStatus()) {
        ToastManager.error('s_replicated_error');
        return;
      }
      ToastManager.success('s_replicated_success');
      showReplicateForm.value = false;
      replicateDate.value = '';
      onClose?.();
      posAction?.();
    } finally {
      loading.value = false;
    }
  };

  const handleAcceptReplicate = () => {
    if (!replicateDate.value) {
      ToastManager.error('s_must_select');
      return;
    }
    setReplicateHandler(DateUtils.dateToBackend(replicateDate.value));
  };

  const onDeleteShift = async () => {
    if (!taskSelected?.id) return;

    loading.value = true;
    try {
      const response = await ShiftService.deleteActivity(taskSelected.id);
      if (!response.getStatus()) {
        ToastManager.error('s_deleted_error');
        return;
      }
      ToastManager.success('s_deleted_success');
      onClose?.();
      posAction?.();
    } finally {
      loading.value = false;
    }
  };

  const taskData = useMemo(() => {
    const s = shift.value;

    return {
      employeeName: s?.employee?.name || '',
      employeeSurname: s?.employee?.surname || '',
      employeeImage: s?.employee?.image || '',
      employeeEmail: s?.employee?.email || '',
      employeePhone: s?.employee?.phone || '',

      serviceName: s?.service?.name || '',
      status: s?.status || 'CREATED',
      type: s?.type || 'INTERNAL',
      contractName: s?.service?.contract?.name || '',
      placeName: s?.service?.place?.name || '',
      placeAddress: s?.service?.place?.address || '',
      priority: s?.service?.contract?.priority || 'MEDIUM',
      externalId: s?.externalId,
      externalPlatformId: s?.externalPlatformId,

      startDate: DateUtils.dateToFrontend(s?.start, { mode: '12', time: true }),
      endDate: DateUtils.dateToFrontend(s?.end, { mode: '12', time: true }),

      checkInTime: DateUtils.dateToFrontend(s?.checkIn?.time, {
        mode: '12',
        time: true,
      }),
      checkOutTime: DateUtils.dateToFrontend(s?.checkOut?.time, {
        mode: '12',
        time: true,
      }),

      checkInLat: s?.checkIn?.location?.lat || 4.649251,
      checkInLng: s?.checkIn?.location?.lng || -74.106992,
      checkOutLat: s?.checkOut?.location?.lat || 4.649251,
      checkOutLng: s?.checkOut?.location?.lng || -74.106992,
    };
  }, [shift.value]);

  const statusBadge = useMemo(() => {
    return (
      <Badge className='bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'>
        {taskData.status}
      </Badge>
    );
  }, [taskData.status]);

  const priorityBadge = useMemo(() => {
    const cls =
      taskData.priority === 'HIGH'
        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        : taskData.priority === 'MEDIUM'
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';

    return <Badge className={cls}>{taskData.priority}</Badge>;
  }, [taskData.priority]);

  const canDelete = taskData.status === 'CREATED' && !taskData.externalId;

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-lg font-semibold'>{t('h_shift_details')}</h3>
          <div className='text-sm text-t-light-dark dark:text-t-dark flex items-center gap-2 min-w-0'>
            <TextEllipsis text={taskData.serviceName} maxWidth='260px' />
            {taskData.externalId && (
              <Avatar
                name={taskData.externalPlatformId}
                size='sm'
                square
                bgColor='bg-teal-700 text-white'
              />
            )}
          </div>
        </div>
      }
    >
      <div className='relative w-full p-4 space-y-3'>
        {loading.value && <LoaderOverlay />}

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-start'>
          <div className='flex items-center gap-3 rounded-lg bg-b-light dark:bg-b-dark-light p-3'>
            <div className='w-12 h-12 rounded-lg bg-white/60 dark:bg-b-dark-dark/40 flex items-center justify-center shrink-0'>
              <Avatar
                src={taskData.employeeImage}
                name={taskData.employeeName}
                size='md'
                square
              />
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-center justify-between gap-2'>
                <div className='truncate text-sm font-semibold text-gray-700 dark:text-gray-200'>
                  <TextEllipsis
                    text={`${taskData.employeeName} ${taskData.employeeSurname}`}
                    maxWidth='260px'
                  />
                </div>
                {statusBadge}
              </div>
              <div className='mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs text-t-light-dark dark:text-t-dark'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span className='vox-icon vx-icon-309 !text-xs shrink-0' />
                  <span className='truncate'>
                    {taskData.employeeEmail || '-'}
                  </span>
                </div>
                <div className='flex items-center gap-2 min-w-0'>
                  <span className='vox-icon vx-icon-310 !text-xs shrink-0' />
                  <span className='truncate'>
                    {taskData.employeePhone || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2 min-w-[260px]'>
            <div className='flex items-center justify-end gap-2 flex-wrap'>
              {canDelete && (
                <Button
                  name='button-delete-shift'
                  label='l_delete'
                  icon='192'
                  onClick={onDeleteShift}
                  className='px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-b-dark-dark border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20'
                  disabled={loading.value}
                />
              )}
              <Button
                name='button-create-shift'
                label={showReplicateForm.value ? 'l_cancel' : 'l_replicate'}
                icon={showReplicateForm.value ? '192' : '292'}
                onClick={toggleReplicateClick}
                className='px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-b-dark-dark border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20'
                disabled={loading.value}
              />
            </div>

            <div className='w-full min-h-[42px]'>
              {showReplicateForm.value && (
                <div className='flex items-center justify-end gap-2'>
                  <Input
                    name='replicate-date'
                    type='date'
                    id='replicate-date-input'
                    value={replicateDate.value}
                    className='py-1'
                    onChange={(e) => {
                      replicateDate.value = (
                        e.target as HTMLInputElement
                      ).value;
                    }}
                    min={DateUtils.nowLocalFormatted('YYYY-MM-DD')}
                    icon='123'
                    disabled={loading.value}
                  />
                  <Button
                    name='button-accept-replicate'
                    label='l_replicate_until'
                    icon='293'
                    onClick={handleAcceptReplicate}
                    disabled={loading.value}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <InfoBlock title={t('h_shift_details')}>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div>
              <InfoRow label={t('h_service_type')} value={taskData.type} />
              <Divider />
              <InfoRow label={t('h_contract')} value={taskData.contractName} />
              <Divider />
              <InfoRow
                label={t('h_location')}
                icon='072'
                value={
                  <div className='text-right'>
                    <div className='font-medium text-gray-700 dark:text-gray-200'>
                      {taskData.placeName || '-'}
                    </div>
                    <div className='text-xs font-normal text-t-light-dark dark:text-t-dark'>
                      {taskData.placeAddress || '-'}
                    </div>
                  </div>
                }
              />
            </div>

            <div>
              <InfoRow
                label={t('h_start_date')}
                value={taskData.startDate}
                icon='323'
              />
              <Divider />
              <InfoRow
                label={t('h_end_date')}
                value={taskData.endDate}
                icon='323'
              />
              <Divider />
              <div className='flex items-center justify-between gap-3'>
                <div className='min-w-[140px] text-xs text-t-light-dark dark:text-t-dark'>
                  {t('h_priority')}
                </div>
                <div className='flex-1 flex justify-end'>{priorityBadge}</div>
              </div>
              {taskData.externalId && (
                <>
                  <Divider />
                  <InfoRow label='External ID' value={taskData.externalId} />
                </>
              )}
            </div>
          </div>
        </InfoBlock>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <MapCard
            title={t('h_check_in')}
            time={taskData.checkInTime}
            name='CheckInMap'
            lat={taskData.checkInLat}
            lng={taskData.checkInLng}
          />
          <MapCard
            title={t('h_check_out')}
            time={taskData.checkOutTime}
            name='CheckOutMap'
            lat={taskData.checkOutLat}
            lng={taskData.checkOutLng}
          />
        </div>
      </div>
    </Modal>
  );
};
