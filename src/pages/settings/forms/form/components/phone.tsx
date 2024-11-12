import { useRef, useEffect } from 'preact/hooks';
import { format, getPhonePage, setPhonePage } from '../store';
import { CardElement } from './card';

export const FormPhoneViewer = () => {
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pagesRef.current) {
      pagesRef.current.style.transform = `translateX(-${getPhonePage.value * 100}%)`;
    }
  }, [getPhonePage.value]);

  const setPage = (event: MouseEvent) => {
    const index = (event.target as HTMLElement).getAttribute('data-index');
    if (!index) return;
    setPhonePage(Number(index));
  };

  return (
    <div className='absolute flex flex-col mx-3 my-3 items-center right-1 top-2'>
      <div className='absolute z-40 top-5 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full bg-b-dark-light' />
      <div className='relative border-b-dark-light border-2 flex flex-col shadow-lg bg-b-dark rounded-2xl w-[340px] h-[667px] px-2 pt-10 pb-4'>
        <div className='bg-b-light h-full rounded-xl overflow-hidden vox-scroll-design text-t-light px-4 flex flex-col'>
          <div className='flex flex-col items-center justify-center rounded-md py-2'>
            <h3 className='font-bold text-xl'>
              {format.value.label ? format.value.label : 'Form Title'}
            </h3>
            <p className='font-thin text-sm'>
              {format.value.description
                ? format.value.description
                : 'Form Description'}
            </p>
          </div>
          <div className='flex flex-col h-full w-full overflow-hidden'>
            <div
              ref={pagesRef}
              className='flex transition-transform duration-300 h-full w-full'
            >
              {format.value.pages.map((page) => (
                <div
                  key={page.id}
                  className='flex-shrink-0 w-full h-full overflow-y-auto hide-scrollbar'
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
          <div className='mt-auto justify-center flex flex-row py-2 h-10 items-center'>
            {format.value.pages.map((page, index) => (
              <div key={`page-button-${page.id}`} className='mx-3 bg-red-100'>
                <span
                  className={`${getPhonePage.value === index ? 'bg-primary' : 'bg-b-light-dark'} w-3 h-3 rounded-full block cursor-pointer`}
                  data-index={index}
                  onClick={setPage}
                ></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
