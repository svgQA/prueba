import { Badge } from '@/components/common/badge/badge';
import { FormattedDate } from '@/components/compose/forms';
import { IPlace, IService, IUser } from '@/types/shift/activity';
import { useTranslation } from 'react-i18next';

const EmployeeInfo = ({
  employee,
  place,
  activityPct,
  roundPct,
  service,
}: {
  employee: IUser;
  place: IPlace;
  activityPct: number;
  roundPct: number;
  service: IService;
}) => {
  const { t } = useTranslation();
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
          <p>{t('operative')}</p>
          <Badge label='active' status='success' outline />
        </div>

        {/* Información Personal */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            <span className='mr-2 !text-primary size-sm vox-icon vx-icon-308'></span>
            {t('h_personal_info')}
          </h4>
          <div className='grid grid-cols-2 gap-y-2'>
            <div>
              <p className='font-semibold'>{t('identification')}</p>
              <p>{employee.cardId}</p>
            </div>
            <div>
              <p className='font-semibold'>{t('h_phone')}</p>
              <p>{employee.phone}</p>
            </div>
            <div>
              <p className='font-semibold'>{t('h_email')}</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className='font-semibold'>{t('h_city')}</p>
              <p>{place.municipality.name}</p>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            <span className='!text-primary mr-2 vox-icon size-sm vx-icon-195'></span>
            {t('l_business_info')}
          </h4>
          <div className='grid grid-cols-2 gap-y-2'>
            <div>
              <p className='font-semibold'>{t('h_company')}</p>
              <p>{service.contract.company?.name}</p>
            </div>
            <div>
              <p className='font-semibold'>{t('h_department')}</p>
              <p>
                {employee.extraData?.area || service.place.municipality.name}
              </p>
            </div>
            <div>
              <p className='font-semibold'>{t('h_date_start')}</p>
              <FormattedDate
                date={service.contract.startDate}
                format='datetime'
              />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='font-semibold mb-3 flex items-center'>
            {t('l_statistics')}
          </h4>
          <div className='flex justify-around'>
            <StatCircle title={t('l_activity')} percentage={activityPct} />
            <StatCircle title={t('h_round')} percentage={roundPct} />
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
