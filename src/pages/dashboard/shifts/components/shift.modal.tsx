import { Modal } from '@/components/common/modal/modal';
import { Task } from '@/components/compose/gantt';
import { ShiftService } from '@/services';
import { IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import dayjs from 'dayjs';
import { Map } from '@/components/common/map/map';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { toast } from 'react-toastify';

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
      toast.error('Error al replicar el turno');
      return;
    }
    toast.success('Turno replicado exitosamente');
    toggleReplicateClick();
    replicateDate.value = '';
    onClose?.();
    posAction?.();
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('D [de] MMMM, YYYY');
  };

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('HH:mm');
  };

  const onDeleteShift = async () => {
    if (!taskSelected?.id) return;
    const response = await ShiftService.deleteActivity(taskSelected?.id);
    if (!response.getStatus()) {
      toast.error('Error al eliminar el turno');
      return;
    }
    toast.success('Turno eliminado exitosamente');
    onClose?.();
    posAction?.();
  };

  const toggleReplicateClick = () => {
    showReplicateForm.value = !showReplicateForm.value;
  };

  const handleAcceptReplicate = () => {
    if (!replicateDate.value) {
      toast.error('Debe seleccionar una fecha');
      return;
    }
    setReplicateHandler(replicateDate.value);
  };

  const taskData = {
    employeeName: shift.value?.employee?.name || '',
    employeeSurname: shift.value?.employee?.surname || '',
    locationLat: shift.value?.service?.place?.latitude || 2.43823,
    locationLng: shift.value?.service?.place?.longitude || -76.61316,
    employeeImage: shift.value?.employee?.image || '',
    employeeEmail: shift.value?.employee?.email || '',
    employeePhone: shift.value?.employee?.phone || '',
    status: shift.value?.status || 'CREATED',
    type: shift.value?.type || 'INTERNAL',
    contractName: shift.value?.service?.contract?.name || '',
    placeName: shift.value?.service?.place?.name || '',
    placeAddress: shift.value?.service?.place?.address || '',
    startDate: shift.value?.start ? formatDate(shift.value.start) : '',
    startTime: shift.value?.start ? formatTime(shift.value.start) : '',
    endDate: shift.value?.end ? formatDate(shift.value.end) : '',
    endTime: shift.value?.end ? formatTime(shift.value.end) : '',
    priority: shift.value?.service?.contract?.priority || 'MEDIUM',
    checkInTime: shift.value?.checkIn?.time
      ? formatTime(shift.value?.checkIn?.time)
      : '',
    checkOutTime: shift.value?.checkOut?.time
      ? formatTime(shift.value?.checkOut?.time)
      : '',
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
        <div className='flex items-center gap-4 mb-6 px-5 py-2 justify-between'>
          <div className='flex flex-row items-center justify-between w-4/12'>
            <div className='w-20 h-20 rounded-full flex items-center justify-center bg-b-light'>
              {taskData.employeeImage ? (
                <img
                  src={taskData.employeeImage}
                  alt='Profile'
                  className='w-full h-full object-cover rounded-full'
                />
              ) : (
                <span className='!text-primary vox-icon size-lg vx-icon-308'></span>
              )}
            </div>
            <div className='px-4'>
              <h3 className='text-xl font-medium'>
                {taskData.employeeName} {taskData.employeeSurname}
              </h3>
              <div className='flex items-center gap-2 text-t-light-dark mt-1'>
                <span className='vox-icon vx-icon-309 !text-sm'></span>
                <span>{taskData.employeeEmail}</span>
              </div>
              <div className='flex items-center gap-2 text-t-light-dark'>
                <span className='vox-icon vx-icon-310 !text-sm'></span>
                <span>{taskData.employeePhone}</span>
              </div>
            </div>
          </div>
          <div className='flex py-3 w-5/12 justify-end items-center'>
            {showReplicateForm.value ? (
              <>
                <Button
                  name='button-hidden-replcate'
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
                  min={dayjs().format('YYYY-MM-DD')}
                  icon='123'
                />
                <Button
                  name='button-accept-replicate'
                  label='Replicar Hasta'
                  onClick={handleAcceptReplicate}
                  className='bg-primary text-white py-1 rounded px-4 w-96'
                />
              </>
            ) : (
              <>
                {taskData.status === 'CREATED' ||
                  (taskData.status === 'CLOSED' && (
                    <Button
                      name='button-delete-shift'
                      label='Eliminar'
                      onClick={onDeleteShift}
                      className='mx-3 px-4 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    />
                  ))}
                <Button
                  name='button-create-shift'
                  label='Replicar'
                  onClick={toggleReplicateClick}
                  className='mx-3 px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                />
                <Button
                  name='button-supervision'
                  label='Supervisión Remota'
                  className='bg-primary text-white py-1 rounded px-4'
                  onClick={onSupervision}
                />
              </>
            )}
          </div>
        </div>

        <div className='bg-b-light rounded-lg p-5 mx-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-t-light-dark mb-1'>Estado</p>
                <span className='bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium'>
                  {taskData.status}
                </span>
              </div>

              <div>
                <p className='text-sm text-t-light-dark mb-1'>
                  Tipo de Servicio
                </p>
                <p className='font-medium'>{taskData.type}</p>
              </div>

              <div>
                <p className='text-sm text-t-light-dark mb-1'>Contrato</p>
                <p className='font-medium'>{taskData.contractName}</p>
              </div>

              <div>
                <p className='text-sm text-t-light-dark mb-1'>Ubicación</p>
                <div className='flex items-start gap-2'>
                  <span className='vox-icon vx-icon-072 text-primary'></span>
                  <div>
                    <p className='font-medium'>{taskData.placeName}</p>
                    <p className='text-sm text-t-light-dark'>
                      {taskData.placeAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-t-light-dark mb-1'>
                  Fecha y Hora de Inicio
                </p>
                <div className='flex items-center gap-2'>
                  <span className='vox-icon vx-icon-323 text-primary'></span>
                  <p className='font-medium'>
                    {taskData.startDate} - {taskData.startTime}
                  </p>
                </div>
              </div>

              <div>
                <p className='text-sm text-t-light-dark mb-1'>
                  Fecha y Hora de Fin
                </p>
                <div className='flex items-center gap-2'>
                  <span className='vox-icon vx-icon-323 text-primary'></span>
                  <p className='font-medium'>
                    {taskData.endDate} - {taskData.endTime}
                  </p>
                </div>
              </div>

              <div>
                <p className='text-sm text-t-light-dark mb-1'>Prioridad</p>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    taskData.priority === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : taskData.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
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
            <div className='bg-white rounded-lg'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-lg font-medium'>Check-in</h4>
                <span className='text-xl font-medium'>
                  {taskData.checkInTime}
                </span>
              </div>
              <div className='h-48 rounded-lg overflow-hidden'>
                <Map
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
                />
              </div>
            </div>

            <div className='bg-white rounded-lg'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='text-lg font-medium'>Check-out</h4>
                <span className='text-xl font-medium'>
                  {taskData.checkOutTime}
                </span>
              </div>
              <div className='h-48 rounded-lg overflow-hidden'>
                <Map
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
