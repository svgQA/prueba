import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';
import { useState } from 'preact/hooks';
import { Button } from '../button/button';
// import { initPosition } from './constants';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  name,
  open,
  onClose,
  header,
}: IModalProps) => {
  const [expand, setExpand] = useState(false);
  // const [corner, setCorner] = useState<Corner>(initPosition);

  const toggleExpand = () => {
    const expanded = !expand;
    // if (expanded) {
    //   setCorner({
    //     left: 0,
    //     top: 0,
    //   });
    // } else {
    //   setCorner(initPosition);
    // }
    setExpand(expanded);
  };

  return (
    <div
      id={id}
      name={name}
      tabIndex={-1}
      aria-hidden='true'
      className={`${open ? '' : 'hidden'} ${expand ? '' : 'p-7'} w-full h-full absolute right-0 top-0 flex justify-center z-50 bg-gray-50`}
    >
      <div className='modal-shadow w-full h-auto rounded bg-purple-200'>
        <div className='flex flex-row w-full items-center p-1 bg-red-700'>
          <div class='flex flex-row w-full items-center justify-end bg-blue-200 px-2'>
            {header}
            <div className='w-32 flex items-center justify-end'>
              <Button
                id='setting-expand'
                name='setting-expand'
                onClick={toggleExpand}
                type='button'
                rounded
                icon='gateway'
              ></Button>
              <Button
                id='setting-close'
                name='setting-close'
                onClick={onClose}
                type='button'
                rounded
                icon='logo'
              ></Button>
            </div>
          </div>
        </div>
        {/* <div className='flex flex-row bg-blue-100'>
          <div className='w-2/12 bg-teal-200'>{sidebar}</div>
          <div className='w-10/12 max-h-[86vh] min-h-96 bg-green-500'>
            {body}
          </div>
        </div> */}
      </div>
    </div>
  );
};
