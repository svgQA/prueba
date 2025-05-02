import { Chip } from '@/components/common/chip/chip';

const RoundInfo = ({}: any) => {
  return (
    <div className='bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm p-4 w-full text-t-light dark:text-t-dark'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-medium'>Rondas del Turno</h2>
        <Chip label={`Progreso: 75%`} color='primary' />
      </div>

      <div className='space-y-6'>
        {/* Punto 1 */}
        <div className='flex items-center justify-between'>
          {/* Icono y nombre */}
          <div className='w-32 flex items-center'>
            <span className='vox-icon vx-icon-324 !text-secondary mr-2'></span>
            <p className=''>Punto 1</p>
          </div>

          {/* Información de escaneo */}
          <div className='flex-1'>
            <div className='flex items-center'>
              <span className='vox-icon vx-icon-325 mr-1'></span>
              <span>Escaneo: 11/04/2024 19:30</span>
            </div>
          </div>

          {/* Distancia */}
          <div className='w-40 flex items-center'>
            <span className='vox-icon vx-icon-329 !text-primary mr-1'></span>
            <span className='text-xs'>Distancia: 9 metros</span>
          </div>

          {/* Formulario */}
          <div className='w-40 text-right'>
            <a
              href='#'
              className='flex items-center justify-end text-primary text-sm'
            >
              <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
              FORMULARIO 1
              <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
            </a>
          </div>
        </div>

        {/* Punto 3 */}
        <div className='flex items-center justify-between'>
          {/* Icono y nombre */}
          <div className='w-32 flex items-center'>
            <span className='vox-icon vx-icon-323 !text-error mr-2'></span>
            <p className=''>Punto3</p>
          </div>

          {/* Información de escaneo */}
          <div className='flex-1'>
            <div className='flex items-center'>
              <span className='vox-icon vx-icon-325 mr-1'></span>
              <span>Escaneo: 11/04/2024 18:30</span>
            </div>
          </div>

          {/* Distancia */}
          <div className='w-40 flex items-center'>
            <span className='vox-icon size-sm vx-icon-329 !text-primary mr-1'></span>
            <span className='text-xs'>Distancia: 30 metros</span>
          </div>

          {/* Formulario */}
          <div className='w-40 text-right'>
            <a
              href='#'
              className='flex items-center justify-end text-primary text-sm'
            >
              <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
              ...
              <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
            </a>
          </div>
        </div>

        {/* Punto 2 */}
        <div className='flex items-center justify-between'>
          {/* Icono y nombre */}
          <div className='w-32 flex items-center'>
            <span className='vox-icon vx-icon-324 !text-secondary mr-2'></span>
            <p className=''>Punto 2</p>
          </div>

          {/* Información de escaneo */}
          <div className='flex-1'>
            <div className='flex items-center'>
              <span className='vox-icon vx-icon-325 mr-1'></span>
              <span>Escaneo: 11/04/2024 18:00</span>
            </div>
          </div>

          {/* Distancia */}
          <div className='w-40 flex items-center'>
            <span className='vox-icon size-sm vx-icon-329 !text-primary mr-1'></span>
            <span className='text-xs'>Distancia: 9 metros</span>
          </div>

          {/* Formulario */}
          <div className='w-40 text-right'>
            <a
              href='#'
              className='flex items-center justify-end text-primary text-sm'
            >
              <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
              FORMULARIO 3
              <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundInfo;
