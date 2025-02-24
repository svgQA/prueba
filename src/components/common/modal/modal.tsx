import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';
import { useState } from 'preact/hooks';
import { Button } from '../button/button';

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
  position = 'absolute',
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
        className={`${expand ? 'h-full' : 'h-fit'} ${width ? width : 'w-full'} ${shadowed ? 'shadow-lg' : ''} overflow-hidden rounded-md modal-shadow p-1 border-2 bg-b-light dark:bg-b-dark text-t-light dark:text-t-dark border-b-light-dark dark:border-b-dark-light`}
      >
        {/* vox-scroll-design */}
        <div className='flex flex-row w-full items-center pt-2'>
          <div class='flex flex-row w-full items-center px-2.5'>
            <div className='flex flex-row w-10/12 items-center'>{header}</div>
            <div className='flex w-2/12 items-center justify-end'>
              {expandable && (
                <Button
                  id='setting-expand'
                  name='setting-expand'
                  onClick={toggleExpand}
                  type='button'
                  rounded
                  icon='105'
                ></Button>
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
