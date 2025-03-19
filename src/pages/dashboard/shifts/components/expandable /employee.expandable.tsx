import { IPlace, IUser } from '@/types/shift/activity';

const EmployeeInfo = ({
  employee,
  place,
}: {
  employee: IUser;
  place: IPlace;
}) => {
  return (
    <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
      <h2 class='text-lg font-semibold mb-4'>Detalles del usuario</h2>
      <div class='grid grid-cols-3 gap-4'>
        {/* Perfil */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <div class='flex flex-col items-center'>
            <img
              src={employee.image}
              alt='User'
              class='w-20 h-20 rounded-full mb-2'
            />
            <h3 class='text-lg font-semibold'>
              {employee?.name} {employee?.surname}
            </h3>
            <p class='text-gray-500'>{'Operativo'}</p>
            <span class='mt-2 px-4 py-1 bg-green-100 text-green-600 rounded-full'>
              {'Activo'}
            </span>
          </div>
        </div>

        {/* Información Personal */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <h4 class='text-blue-600 font-semibold'>Información Personal</h4>
          <p>
            <strong>Identificación:</strong> {employee.cardId}
          </p>
          <p>
            <strong>Teléfono:</strong> {employee.phone}
          </p>
          <p>
            <strong>Correo:</strong> {employee.email}
          </p>
          <p>
            <strong>Ciudad:</strong> {place.municipality.name}
          </p>
        </div>

        {/* Información de la Empresa */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <h4 class='text-blue-600 font-semibold'>Información de la empresa</h4>
          <p>
            <strong>Compañía:</strong> {'Acme'}
          </p>
          <p>
            <strong>Departamento:</strong> {'Operativo'}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {'11/03/2024'}
          </p>
        </div>

        {/* Estadísticas */}
        <div class='bg-white p-4 rounded-lg shadow col-span-3 flex justify-around'>
          <StatCircle title='Actividades' percentage={75} />
          <StatCircle title='Rondas' percentage={75} />
        </div>
      </div>
    </div>
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
    <div class='text-center'>
      <div class='relative w-20 h-20 flex items-center justify-center'>
        <svg class='w-20 h-20' viewBox='0 0 36 36'>
          <path
            class='text-gray-200'
            d='M18 2.0845a15.9155 15.9155 0 1 1 0 31.831'
            fill='none'
            stroke-width='3'
            stroke='currentColor'
          />
          <path
            class='text-green-500'
            d={`M18 2.0845a15.9155 15.9155 0 0 1 ${(percentage / 100) * 31.83} 26.5`}
            fill='none'
            stroke-width='3'
            stroke='currentColor'
            stroke-linecap='round'
          />
        </svg>
        <span class='absolute text-lg font-semibold'>{percentage}%</span>
      </div>
      <p class='text-gray-500'>{title}</p>
    </div>
  );
};

export default EmployeeInfo;
