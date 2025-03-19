import { Modal } from '@/components/common/modal/modal';
import { Button } from '@/components/common/button/button';
import { useMemo } from 'preact/hooks';

interface Props {
  closed?: boolean;
  onClose?: () => void;
  onSend?: (data: any) => void;
}

export const SendForm = ({ closed, onClose, onSend }: Props) => {
  const footerContent = useMemo(
    () => (
      <div className='flex dark:bg-b-dark-light justify-end items-center gap-2 p-4 bg-gray-50'>
        <Button
          id='btn-form-shift-close'
          name='btn-form-shift-close'
          type='button'
          label='Cancelar'
          onClick={onClose}
        />
        <Button
          id='btn-form-shift-save'
          name='btn-form-shift-save'
          type='button'
          label='Aceptar'
          className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
          onClick={onSend}
        />
      </div>
    ),
    [onClose, onSend]
  );

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={<h3>Send Message</h3>}
      footer={footerContent}
    >
      <div className='px-4 py-6'>Send message</div>
    </Modal>
  );
};
