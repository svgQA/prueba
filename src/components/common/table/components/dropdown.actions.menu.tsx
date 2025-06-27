import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Button } from '@/components/common/button/button';

export interface IDropdownAction {
  label: string;
  icon: string;
  color?: string;
  onClick?: () => void;
  keyName?: string;
}

interface DropdownActionsMenuProps {
  triggerClassName?: string;
  actions: IDropdownAction[];
}

export const DropdownActionsMenu = ({
  triggerClassName,
  actions,
}: DropdownActionsMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const handleOpen = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 200,
      });
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        className={
          triggerClassName ||
          'vox-icon vx-icon-options p-1 size-sm cursor-pointer'
        }
        onClick={handleOpen}
      />
      {isDropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className='w-56 bg-white dark:bg-b-dark-dark rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700'
          >
            <div className='flex flex-col gap-1 px-2'>
              {actions.map((action, idx) => (
                <Button
                  keyName={action.keyName}
                  key={idx}
                  id={`dropdown-action-${idx}`}
                  name={`dropdown-action-${idx}`}
                  label={action.label}
                  onClick={() => {
                    action?.onClick?.();
                    setIsDropdownOpen(false);
                  }}
                  textColor={action.color || 'text-gray-700 dark:text-gray-200'}
                  icon={action.icon.replace('vox-icon vx-icon-', '')}
                  padding='px-2 py-2'
                  text='text-sm'
                  borderless
                  full
                  className='w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150'
                />
              ))}
            </div>
            <div className='border-t border-gray-200 dark:border-gray-700'></div>
            <Button
              id='dropdown-cancel'
              name='dropdown-cancel'
              label='cancel'
              onClick={() => setIsDropdownOpen(false)}
              borderless
              unpadded
              full
            />
          </div>,
          document.body
        )}
    </>
  );
};
