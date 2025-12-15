import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/badge/badge';
import { Gauge } from '@/components/common/gauge/gauge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';
import { IPlace, IService, IUser } from '@/types/shift/activity';
import { useTranslation } from 'react-i18next';
import { FieldInline } from './inline';

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

  const fullName = `${employee?.name || ''} ${employee?.surname || ''}`.trim();
  const companyName = service?.contract?.company?.name || '-';
  const department =
    employee?.extraData?.area || service?.place?.municipality?.name || '-';
  const city = place?.municipality?.name || '-';

  return (
    <div className='w-full'>
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-xl border border-b-light dark:border-b-dark-light shadow-sm'>
        <div>
          <div className='grid grid-cols-1 xl:grid-cols-10 gap-4 items-stretch'>
            {/* Perfil */}
            <div className='xl:col-span-2'>
              <div className='flex flex-col items-center justify-center bg-white/60 dark:bg-b-dark-dark/30 h-full gap-2 p-3'>
                <Avatar name={employee?.name} src={employee?.image} size='lg' />
                <TextEllipsis
                  text={fullName || '-'}
                  className='text-sm font-semibold text-gray-800 dark:text-gray-100'
                />
                <Badge label='active' status='success' outline />
              </div>
            </div>

            {/* Datos */}
            <div className='xl:col-span-6'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 h-full'>
                  <div>
                    <div className='flex items-center gap-2 pb-2 border-b border-b-light dark:border-b-dark-light'>
                      <span className='vox-icon vx-icon-308 !text-primary !text-sm' />
                      <span className='text-xs font-semibold text-gray-800 dark:text-gray-100'>
                        {t('h_personal_info')}
                      </span>
                    </div>

                    <div className='pt-2 grid grid-cols-1 gap-2'>
                      <FieldInline
                        label={t('identification')}
                        value={employee?.cardId}
                      />
                      <FieldInline label={t('h_city')} value={city} />
                      <FieldInline
                        label={t('h_email')}
                        value={employee?.email}
                      />
                      <FieldInline
                        label={t('h_phone')}
                        value={employee?.phone}
                      />
                    </div>
                  </div>

                  <div className='md:border-l md:border-b-light md:dark:border-b-dark-light md:pl-3'>
                    <div className='flex items-center gap-2 pb-2 border-b border-b-light dark:border-b-dark-light'>
                      <span className='vox-icon vx-icon-023 !text-primary !text-sm' />
                      <span className='text-xs font-semibold text-gray-800 dark:text-gray-100'>
                        {t('l_business_info')}
                      </span>
                    </div>

                    <div className='pt-2 grid grid-cols-1 gap-2'>
                      <FieldInline label={t('h_company')} value={companyName} />
                      <FieldInline
                        label={t('h_department')}
                        value={department}
                      />
                      <div className='flex items-center justify-between gap-3 min-w-0'>
                        <span className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark whitespace-nowrap'>
                          {t('h_date_start')}
                        </span>
                        <span className='text-xs text-gray-800 dark:text-gray-100 truncate'>
                          <FormattedDate
                            date={service?.contract?.startDate}
                            format='datetime'
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats horizontales */}
            <div className='xl:col-span-2'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <div className='flex items-center gap-2 pb-2 border-b border-b-light dark:border-b-dark-light'>
                  <span className='vox-icon vx-icon-112 !text-primary !text-sm' />
                  <span className='text-xs font-semibold text-gray-800 dark:text-gray-100'>
                    {t('l_statistics')}
                  </span>
                </div>

                <div className='pt-3 grid grid-cols-2 gap-3 items-center'>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark text-center'>
                      {t('h_activity')}
                    </div>
                    <div className='shrink-0'>
                      <Gauge
                        gauges={[{ progress: activityPct, color: 'teal' }]}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col items-center gap-2'>
                    <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark text-center'>
                      {t('h_round')}
                    </div>
                    <div className='shrink-0'>
                      <Gauge gauges={[{ progress: roundPct, color: 'teal' }]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
