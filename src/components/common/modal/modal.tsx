import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';
import { useState } from 'preact/hooks';
import { Button } from '../button/button';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  name,
  open,
  onClose,
  header,
  children,
}: IModalProps) => {
  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    const expanded = !expand;
    setExpand(expanded);
  };

  return (
    <div
      id={id}
      name={name}
      tabIndex={-1}
      aria-hidden='true'
      className={`${open ? '' : 'hidden'} ${expand ? '' : 'p-7'} w-full h-full absolute right-0 top-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-60`}
    >
      <div
        className={`${expand ? 'h-full' : 'h-fit'} overflow-y-hidden rounded-md modal-shadow w-full p-1 border-2 bg-neutral-100`}
      >
        <div className='flex flex-row w-full items-center p-1'>
          <div class='flex flex-row w-full items-center justify-end mb-2'>
            {header}
            <div className='w-32 flex items-center justify-end ml-2'>
              <Button
                id='setting-expand'
                name='setting-expand'
                onClick={toggleExpand}
                type='button'
                rounded
                icon='105'
              ></Button>
              <Button
                id='setting-close'
                name='setting-close'
                onClick={onClose}
                type='button'
                rounded
                icon='192'
              ></Button>
            </div>
          </div>
        </div>
        <div className='flex flex-row'>{children}</div>
      </div>
    </div>
  );
};
