import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { useLocation } from 'wouter';
import infoImage from '../../../../assets/image/informe.jpg';

export const InformationSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = 'Information Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  return (
    <Section>
      <div className='flex flex-col gap-1 w-10/12'>
        <div className='flex justify-between items-center w-full mb-4 ml-6'>
          <Button
            onClick={() => navigate('/access/createInformation')}
            id='setting-info'
            name='setting-info'
            type='button'
            label='Crear Informe'
            className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='p-4'>
          <CardAccess
            title='Informe 1'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            icon='123'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Informe 2'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
            icon='123'
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Informe 3'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            icon='123'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
          />
        </div>
        <div className='p-4'>
          <CardAccess
            title='Informe 4'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            icon='123'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Informe 5'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            icon='123'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
          />
        </div>

        <div className='p-4'>
          <CardAccess
            title='Informe 6'
            subtitle='Lorem Ipsum Es Simplemente El Texto De Relleno De Las Imprentas Y Archivos De Texto. Lorem Ipsum.'
            icon='123'
            imageUrl={infoImage}
            onEdit={() => console.log('Edit clicked')}
          />
        </div>
      </div>
    </Section>
  );
};
