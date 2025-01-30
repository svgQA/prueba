import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { useLocation } from 'wouter';
import resoursesImage from '../../../../assets/image/recursos.jpg';

export const ResourceSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();

  //vvv
  const handleEdit = (title: string, subtitle: string, imageUrl: string) => {
    navigate(
      `/access/createResource?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&imageUrl=${encodeURIComponent(imageUrl)}`
    );
  };

  useEffect(() => {
    document.title = 'Resources Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex justify-between items-center w-full mb-4 ml-6'>
          <button
            onClick={() => navigate('/access/createResource')}
            className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
          >
            Crear Recurso
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='p-4'>
          <CardAccess
            title='Recurso 1'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 2'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 3'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>
        <div className='p-4'>
          <CardAccess
            title='Recurso 4'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 5'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 6'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={resoursesImage}
            icon='123'
            onEdit={() =>
              handleEdit('Recurso 1', 'Lorem Ipsum Es Simplemente...', '')
            } //vvv
          />
        </div>
      </div>
    </Section>
  );
};
