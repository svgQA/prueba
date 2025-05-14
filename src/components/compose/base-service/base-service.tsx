import { type FunctionComponent } from 'preact';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';
import {
  getTypeOfError,
  clearErrorState,
} from '@/store/signals/service/service.signals';

interface ModalBaseServiceProps {
  isOpen: boolean;
}

export const ModalBaseService: FunctionComponent<ModalBaseServiceProps> = ({
  isOpen,
}) => {
  const { t } = useTranslation();
  const typeOfError = getTypeOfError();

  const handleClose = () => {
    clearErrorState();
    // TODO: Cambiar esto para que no se recargue la página
    // Tocaría implementar una manera de recuperar la ultima petición
    // y volver a intentarlo
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div class='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div class='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
        <div class='flex items-center space-x-3 mb-4'>
          <div class='bg-yellow-100 text-yellow-600 rounded-full p-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              class='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z'
              />
            </svg>
          </div>
          <h2 class='text-lg font-semibold'>
            {typeOfError === 'network'
              ? t('error.service.networkTitle')
              : t('error.service.authorizationTitle')}
          </h2>
        </div>
        <p class='text-gray-600 mb-6'>
          {typeOfError === 'network'
            ? t('error.service.networkMessage')
            : t('error.service.authorizationMessage')}
        </p>
        <div class='flex justify-end space-x-3'>
          <Button
            name='close'
            id='close-modal-btn'
            type='button'
            onClick={handleClose}
            label={
              typeOfError === 'network'
                ? t('error.service.actionNetwork')
                : t('error.service.actionAuthorization')
            }
            className='!bg-primary !text-white'
          />
        </div>
      </div>
    </div>
  );
};
