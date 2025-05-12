import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Memo } from '../../utils/memos';
import { Chip } from '@/components/common/chip/chip';
import { Avatar } from '@/components/common/Avatar';
import dayjs from 'dayjs';

const SupervisorInfo = ({ memo }: { memo: Memo }) => {
  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className='w-full bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm p-3 text-b-dark-light dark:text-b-light-dark'>
      <div className='flex flex-row gap-2 p-3'>
        {/* Sección izquierda - Descripción y botones */}
        <div className='w-[20%]'>
          <p className='mb-2 leading-tight text-lg'>{memo?.description}</p>
          <div className='flex flex-wrap gap-1'>
            <Chip label='Tarea' />
            <Chip label='Tarea' />
            <Chip label='Tarea' />
          </div>
        </div>

        {/* Sección central - Información del supervisor */}
        <div className='w-[15%]'>
          <div className='space-y-2'>
            <div className='flex items-start gap-2'>
              <Avatar name='SV' size='sm' />
              <div>
                <p className='font-medium'>Supervisor</p>
                <p>{memo?.extraData?.company.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='SV' size='sm' />
              <div>
                <p className='font-medium'>Servicio</p>
                <p>{memo?.novelty?.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='AU' size='sm' />
              <div>
                <p className='font-medium'>Actualizado</p>
                <p>{formatDate(new Date(memo.updatedAt || Date.now()))}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='LG' size='sm' />
              <div>
                <p className='font-medium'>Lugar</p>
                <p>{memo?.extraData?.place.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección central - Información del cliente */}
        <div className='w-[15%]'>
          <div className='space-y-2'>
            <div className='flex items-start gap-2'>
              <Avatar name='CL' size='sm' />
              <div>
                <p className='font-medium'>Cliente</p>
                <p>{memo?.extraData?.client.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='CD' size='sm' />
              <div>
                <p className='font-medium'>Ciudad</p>
                <p>{memo?.extraData?.city.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='CP' size='sm' />
              <div>
                <p className='font-medium'>Compañía</p>
                <p>{memo?.extraData?.company?.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Avatar name='DR' size='sm' />
              <div>
                <p className='font-medium'>Dirección</p>
                <p>{memo?.extraData?.place?.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección derecha - Mapa y fotos */}
        <div className='w-[60%]'>
          <div className='flex gap-2 h-full w-full'>
            {/* Mapa a la izquierda */}
            <div className='w-[60%] h-full rounded-lg overflow-hidden'>
              <MapLibrePointsMap
                name='map-points'
                pointsRef={[
                  {
                    id: memo?.id,
                    position: {
                      lat: memo?.extraData?.place?.latitude,
                      lng: memo?.extraData?.place?.longitude,
                    },
                  },
                ]}
                center={{
                  lat: memo?.extraData?.place?.latitude || 0,
                  lng: memo?.extraData?.place?.longitude || 0,
                }}
                sendPoints={() => { }}
                height='100%'
                disablePointSelection={true}
              />
            </div>
            <div className='flex gap-2 flex-wrap'>
              <div className='w-20 h-20 rounded-lg overflow-hidden'>
                <img
                  src={
                    Array.isArray(memo?.resource?.images)
                      ? memo?.resource?.images[0]
                      : memo?.resource?.images
                  }
                  alt='Supervisor'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden bg-b-light dark:bg-b-dark flex items-center justify-center'>
                <span>+</span>
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden bg-b-light dark:bg-b-dark flex items-center justify-center'>
                <span>+</span>
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden bg-b-light dark:bg-b-dark flex items-center justify-center'>
                <span>+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorInfo;
