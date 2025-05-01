import { Button } from '@/components/common/button/button';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Memo } from '../../utils/memos';

const SupervisorInfo = ({ memo }: { memo: Memo }) => {
  return (
    <div className='w-full bg-white rounded-lg shadow-sm p-3'>
      <div className='flex flex-row gap-2'>
        {/* Sección izquierda - Descripción y botones */}
        <div className='w-[20%]'>
          <p className='text-xs text-gray-600 mb-2 leading-tight'>
            {memo?.description}
          </p>
          <div className='flex flex-wrap gap-1'>
            <Button
              name='button'
              label='Tarea'
              className='bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 rounded-full'
              padding='px-2 py-0.5'
              text='text-xs'
            />
            <Button
              name='button'
              label='Tarea'
              className='bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 rounded-full'
              padding='px-2 py-0.5'
              text='text-xs'
            />
            <Button
              name='button'
              label='Tarea'
              className='bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 rounded-full'
              padding='px-2 py-0.5'
              text='text-xs'
            />
          </div>
        </div>

        {/* Sección central - Información del supervisor */}
        <div className='w-[15%]'>
          <div className='space-y-2'>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  SV
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Supervisor</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.company.name}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  SR
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Servicio</p>
                <p className='text-gray-600 text-xs'>{memo?.novelty?.name}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  AU
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Actualizado</p>
                <p className='text-gray-600 text-xs'>{memo?.updatedAt}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  LG
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Lugar</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.place.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección central - Información del cliente */}
        <div className='w-[15%]'>
          <div className='space-y-2'>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  CL
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Cliente</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.client.name}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  CD
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Ciudad</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.city.name}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  CP
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Compañía</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.company?.name}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                <span className='text-[10px] font-medium text-gray-500'>
                  DR
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-xs'>Dirección</p>
                <p className='text-gray-600 text-xs'>
                  {memo?.extraData?.place?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección derecha - Mapa y fotos */}
        <div className='w-[40%]'>
          <div className='flex gap-2 h-full'>
            {/* Mapa a la izquierda */}
            <div className='w-[60%] h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
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
                sendPoints={() => {}}
                height='100%'
                disablePointSelection={true}
              />
            </div>

            <div className='w-[45%] flex items-center justify-center gap-2 ml-2'>
              <div className='w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
                <img
                  src={memo?.resource?.images}
                  alt='Supervisor'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center'>
                <span className='text-xs text-gray-400'>+</span>
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center'>
                <span className='text-xs text-gray-400'>+</span>
              </div>
              <div className='w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center'>
                <span className='text-xs text-gray-400'>+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorInfo;
