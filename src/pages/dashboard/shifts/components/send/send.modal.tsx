import { useRef, useEffect } from 'preact/hooks';
import { ManualNotificationForm } from './tabs/manual-notification-form';
interface Props {
  closed?: boolean;
  onClose?: () => void;
  onSend?: (data: any) => void;
  users?: [];
}

export const SendForm = ({ closed, onClose, users }: Props) => {
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

  console.log(users);

  return (
    <div
      ref={ref}
      className='absolute mt-2 w-[400px] max-w-[90vw] bg-white rounded shadow-lg z-50 border'
    >
      <div className='px-4 py-3 border-b flex justify-between items-center'>
        <h3 className='text-base font-semibold'>Centro de notificaciones</h3>
        <button
          onClick={onClose}
          className='text-sm text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>

      <div className='px-4 pt-3'>
        <ManualNotificationForm users={users} />
      </div>
    </div>
  );
};
