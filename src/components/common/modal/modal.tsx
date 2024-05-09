import { type FunctionComponent } from 'preact';
import { Corner, type IModalProps } from './interface';
import { useState } from 'preact/hooks';
import { initPosition } from './constants';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  name,
  open,
  onClose,
}: IModalProps) => {
  const [expand, setExpand] = useState(false);
  const [corner, setCorner] = useState<Corner>(initPosition);

  const toggleExpand = () => {
    const expanded = !expand;
    if (expanded) {
      setCorner({
        left: 0,
        top: 0,
      });
    } else {
      setCorner(initPosition);
    }
    setExpand(expanded);
  };

  const goBack = () => {};
  const goForward = () => {};
  const minMenu = () => {};

  return (
    <div
      id={id}
      name={name}
      tabIndex={-1}
      aria-hidden='true'
      className={`${open ? '' : 'hidden'} p-1 fixed top-0 right-0 left-0 z-50 justify-center items-center text-gray-700 bg-gray-50`}
      style={{
        left: corner.left + 'px',
        top: corner.top + 'px',
      }}
    >
      <div className={`relative ${expand ? 'h-screen' : 'max-w-6xl'}`}>
        <div
          className={`${expand ? 'min-h-[99vh]' : 'min-h-[93vh]'} modal-shadow rounded min-w-[90vw] bg-red-10`}
        >
          <div className='flex items-center justify-between p-3 cursor-grab'>
            <div className='flex flex-row'>
              <button
                onClick={goBack}
                type='button'
                className='text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-toggle='crud-modal'
              >
                {/* <LeftOutlined /> */}
              </button>
              <button
                onClick={goForward}
                type='button'
                className='text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-toggle='crud-modal'
              >
                {/* <RightOutlined /> */}
              </button>
              <button
                onClick={minMenu}
                type='button'
                className='text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-toggle='crud-modal'
              >
                {/* <SplitCellsOutlined /> */}
              </button>
            </div>
            {/* <Search
                className='mx-8 max-w-[450px]'
                placeholder='Search'
                allowClear
              /> */}
            <div className='flex flex-row'>
              <button
                onClick={toggleExpand}
                type='button'
                className='text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-toggle='crud-modal'
              >
                <svg
                  className='w-4 h-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <title>arrow-expand</title>
                  <path d='M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z' />
                </svg>
              </button>
              <button
                onClick={onClose}
                type='button'
                className='text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                data-modal-toggle='crud-modal'
              >
                <svg
                  className='w-4 h-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <title>window-close</title>
                  <path d='M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z' />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex flex-row p-1'>
            {/* <ModalbarMenu></ModalbarMenu> */}
            <div
              className={`${expand ? 'max-h-[92vh]' : 'max-h-[83vh]'} h-100 overflow-y-auto w-10/12 pl-1`}
            >
              <div className='h-8'>
                <h3 className='uppercase'>Devices</h3>
              </div>
              <section className='my-1'>{/* <DevicesFlowSection /> */}</section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
