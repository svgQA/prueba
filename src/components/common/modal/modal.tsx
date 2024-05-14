import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';
// import { initPosition } from './constants';
import { useState } from 'preact/hooks';
import { Button } from '../button/button';
import { Input } from '../input/input';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  name,
  open,
  onClose,
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

  const goBack = () => {};
  const goForward = () => {};
  const minMenu = () => {};

  return (
    <div
      id={id}
      name={name}
      tabIndex={-1}
      aria-hidden='true'
      className={`${open ? '' : 'hidden'} w-full h-full absolute top-0 flex justify-center z-50 p-5`}
    >
      <div className='bg-zinc-50 p-3 modal-shadow rounded'>
        <div className='flex flex-row items-center p-2 min-w-[85em] bg-red-300 '>
          <div className='flex flex-row mr-4 min-w-48'>
            <Button
              id='setting-go-back'
              name='setting-go-back'
              onClick={goBack}
              type='button'
              rounded
              icon='users'
            ></Button>
            <Button
              id='setting-go-forward'
              name='setting-go-forward'
              onClick={goForward}
              type='button'
              rounded
              icon='apps'
            ></Button>
            <Button
              id='setting-min-menu'
              name='setting-min-menu'
              onClick={minMenu}
              type='button'
              rounded
              icon='graph'
            ></Button>
          </div>
          <Input
            id='setting-search'
            name='setting-search'
            placeholder='search'
            icon='search'
            type='text'
          />
          <div className='flex flex-row ml-4'>
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
        <div className='flex flex-row p-1 bg-blue-100'>
          <div className='w-2/12 mr-0.5 bg-teal-200'>
            {/* <Sidebar
              id='setting-sidebar'
              name='setting-sidebar'
              menus={SIDEBAR_MENUS}
              isNavigation
              position='relative'
            /> */}
          </div>
          <div className='w-10/12 min-h-[49.5em] ml-0.5 bg-green-500'></div>
          {/* <ModalbarMenu></ModalbarMenu> */}
          {/* <div
              className={`${expand ? 'max-h-[92vh]' : 'max-h-[83vh]'} h-100 overflow-y-auto w-10/12 pl-1`}
            >
              <div className='h-8'>
                <h3 className='uppercase'>Devices</h3>
              </div>
              <section className='my-1'>
              	<DevicesFlowSection />
              </section>
            </div> */}
        </div>
      </div>
    </div>
  );
};
