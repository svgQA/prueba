import { useEffect, useRef, useState } from 'preact/hooks';

export interface IExpanderNotificationProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const ExpanderNotification = ({
  children,
  isOpen,
}: IExpanderNotificationProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincroniza el estado interno con la prop isOpen
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          ref={dropdownRef}
          className='absolute top-full right-0 mt-2 bg-white dark:bg-b-dark-dark shadow-lg rounded-lg p-2 animate-fade-in border border-gray-200 dark:border-gray-700 w-80 max-h-[300px] overflow-y-auto vox-scroll-design'
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ExpanderNotification;
