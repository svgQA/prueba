import { useEffect, useRef, useState } from 'preact/hooks';
import { Button } from '../button/button';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  shadowed?: boolean;
}
export const ExpandeableContent = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
  width = 'w-full',
  shadowed = true,
}: Props) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  const toggleClose = () => {
    const expanded = !open;
    setOpen(expanded);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={`absolute left-0 top-full mt-2 ${width} ${shadowed ? 'shadow-lg' : ''} rounded-md modal-shadow p-0 bg-white dark:bg-b-dark-dark text-t-light dark:text-t-dark border border-gray-200 dark:border-gray-700 z-40 animate-fade-in max-h-[300px] overflow-y-auto vox-scroll-design`}
    >
      {/* Header */}
      {header && (
        <div className='flex flex-row w-full items-center pt-2 p-3 border-b-2 border-b-b-light-light dark:border-b-dark-light bg-white dark:bg-b-dark-dark'>
          <div className='flex flex-row w-full items-center px-2.5'>
            <div className='flex flex-row w-full items-center'>{header}</div>
            <div className='flex items-center justify-end gap-2'>
              {onClose && (
                <Button
                  id='btn-close'
                  name='btn-close'
                  onClick={toggleClose}
                  type='button'
                  rounded
                  icon='192'
                  transparent
                  borderless
                ></Button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Content */}
      <div className='flex flex-row bg-white dark:bg-b-dark-dark'>
        {children}
      </div>
      {/* Footer */}
      {footer && (
        <div className='flex flex-row w-full justify-end gap-2 bg-white dark:bg-b-dark-dark'>
          {footer}
        </div>
      )}
    </div>
  );
};
