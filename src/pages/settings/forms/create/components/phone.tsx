import { useState, useRef } from 'preact/hooks';
import { form, getFormLength } from '../store';
import { CardElement } from './card';

export const FormPhoneViewer = () => {
  const [step, setStep] = useState<number>(0);
  const pagesRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (step < getFormLength.value - 1) {
      const newStep = step + 1;
      setStep(newStep);
      if (pagesRef.current) {
        pagesRef.current.style.transform = `translateX(-${newStep * 100}%)`;
      }
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      if (pagesRef.current) {
        pagesRef.current.style.transform = `translateX(-${newStep * 100}%)`;
      }
    }
  };

  return (
    <div className='absolute flex flex-col mr-2 py-2 items-center right-1 top-2'>
      <div className='absolute z-40 top-5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full' />
      <div className='absolute z-20 bottom-8 flex flex-row bg-white w-80 border-2 justify-between items-center p-1 rounded-xl'>
        <span
          className={`${getFormLength.value > 1 && step !== 0 ? 'visible' : 'invisible'} cursor-pointer px-2 font-bold`}
          onClick={handlePrev}
        >
          Prev
        </span>
        <div className='w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow text-white hover:bg-opacity-60'>
          <span className='cursor-pointer font-bold vx-icon vx-settings size-sm'></span>
        </div>
        <span
          className={`${getFormLength.value > 1 && step !== getFormLength.value - 1 ? 'visible' : 'invisible'} cursor-pointer px-2 font-bold`}
          onClick={handleNext}
        >
          Next
        </span>
      </div>
      <div className='flex flex-col bg-white border shadow-lg rounded-2xl w-[340px] h-[667px] overflow-hidden mx-auto vox-scroll-design px-2 pt-6 padd'>
        <div className='flex flex-col items-center justify-center mb-2 rounded-md py-2'>
          <h3 className='font-bold text-xl'>title</h3>
          <p className='font-thin text-sm text-gray-700'>des</p>
        </div>
        <div className='relative flex h-full w-full overflow-hidden'>
          <div
            ref={pagesRef}
            className='flex transition-transform duration-300 h-full w-full'
          >
            {form.value.map((page) => (
              <div
                key={page.id}
                className='flex-shrink-0 w-full h-full overflow-y-auto pb-20 hide-scrollbar'
              >
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
