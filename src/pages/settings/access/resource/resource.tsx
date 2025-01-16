import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';

export const ResourceSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Resources Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex justify-between items-center w-full mb-4 ml-6'>
          <button className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'>
            Crear Recurso
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='p-4'>
          <CardAccess
            title='Recurso 1'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 2'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 3'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>
        <div className='p-4'>
          <CardAccess
            title='Recurso 4'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 5'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Recurso 6'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>
      </div>
    </Section>
  );
};
