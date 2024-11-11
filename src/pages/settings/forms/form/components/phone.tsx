import { useRef, useEffect } from 'preact/hooks';
import {
  decrementPhonePage,
  format,
  getFormLength,
  getPhonePage,
  incrementPhonePage,
} from '../store';
import { CardElement } from './card';

export const FormPhoneViewer = () => {
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pagesRef.current) {
      pagesRef.current.style.transform = `translateX(-${getPhonePage.value * 100}%)`;
    }
  }, [getPhonePage.value]);

  const handleNext = () => {
    if (getPhonePage.value < getFormLength.value - 1) {
      incrementPhonePage();
    }
  };

  const handlePrev = () => {
    if (getPhonePage.value > 0) {
      decrementPhonePage();
    }
  };

  return (
    <div className='absolute flex flex-col mr-2 py-2 items-center right-1 top-2'>
      <div className='absolute z-40 top-5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full' />
      <div className='border-b-light-dark dark:border-b-dark-light bg-b-light dark:bg-b-dark border-2 absolute z-20 bottom-4 flex flex-row w-80 justify-between items-center p-1 rounded-xl'>
        <span
          className={`${getFormLength.value > 1 && getPhonePage.value !== 0 ? 'visible' : 'invisible'} cursor-pointer px-2 font-bold`}
          onClick={handlePrev}
        >
          Prev
        </span>
        <div className='w-8 h-8 rounded-full flex items-center justify-center shadow'>
          <span className='vox-icon vx-icon-092 size-sm cursor-pointer font-bold'></span>
        </div>
        <span
          className={`${getFormLength.value > 1 && getPhonePage.value !== getFormLength.value - 1 ? 'visible' : 'invisible'} cursor-pointer px-2 font-bold`}
          onClick={handleNext}
        >
          Next
        </span>
      </div>
      <div className='border-b-light-dark dark:border-b-dark-light border-2 flex flex-col shadow-lg rounded-2xl w-[340px] h-[667px] overflow-hidden mx-auto px-2 pt-6 vox-scroll-design'>
        <div className='flex flex-col items-center justify-center mb-2 rounded-md py-2'>
          <h3 className='font-bold text-xl'>
            {format.value.label ? format.value.label : 'Form Title'}
          </h3>
          <p className='font-thin text-sm'>
            {format.value.description
              ? format.value.description
              : 'Form Description'}
          </p>
        </div>
        <div className='relative flex h-full w-full overflow-hidden'>
          <div
            ref={pagesRef}
            className='flex transition-transform duration-300 h-full w-full'
          >
            {format.value.pages.map((page) => (
              <div
                key={page.id}
                className='flex-shrink-0 w-full h-full overflow-y-auto pb-20 hide-scrollbar'
              >
                <div className='mb-4 pb-2 text-center'>
                  <h3 className='font-semibold font-md'>
                    {page.label ? page.label : 'Page Title'}
                  </h3>
                </div>
                {page.elements.map((element) => (
                  <CardElement
                    element={element}
                    key={element.id}
                    name={element.id}
                    id={element.id}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
