import { useEffect, useRef } from 'preact/hooks';

export interface IExpanderNotificationProps {
  children: React.ReactNode;
  isOpen: boolean;
}
const ExpanderNotification = ({
  children,
  isOpen,
}: IExpanderNotificationProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        isOpen = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
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
