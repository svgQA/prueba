import { type FunctionComponent } from 'preact';
import { TargetedEvent } from 'preact/compat';
import { useEffect, useState, useRef } from 'preact/hooks';

export const CompanySettingPage: FunctionComponent = () => {
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagenChange = (event: TargetedEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickSubir = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    document.title = 'Company Settings';
  }, []);

  return (
    <div className='container flex flex-row justify-between p-8'>
      <div className='container-input w-1/2  space-y-6 '>
        <form className='space-y-4'>
          <div className='space-y-2'>
            <input
              id='nombre'
              type='text'
              placeholder='Ingrese el nombre'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          <div className='space-y-2'>
            <textarea
              id='descripcion'
              placeholder='Ingrese la descripción'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              rows={4}
            ></textarea>
          </div>

          <div className='space-y-2'>
            <input
              id='nit'
              type='text'
              placeholder='Ingrese el NIT'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
        </form>

        <div className='w-1/2 max-w-md overflow-hidden  rounded-lg shadow-md ml-auto'>
          <div className='relative aspect-video bg-gradient-to-br from-gray-300 to-gray-300 flex items-center justify-center'>
            {imagenPreview ? (
              <img
                src={imagenPreview}
                alt='Vista previa'
                className='w-full h-full object-cover'
              />
            ) : (
              <svg
                className='w-1/3 h-1/3 text-blue-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            )}
            <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center'>
              <button
                onClick={handleClickSubir}
                className='bg-white text-gray-800 font-bold py-2 px-4 rounded-full opacity-0 hover:opacity-100 transition-opacity'
              >
                <svg
                  className='w-5 h-5 mr-2 inline-block'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                  />
                </svg>
                Subir Imagen
              </button>
            </div>
          </div>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            onChange={handleImagenChange}
            accept='image/*'
          />
        </div>
      </div>

      <div className='container-card w-2/5  space-y-6'>
        <div className='bg-blue-500 text-white rounded-lg shadow-md'>
          <div className='p-6 relative'>
            <div className='flex justify-between items-start pb-16'>
              <h2 className='text-2xl font-bold'>ID Company 1</h2>
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z'
                />
              </svg>
            </div>
            <div className='absolute bottom-4 left-6'>
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </div>
            <div className='absolute bottom-4 ml-8 '>
              <p>Main</p>
            </div>
            <div className='absolute bottom-4 right-6 text-sm'>
              <div className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span>20 marzo de 2004</span>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gray-200 rounded-lg shadow-md'>
          <div className='p-6 relative'>
            <div className='flex justify-between items-start pb-16'>
              <h2 className='text-2xl font-bold text-gray-800'>ID Company 2</h2>
              <svg
                className='h-6 w-6 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z'
                />
              </svg>
            </div>
            <div className='absolute bottom-4 left-6'>
              <svg
                className='h-5 w-5 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </div>
            <div className='absolute bottom-4 ml-8'>
              <p>Main</p>
            </div>
            <div className='absolute bottom-4 right-6 text-sm text-gray-600'>
              <div className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <span>20 marzo de 2004</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
