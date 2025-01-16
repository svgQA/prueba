import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';

export const SetsSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Sets Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex justify-between items-center w-full mb-4 ml-6'>
          <button className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'>
            Crear Conjuntos
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='p-4'>
          <CardAccess
            title='Conjuntos 1'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Conjuntos 2'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Conjuntos 3'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>
        <div className='p-4'>
          <CardAccess
            title='Conjuntos 4'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Conjuntos 5'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl=''
            icon='123'
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Conjuntos 6'
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
