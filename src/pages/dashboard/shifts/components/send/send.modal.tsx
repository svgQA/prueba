import { useRef, useEffect } from 'preact/hooks';
import { ManualNotificationForm } from './tabs/manual-notification-form';
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
      className='w-[800px] max-w-[90vw] bg-gray-100 py-3 border-dashedrounded border-round-lg border absolute z-50 p-4 mt-8'
    >
      <div className='px-4 py-3 border-b flex justify-between items-center'>
        <h3 className='text-base font-semibold'>Centro de notificaciones</h3>
        <button
          onClick={onClose}
          className='text-sm text-gray-500 hover:text-gray-700 border-none'
        >
          ✕
        </button>
      </div>

      <ManualNotificationForm users={users} hasplayers={hasplayers} />
    </div>
  );
};
