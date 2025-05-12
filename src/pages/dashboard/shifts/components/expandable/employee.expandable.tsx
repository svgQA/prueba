import { Chip } from '@/components/common/chip/chip';
import { IPlace, IUser } from '@/types/shift/activity';

const EmployeeInfo = ({
  employee,
  place,
}: {
  employee: IUser;
  place: IPlace;
}) => {
  return (
    <>
      <div className='flex flex-row gap-6'>
        {/* Perfil */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 w-56 flex flex-col items-center shadow-sm'>
          <img
            src={employee.image}
            alt='User'
            className='w-20 h-20 rounded-full mb-2 object-cover'
          />
          <h3 className='text-base font-medium'>
            {employee?.name} {employee?.surname}
          </h3>
          <p>{'Operativo'}</p>
          <Chip label='Activo' color='success' />
        </div>

        {/* Información Personal */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            <span className='mr-2 !text-primary size-sm vox-icon vx-icon-308'></span>
            Información Personal
          </h4>
          <div className='grid grid-cols-2 gap-y-2'>
            <div>
              <p className='font-semibold'>Identificación</p>
              <p>{employee.cardId}</p>
            </div>
            <div>
              <p className='font-semibold'>Teléfono</p>
              <p>{employee.phone}</p>
            </div>
            <div>
              <p className='font-semibold'>Correo</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className='font-semibold'>Ciudad</p>
              <p>{place.municipality.name}</p>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            <span className='!text-primary mr-2 vox-icon size-sm vx-icon-195'></span>
            Información de la empresa
          </h4>
          <div className='grid grid-cols-2 gap-y-2'>
            <div>
              <p className='font-semibold'>Compañía</p>
              <p>{'Acme'}</p>
            </div>
            <div>
              <p className='font-semibold'>Departamento</p>
              <p>{'Operativo'}</p>
            </div>
            <div>
              <p className='font-semibold'>Fecha de Inicio</p>
              <p>{'11/03/2024'}</p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            Estadísticas Turno
          </h4>
          <div className='flex justify-around'>
            <StatCircle title='Actividades' percentage={75} />
            <StatCircle title='Rondas' percentage={75} />
          </div>
        </div>
      </div>
    </>
  );
};

const StatCircle = ({
  title,
  percentage,
}: {
  title: string;
  percentage: number;
}) => {
  return (
    <div className='text-center'>
      <div className='relative w-20 h-20 flex items-center justify-center'>
        <svg className='w-20 h-20' viewBox='0 0 36 36'>
          {/* <path
            className="text-b-light-dark"
            d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
          />
          <path
            className="text-secondary"
            d={`M18 2.0845a15.9155 15.9155 0 0 1 ${(percentage / 100) * 31.83} 26.5`}
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
          /> */}
          <circle
            cx='18'
            cy='18'
            r='16'
            fill='none'
            className='stroke-b-light-dark'
            strokeWidth='2'
          />
          <circle
            cx='18'
            cy='18'
            r='16'
            fill='none'
            className='stroke-secondary'
            strokeWidth='2'
            strokeDasharray='100'
            strokeDashoffset={100 - percentage}
            strokeLinecap='round'
            transform='rotate(-90 18 18)'
          />
        </svg>
        <span className='absolute text-base font-medium'>{percentage}%</span>
      </div>
      <p className='text mt-1'>{title}</p>
    </div>
  );
};

export default EmployeeInfo;
