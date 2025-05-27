import { Modal } from '@/components/common/modal/modal';
import { Task } from '@/components/compose/gantt';
import { ShiftService } from '@/services';
import { IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
// import { Map } from '@/components/common/map/map';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Avatar } from '@/components/common/Avatar';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { DateUtils } from '@/utils/utilities/dates';

interface IShiftFormProps {
  closed?: boolean;
  onClose?: () => void;
  taskSelected?: Task;
  onSupervision?: () => void;
  posAction?: () => void;
}

export const ShiftForm = ({
  taskSelected,
  closed,
  onClose,
  onSupervision,
  posAction,
}: IShiftFormProps) => {
  const shift = useSignal<IShiftResponse>();
  const showReplicateForm = useSignal<boolean>(false);
  const replicateDate = useSignal<string>('');

  /*
  const checkInPoints = useSignal([
    {
      id: 1,
      position: {
        lat: shift.value?.checkIn?.location?.lat || 4.649251,
        lng: shift.value?.checkIn?.location?.lng || -74.106992,
      },
    },
  ]);

  const checkOutPoints = useSignal([
    {
      id: 1,
      position: {
        lat: shift.value?.checkOut?.location?.lat || 4.649251,
        lng: shift.value?.checkOut?.location?.lng || -74.106992,
      },
    },
  ]);
  */

  const getShiftHandler = async () => {
    if (!taskSelected) return;
    const response = await ShiftService.get_shift(taskSelected?.id);
    if (!response.getStatus()) return;
    shift.value = response.getOne();
  };

  useEffect(() => {
    if (closed) getShiftHandler();
  }, [closed]);

  const setReplicateHandler = async (date: string) => {
    if (!taskSelected?.id) return;
    const response = await ShiftService.set_replicate({
      date: date,
      id: taskSelected?.id,
    });
    if (!response.getStatus()) {
      ToastManager.error('Error al replicar el turno');
      return;
    }
    ToastManager.success('Turno replicado exitosamente');
    toggleReplicateClick();
    replicateDate.value = '';
    onClose?.();
    posAction?.();
  };

  const onDeleteShift = async () => {
    if (!taskSelected?.id) return;
    const response = await ShiftService.deleteActivity(taskSelected?.id);
    if (!response.getStatus()) {
      ToastManager.error('Error al eliminar el turno');
      return;
    }
    ToastManager.success('Turno eliminado exitosamente');
    onClose?.();
    posAction?.();
  };

  const toggleReplicateClick = () => {
    showReplicateForm.value = !showReplicateForm.value;
  };

  const handleAcceptReplicate = () => {
    if (!replicateDate.value) {
      ToastManager.error('Debe seleccionar una fecha');
      return;
    }
    setReplicateHandler(DateUtils.dateToBackend(replicateDate.value));
  };

  const taskData = {
    employeeName: shift.value?.employee?.name || '',
    employeeSurname: shift.value?.employee?.surname || '',
    locationLat: shift.value?.service?.place?.latitude || 2.43823,
    locationLng: shift.value?.service?.place?.longitude || -76.61316,
    serviveName: shift.value?.service?.name || '',
    employeeImage: shift.value?.employee?.image || '',
    employeeEmail: shift.value?.employee?.email || '',
    employeePhone: shift.value?.employee?.phone || '',
    status: shift.value?.status || 'CREATED',
    type: shift.value?.type || 'INTERNAL',
    contractName: shift.value?.service?.contract?.name || '',
    placeName: shift.value?.service?.place?.name || '',
    placeAddress: shift.value?.service?.place?.address || '',
    startDate: DateUtils.dateToFrontend(shift?.value?.start, {
      mode: '12',
      time: true,
    }),
    endDate: DateUtils.dateToFrontend(shift?.value?.end, {
      mode: '12',
      time: true,
    }),
    priority: shift.value?.service?.contract?.priority || 'MEDIUM',
    checkInTime: DateUtils.dateToFrontend(shift?.value?.checkIn?.time, {
      mode: '12',
      time: true,
    }),
    checkOutTime: DateUtils.dateToFrontend(shift?.value?.checkOut?.time, {
      mode: '12',
      time: true,
    }),
  };

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={<h3 className='text-xl font-medium'>Detalles del Turno</h3>}
    >
      <div className='w-full py-3'>
        <div className='flex w-full p-3 justify-center'>
          <h2 className='text-gray-700 dark:text-gray-200'>
            Service: {taskData.serviveName}
          </h2>
        </div>

        <div className='flex items-center gap-4 mb-6 px-5 py-2 justify-between'>
          <div className='flex flex-row items-center justify-evenly w-4/12'>
            <div className='w-20 h-20 rounded-full flex items-center justify-center bg-b-light dark:bg-b-dark-light'>
              <Avatar
                src={taskData.employeeImage}
                name={taskData.employeeName}
                size='lg'
                square
              />
            </div>
            <div className='px-4'>
              <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200'>
                {taskData.employeeName} {taskData.employeeSurname}
              </h3>
              <div className='flex items-center gap-2 text-t-light-dark dark:text-t-dark mt-1'>
                <span className='vox-icon vx-icon-309 !text-sm'></span>
                <span>{taskData.employeeEmail}</span>
              </div>
              <div className='flex items-center gap-2 text-t-light-dark dark:text-t-dark'>
                <span className='vox-icon vx-icon-310 !text-sm'></span>
                <span>{taskData.employeePhone}</span>
              </div>
            </div>
          </div>
          <div className='flex py-3 w-5/12 justify-end items-center gap-2'>
            {showReplicateForm.value ? (
              <>
                <Button
                  name='button-hidden-replicate'
                  rounded
                  icon='192'
                  onClick={toggleReplicateClick}
                />
                <Input
                  name='replicate-date'
                  type='date'
                  id='replicate-date-input'
                  value={replicateDate.value}
                  className='py-1'
                  onChange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    replicateDate.value = value;
                  }}
                  min={DateUtils.nowLocalFormatted('YYYY-MM-DD')}
                  icon='123'
                />
                <Button
                  name='button-accept-replicate'
                  label='Replicar Hasta'
                  icon='293'
                  onClick={handleAcceptReplicate}
                />
              </>
            ) : (
              <>
                {taskData.status === 'CREATED' ||
                  (taskData.status === 'CLOSED' && (
                    <Button
                      name='button-delete-shift'
                      label='Eliminar'
                      icon='192'
                      onClick={onDeleteShift}
                      className='mx-3 px-4 py-1 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-b-dark-dark border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    />
                  ))}
                <Button
                  name='button-create-shift'
                  label='Replicar'
                  icon='292'
                  onClick={toggleReplicateClick}
                  className='mx-3 px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-b-dark-dark border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                />
                <Button
                  name='button-supervision'
                  label='Supervisión Remota'
                  icon='092'
                  className='bg-primary text-white py-1 rounded px-4'
                  onClick={onSupervision}
                />
              </>
            )}
          </div>
        </div>

        <div className='bg-b-light dark:bg-b-dark-light rounded-lg p-5 mx-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Estado
                </p>
                <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-medium'>
                  {taskData.status}
                </span>
              </div>

              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Tipo de Servicio
                </p>
                <p className='font-medium text-gray-700 dark:text-gray-200'>
                  {taskData.type}
                </p>
              </div>

              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Contrato
                </p>
                <p className='font-medium text-gray-700 dark:text-gray-200'>
                  {taskData.contractName}
                </p>
              </div>

              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Ubicación
                </p>
                <div className='flex items-start gap-2'>
                  <span className='vox-icon vx-icon-072 text-primary'></span>
                  <div>
                    <p className='font-medium text-gray-700 dark:text-gray-200'>
                      {taskData.placeName}
                    </p>
                    <p className='text-sm text-t-light-dark dark:text-t-dark'>
                      {taskData.placeAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Fecha y Hora de Inicio
                </p>
                <div className='flex items-center gap-2'>
                  <span className='vox-icon vx-icon-323 text-primary'></span>
                  <p className='font-medium text-gray-700 dark:text-gray-200'>
                    {taskData.startDate}
                  </p>
                </div>
              </div>

              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Fecha y Hora de Fin
                </p>
                <div className='flex items-center gap-2'>
                  <span className='vox-icon vx-icon-323 text-primary'></span>
                  <p className='font-medium text-gray-700 dark:text-gray-200'>
                    {taskData.endDate}
                  </p>
                </div>
              </div>

              <div>
                <p className='text-sm text-t-light-dark dark:text-t-dark mb-1'>
                  Prioridad
                </p>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    taskData.priority === 'HIGH'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : taskData.priority === 'MEDIUM'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}
                >
                  {taskData.priority}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-8 px-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-3'>
            <div className='bg-white dark:bg-b-dark-dark rounded-lg'>
              <div className='flex items-center justify-between mb-4 p-4'>
                <h4 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
                  Check-in
                </h4>
                <span className='text-xl font-medium text-gray-700 dark:text-gray-200'>
                  {taskData.checkInTime}
                </span>
              </div>
              <div className='h-48 rounded-lg overflow-hidden'>
                {/* <Map
                  sendPoints={() => {}}
                  name='CheckInMap'
                  center={{
                    lat: taskData.locationLat,
                    lng: taskData.locationLng,
                  }}
                  pointsAmount={1}
                  pointsRef={checkInPoints.value}
                  condition={false}
                  errorCondition=''
                  radialPoint={null}
                  errorRadialPoint=''
                  radius={50}
                  draggable={false}
                  width='100%'
                  clickPoint={() => {}}
                /> */}
                <MapLibrePointsMap
                  sendPoints={() => {}}
                  name='CheckInMap'
                  center={{
                    lat: shift.value?.checkIn?.location?.lat || 4.649251,
                    lng: shift.value?.checkIn?.location?.lng || -74.106992,
                  }}
                  pointsAmount={1}
                  pointsRef={[
                    {
                      id: 1,
                      position: {
                        lat: shift.value?.checkIn?.location?.lat || 4.649251,
                        lng: shift.value?.checkIn?.location?.lng || -74.106992,
                      },
                    },
                  ]}
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

            <div className='bg-white dark:bg-b-dark-dark rounded-lg'>
              <div className='flex items-center justify-between mb-4 p-4'>
                <h4 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
                  Check-out
                </h4>
                <span className='text-xl font-medium text-gray-700 dark:text-gray-200'>
                  {taskData.checkOutTime}
                </span>
              </div>
              <div className='h-48 rounded-lg overflow-hidden'>
                {/* <Map
                  sendPoints={() => {}}
                  name='CheckOutMap'
                  center={{
                    lat: taskData.locationLat,
                    lng: taskData.locationLng,
                  }}
                  pointsAmount={1}
                  pointsRef={checkOutPoints.value}
                  condition={false}
                  errorCondition=''
                  radialPoint={null}
                  errorRadialPoint=''
                  radius={50}
                  draggable={false}
                  width='100%'
                  clickPoint={() => {}}
                /> */}
                <MapLibrePointsMap
                  sendPoints={() => {}}
                  name='CheckOutMap'
                  center={{
                    lat: shift.value?.checkOut?.location?.lat || 4.649251,
                    lng: shift.value?.checkOut?.location?.lng || -74.106992,
                  }}
                  pointsAmount={1}
                  pointsRef={[
                    {
                      id: 1,
                      position: {
                        lat: shift.value?.checkOut?.location?.lat || 4.649251,
                        lng: shift.value?.checkOut?.location?.lng || -74.106992,
                      },
                    },
                  ]}
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
          </div>
        </div>
      </div>
    </Modal>
  );
};
