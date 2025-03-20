import { Modal } from '@/components/common/modal/modal';
import { Task } from '@/components/compose/gantt';
import { ShiftService } from '@/services';
import { IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import dayjs from 'dayjs';

interface IShiftFormProps {
  closed?: boolean;
  onClose?: () => void;
  taskSelected?: Task;
}

export const ShiftForm = ({
  taskSelected,
  closed,
  onClose,
}: IShiftFormProps) => {
  const shift = useSignal<IShiftResponse>();

  const getShiftHandler = async () => {
    if (!taskSelected) return;
    const response = await ShiftService.get_shift(taskSelected?.id);
    if (!response.getStatus()) return;
    shift.value = response.getOne();
  };

  useEffect(() => {
    getShiftHandler();
  }, []);

  // Función para formatear fechas usando dayjs
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('D [de] MMMM, YYYY HH:mm');
  };

  // Formatear solo la hora
  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('HH:mm');
  };

  // Crear un objeto memoizado para evitar re-renders innecesarios
  const taskData = {
    employeeName: shift.value?.employee?.name || '',
    employeeSurname: shift.value?.employee?.surname || '',
    employeeImage: shift.value?.employee?.image || '',
    employeeEmail: shift.value?.employee?.email || '',
    employeePhone: shift.value?.employee?.phone || '',
    status: shift.value?.status || 'CREATED',
    type: shift.value?.type || 'INTERNAL',
    contractName: shift.value?.service?.contract?.name || 'carus degero',
    placeName: shift.value?.service?.place?.name || 'iure dolore',
    placeAddress:
      shift.value?.service?.place?.address || '66162 Theresia Landing',
    startDate: shift.value?.start
      ? formatDate(shift.value.start)
      : '9 de marzo, 2025 16:27',
    endDate: shift.value?.end
      ? formatDate(shift.value.end)
      : '10 de marzo, 2025 09:27',
    priority: shift.value?.service?.contract?.priority || 'MEDIUM',
    checkInTime: shift.value?.checkIn?.time
      ? formatTime(shift.value?.checkIn?.time)
      : '00:22',
    checkOutTime: shift.value?.checkOut?.time
      ? formatTime(shift.value?.checkOut?.time)
      : '09:54',
  };

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={<h3>Detalles del Turno</h3>}
    >
      <div className='w-full py-3'>
        {/* Sección de información del cliente */}
        <div className='flex items-center gap-4 mb-6 px-5'>
          <div className='w-16 h-16 rounded-full overflow-hidden'>
            <img
              src={taskData.employeeImage || '/api/placeholder/80/80'}
              alt='Profile'
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <h3 className='text-lg font-medium'>
              {taskData.employeeName} {taskData.employeeSurname}
            </h3>
            <div className='flex items-center text-gray-600 mt-1'>
              <span className='block'>{taskData.employeeEmail}</span>
            </div>
            <div className='flex items-center text-gray-600 mt-1'>
              <span className='block'>{taskData.employeePhone}</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-3 bg-gray-200'>
          <div>
            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Estado</p>
              <div className='flex items-center mt-1'>
                <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium'>
                  {taskData.status}
                </span>
              </div>
            </div>

            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Tipo</p>
              <p className='mt-1'>{taskData.type}</p>
            </div>

            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Contrato</p>
              <p className='mt-1'>{taskData.contractName}</p>
            </div>

            <div className='mb-4 flex items-start gap-2'>
              <span className='vox-icon vx-icon-048 !text-sm' />
              <p>{taskData.placeName}</p>
            </div>

            <div className='mb-4 flex items-start gap-2'>
              <span className='vox-icon vx-icon-072 !text-sm' />
              <p>{taskData.placeAddress}</p>
            </div>
          </div>

          {/* Columna derecha */}
          <div>
            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Inicio</p>
              <div className='flex items-center mt-1 gap-2'>
                <span className='vox-icon vx-icon-049 !text-sm' />
                <p>{taskData.startDate}</p>
              </div>
            </div>

            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Fin</p>
              <div className='flex items-center mt-1 gap-2'>
                <span className='vox-icon vx-icon-049 !text-sm' />
                <p>{taskData.endDate}</p>
              </div>
            </div>

            <div className='mb-4'>
              <p className='text-sm text-gray-500'>Prioridad</p>
              <p className='mt-1'>{taskData.priority}</p>
            </div>
          </div>
        </div>

        {/* Sección de Check-in y Check-out */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-3 '>
          <div>
            <p className='text-sm text-gray-500 mb-2'>Check-in</p>
            <p className='mb-2'>{taskData.checkInTime}</p>
            <div className='h-48 bg-gray-200 rounded-md relative overflow-hidden'>
              {/* Aquí iría un mapa real */}
              <div className='h-full w-full flex items-center justify-center'>
                <span className='vox-icon vx-icon-072 !text-sm' />
              </div>
            </div>
          </div>

          <div>
            <p className='text-sm text-gray-500 mb-2'>Check-out</p>
            <p className='mb-2'>{taskData.checkOutTime}</p>
            <div className='h-48 bg-gray-200 rounded-md relative overflow-hidden'>
              {/* Aquí iría un mapa real */}
              <div className='h-full w-full flex items-center justify-center'>
                <span className='vox-icon vx-icon-072 !text-sm' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
