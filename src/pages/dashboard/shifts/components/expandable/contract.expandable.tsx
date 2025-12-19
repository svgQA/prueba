import { IContract } from '@/types/shift/activity';
import { useEffect } from 'react';
import { ContractService } from '@/services';
import { useSignal } from '@preact/signals';
import { IProjectMetricsResponse } from '@/types/contract/contract.response';
import { Badge } from '@/components/common/badge/badge';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './header';
import { FieldInline } from './inline';
import { MetricTile } from './tile';
import { formatDate } from '@/utils/utilities/dates';
import { TextEllipsis } from '@/components/common/text-ellipsis';

const priorityBadgeStatus = (priority?: string) => {
  const p = (priority || '').toUpperCase();
  if (p === 'HIGH') return 'warning';
  if (p === 'MEDIUM') return 'info';
  return 'success';
};

const ContractInfo = ({ contract }: { contract: IContract }) => {
  const { t } = useTranslation();

  const loading = useSignal(false);
  const metrics = useSignal<IProjectMetricsResponse>({
    completedShifts: 0,
    completionPercentage: 0,
    totalHours: 0,
    totalShifts: 0,
  });

  const getMetrics = async () => {
    loading.value = true;
    try {
      const response = await ContractService.getProjectMetrics(contract.id);
      if (!response.getStatus()) return;
      metrics.value = response.getOne();
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    getMetrics();
  }, []);

  const start = formatDate(contract.startDate);
  const end = formatDate(contract.endDate);

  return (
    <div className='w-full'>
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-xl border border-b-light dark:border-b-dark-light shadow-sm'>
        <div className='p-4'>
          <div className='grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch'>
            <div className='xl:col-span-5'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <SectionHeader
                  icon='195'
                  title={t('h_contract')}
                  center={
                    <TextEllipsis
                      text={contract.name}
                      maxWidth='200px'
                    ></TextEllipsis>
                  }
                  right={
                    <Badge
                      label={contract.priority}
                      status={priorityBadgeStatus(contract.priority) as any}
                      outline
                    />
                  }
                />

                <div className='pt-3 space-y-3'>
                  <div className='rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                    <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark'>
                      {t('h_client')}
                    </div>
                    <div className='mt-1 flex items-center gap-2 min-w-0'>
                      <span className='vox-icon vx-icon-308 !text-primary !text-sm shrink-0' />
                      <span className='text-xs text-gray-800 dark:text-gray-100 truncate'>
                        {contract.client?.name} {contract.client?.surname}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                  <div className='text-xs font-semibold text-gray-800 dark:text-gray-100 mb-2'>
                    {t('h_dates')}
                  </div>
                  <div className='grid grid-cols-1 gap-2'>
                    <FieldInline
                      label='h_date_start'
                      value={start}
                      icon='195'
                    />
                    <FieldInline label='h_date_end' value={end} icon='195' />
                  </div>
                </div>
              </div>
            </div>

            <div className='xl:col-span-7'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <SectionHeader
                  icon='341'
                  title={t('h_status')}
                  right={<Badge label={contract.state} status='info' outline />}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <MetricTile
                    label='l_completed'
                    value={metrics.value.completedShifts}
                    icon='308'
                    tone='secondary'
                    unit='und'
                    loading={loading.value}
                  />
                  <MetricTile
                    label='l_total_hours'
                    value={metrics.value.totalHours}
                    icon='308'
                    unit='h'
                    tone='primary'
                    loading={loading.value}
                  />
                  <MetricTile
                    label='l_total_shifts'
                    value={metrics.value.totalShifts}
                    icon='308'
                    unit='und'
                    tone='error'
                    loading={loading.value}
                  />
                  <MetricTile
                    label='l_completation'
                    value={metrics?.value?.completionPercentage}
                    unit='%'
                    icon='308'
                    tone='secondary'
                    loading={loading.value}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
