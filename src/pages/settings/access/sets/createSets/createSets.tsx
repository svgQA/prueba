import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export const CreateSetsSettingPage: FunctionComponent = () => {
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
          <h1 className='text-cyan-500 text-lg py-6'>Crear Conjunto</h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <Input type='text' placeholder='Agregar Título' name='name' />
          <TextArea
            id='Description'
            name='name'
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:border-cyan-500 my-4'
            placeholder='Descripción'
          />
          <div>
            <Button
              onClick={handleClickSubir}
              className=' text-gray-500  py-2 px-4 hover:bg-gray-100 transition-opacity focus:border-cyan-500'
              id='setting-create'
              name='setting-create'
              type='button'
              label='Subir Imagen'
              icon='187'
            />
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
              label='Crear Conjunto'
              className='w-48 text-white bg-cyan-500'
            />
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};
