import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { useLocation } from 'wouter';
import { useResourceStore } from '@/store/slices/optimusAccess/access.slice'; // Importamos el store
import data from './data.json';

export const InformationSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const { setSelectedResource } = useResourceStore(); // Usamos el estado global

  useEffect(() => {
    document.title = 'Information Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  const handleEdit = (title: string, subtitle: string, imageUrl: string) => {
    setSelectedResource({ title, subtitle, imageUrl }); // Guardamos en el estado global
    navigate('/access/createResource'); // Redirigimos a la página de edición
  };

  const onClickCreate = () => {
    handleEdit('', '', '');
    navigate('/access/createResource');
  };

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex justify-between items-center w-full mb-4 ml-6'>
          <Button
            onClick={onClickCreate}
            id='setting-sets'
            name='setting-sets'
            type='button'
            label='Crear Informe'
            className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        {data.map((data) => (
          <CardAccess
            title={data.title}
            subtitle={data.subtitle}
            icon='123'
            imageUrl={data.image}
            onEdit={() => handleEdit(data.title, data.subtitle, data.image)} //vvv
          />
        ))}
      </div>
    </Section>
  );
};
