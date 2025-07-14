import { useRef, useEffect } from 'preact/hooks';
import { ManualNotificationForm } from './tabs/manual-notification-form';
import { Button } from '@/components/common/button/button';
interface Props {
  hasplayers?: boolean;
  onClose?: () => void;
  users?: [];
}

export const SendForm = ({ onClose, users, hasplayers }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar si se hace click por fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  if (closed) return null;

  return (
    <div
      ref={ref}
      className='bg-white dark:bg-b-dark-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-h-[70vh] overflow-auto vox-scroll-design'
    >
      <div className='px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center pb-2 bg-white dark:bg-b-dark-dark'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-gray-200'>
          Centro de notificaciones
        </h3>
        <Button
          name='btn-close'
          onClick={onClose}
          icon='008'
          square
          borderless
        />
      </div>

      <ManualNotificationForm
        users={users}
        hasplayers={hasplayers}
        onClose={onClose}
      />
    </div>
  );
};
