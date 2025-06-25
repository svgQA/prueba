import { Modal } from '../modal/modal';
import { PanicModalProps } from './interface';
import { FunctionComponent } from 'preact';
import './panic.style.css';
import { FormattedDate } from '@/components/compose/forms';

export const PanicModal: FunctionComponent<PanicModalProps> = ({ open, onClose, panic }) => {
  return (
    <Modal
      name='panic-modal'
      open={open}
      onClose={onClose}
      width='max-w-md'
      shadowed
      header={
        <div className='flex items-center gap-3'>
          <span className='text-4xl font-extrabold text-red-600 animate-pulse'>SOS</span>
          <span className='text-lg font-bold text-red-500'>¡Alerta de Pánico!</span>
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center w-full p-6 gap-4 fade-in-shake'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-2xl font-bold text-red-600'>
            {panic?.message || 'Mensaje de pánico'}
          </span>
          {panic?.user && (
            <span className='text-lg text-gray-700 dark:text-gray-200'>
              {panic.user.name} {panic.user.surname}
            </span>
          )}
          {panic?.date && (
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              <FormattedDate date={panic.date} format='datetime' />
            </span>
          )}
        </div>
        <div className='w-20 h-20 flex items-center justify-center rounded-full bg-red-100 border-4 border-red-500 shadow-lg animate-pulse'>
          <span className='text-3xl font-extrabold text-red-600'>SOS</span>
        </div>
      </div>
    </Modal>
  );
};

export default PanicModal; 