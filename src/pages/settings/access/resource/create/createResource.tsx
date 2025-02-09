import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export const CreateResourceSettingPage: FunctionComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickSubir = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
    }
  };

  useEffect(() => {}, []);

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          <h1 className='text-cyan-500 text-lg py-6'>Crear Recurso</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <Input type='text' placeholder='Agregar Título' name='name' />

          <textarea
            id='message'
            rows={6}
            class='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:border-cyan-500 my-4'
            placeholder='Descripción'
          ></textarea>

          <div>
            <button
              onClick={handleClickSubir}
              className=' text-gray-800  py-2 px-4 hover:bg-gray-100 transition-opacity focus:border-cyan-500'
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
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleFileChange}
              accept='image/*'
            />
          </div>

          <div className='flex justify-end my-4'>
            <Button
              id='setting-close'
              name='setting-close'
              type='button'
              label='Cancelar'
              className='w-48 border-none hover:underline'
            />
            <Button
              id='setting-create'
              name='setting-create'
              type='button'
              label='Crear Recurso'
              className='w-48 text-white bg-cyan-500'
            />
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};
