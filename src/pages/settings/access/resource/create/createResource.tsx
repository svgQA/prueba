import { Button } from '@/components/common/button/button';
import { TextArea } from '@/components/common/text.area/text.area';
import { Input } from '@/components/common/input/input';
import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useResourceStore } from '@/store/slices/optimusAccess/access.slice'; // Importamos el store

export const CreateResourceSettingPage: FunctionComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedResource, clearSelectedResource } = useResourceStore(); // Usamos el estado global
  const handleClickSubir = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
    }
  };

  // Estados locales para los inputs
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    // Si hay un recurso seleccionado, llenamos los inputs
    if (selectedResource) {
      setTitle(selectedResource.title);
      setSubtitle(selectedResource.subtitle);
    }
  }, [selectedResource]);

  return (
    <section className='flex flex-row'>
      <div className='w-full'>
        <div>
          {/* <h1 className='text-cyan-500 text-lg py-6'>Crear Recurso</h1> */}
          <h1 className='text-cyan-500 text-lg py-6'>
            {selectedResource ? 'Editar Recurso' : 'Crear Recurso'}
          </h1>
        </div>
        <div className='flex flex-col gap-1 w-10/12'>
          <Input
            type='text'
            placeholder='Agregar Título'
            name='name'
            value={title}
            onChange={(e: any) =>
              setTitle((e.target as HTMLInputElement).value)
            }
          />
          <TextArea
            id='Description'
            name='name'
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:border-cyan-500 my-4'
            placeholder='Descripción'
            value={subtitle}
            onChange={(e: any) =>
              setSubtitle((e.target as HTMLTextAreaElement).value)
            }
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
              onClick={clearSelectedResource} // Limpiamos el estado si cancelamos
            />
            <Button
              id='setting-create'
              name='setting-create'
              type='button'
              // label='Crear Recurso'
              label={selectedResource ? 'Guardar Cambios' : 'Crear Recurso'}
              className='w-48 text-white bg-cyan-500'
            />
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};
