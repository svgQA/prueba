import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { useLocation } from 'wouter';
import { useResourceStore } from '@/store/slices/optimusAccess/access.slice'; // Importamos el store
import { useSignal } from '@preact/signals';
import { IResource } from './type';
import { GeneralService } from '@/services';

export const ResourceSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const resources = useSignal<IResource[]>([]);

  const { setSelectedResource } = useResourceStore(); // Usamos el estado global

  useEffect(() => {
    document.title = 'Resources Settings';
    getResources();
  }, []);

  const getResources = async () => {
    const response = await GeneralService.resource();
    if (!response.getStatus()) return;
    resources.value = response.getMany();
  };

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
      <div className='py-2 flex flex-row justify-between items-center overflow-visible z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-resource'
            label='Crear Recursos'
            icon='345'
            onClick={onClickCreate}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        {resources.value.map((data) => (
          <CardAccess
            title={data.name}
            subtitle={data.description}
            icon='123'
            imageUrl={data.image}
            type={data.type}
            link={data.link}
            onEdit={() => handleEdit(data.name, data.description, data.image)} //vvv
          />
        ))}
      </div>
    </Section>
  );
};
