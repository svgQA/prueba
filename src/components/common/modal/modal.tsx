import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';
import { useState } from 'preact/hooks';
import { Button } from '../button/button';
import { ThemeButton } from '@/components/compose/button';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  open,
  onClose,
  header,
  children,
  footer,
  expandable,
  width,
  transparent,
  shadowed,
  position = 'fixed',
  theme = false,
}: IModalProps) => {
  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    const expanded = !expand;
    setExpand(expanded);
  };

  return (
    <div
      id={id}
      tabIndex={-1}
      className={`${open ? '' : 'hidden'} ${expand ? '' : 'p-7'} ${transparent ? 'bg-transparent' : 'bg-b-dark'} ${position} w-full h-full  right-0 top-0 flex justify-center items-center z-50 bg-opacity-95`}
    >
      {/*aria-hidden={true}*/}
      <div
        className={`${expand ? 'h-full' : 'h-fit'} ${width ? width : 'w-full'} ${shadowed ? 'shadow-lg' : ''} overflow-hidden rounded-md modal-shadow p-0 bg-b-white dark:bg-b-dark text-t-light dark:text-t-dark border-b-light-dark dark:border-b-dark-light border-2`}
      >
        {/* vox-scroll-design */}
        <div className='flex flex-row w-full items-center pt-2 p-3 border-b-2 border-b-gray-50 dark:border-b-dark-light'>
          <div class='flex flex-row w-full items-center px-2.5'>
            <div className='flex flex-row w-10/12 items-center'>{header}</div>
            <div className='flex w-2/12 items-center justify-end gap-2'>
              {theme && <ThemeButton rounded />}
              {expandable && (
                <Button
                  id='setting-expand'
                  name='setting-expand'
                  onClick={toggleExpand}
                  type='button'
                  rounded
                  icon={expand ? '276' : '058'}
                />
              )}

              {onClose && (
                <Button
                  id='setting-close'
                  name='setting-close'
                  onClick={onClose}
                  type='button'
                  rounded
                  icon='192'
                ></Button>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-row'>{children}</div>
        {footer && (
          <div className='flex flex-row w-full justify-end gap-2'>{footer}</div>
        )}
      </div>
    </div>
  );
};
