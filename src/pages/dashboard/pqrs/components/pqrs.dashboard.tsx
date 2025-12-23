import { Badge } from '@/components/common/badge/badge';
// Importamos el hook de traducción
import { useTranslation } from 'react-i18next';

const DashboardPreview = () => {
  const { t } = useTranslation();

  const SkeletonBlock = ({ className = '' }: { className?: string }) => (
    <div
      class={`animate-pulse bg-gray-100 dark:bg-b-dark-light rounded ${className}`}
    />
  );

  return (
    <div class='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
      <div class='xl:col-span-2 space-y-6'>
        <div class='bg-white rounded-xl p-6 shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between flex-wrap gap-4'>
            <div>
              <p class='text-xs uppercase tracking-wide'>
                {t('pqrs.dashboard.operational_summary')}
              </p>
              <h2 class='text-xl font-semibold'>
                {t('pqrs.dashboard.attention_dashboard')}
              </h2>
              <p class='text-sm mt-1 max-w-xl'>
                {t('pqrs.dashboard.attention_desc')}
              </p>
            </div>
            <div class='flex items-center gap-2 bg-b-light dark:bg-b-dark rounded-full px-4 py-2 text-xs'>
              <span class='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
              {t('pqrs.dashboard.design_preview')}
            </div>
          </div>

          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {[
              {
                title: t('pqrs.dashboard.cards.monthly_attention'),
                helper: t('pqrs.dashboard.cards.monthly_attention_help'),
              },
              {
                title: t('pqrs.dashboard.cards.ai_resolved'),
                helper: t('pqrs.dashboard.cards.ai_resolved_help'),
              },
              {
                title: t('pqrs.dashboard.cards.high_priority'),
                helper: t('pqrs.dashboard.cards.high_priority_help'),
              },
              {
                title: t('pqrs.dashboard.cards.top_area'),
                helper: t('pqrs.dashboard.cards.top_area_help'),
              },
              {
                title: t('pqrs.dashboard.cards.avg_sla'),
                helper: t('pqrs.dashboard.cards.avg_sla_help'),
              },
              {
                title: t('pqrs.dashboard.cards.satisfaction'),
                helper: t('pqrs.dashboard.cards.satisfaction_help'),
              },
            ].map((card, idx) => (
              <div
                key={`${card.title}-${idx}`}
                class='p-4 rounded-lg transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:bg-b-dark bg-b-light'
              >
                <div class='flex items-start justify-between gap-3'>
                  <div>
                    <p class='text-xs uppercase tracking-wide'>{card.title}</p>
                    <p class='text-[13px] mt-1 leading-snug'>{card.helper}</p>
                  </div>
                  <span class='px-2 py-1 text-[11px] rounded-full bg-primary text-white border border-primary/30'>
                    Placeholder
                  </span>
                </div>
                <div class='mt-4 space-y-2'>
                  <SkeletonBlock className='h-6 w-24' />
                  <SkeletonBlock className='h-3 w-20' />
                  <SkeletonBlock className='h-2 w-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
            <div class='flex items-start justify-between gap-2'>
              <div>
                <p class='text-xs uppercase tracking-wide'>
                  {t('pqrs.dashboard.suggested_chart')}
                </p>
                <h3 class='text-lg font-semibold'>
                  {t('pqrs.dashboard.status_priority_dist')}
                </h3>
                <p class='text-sm'>
                  {t('pqrs.dashboard.status_priority_desc')}
                </p>
              </div>
              <Badge
                label={t('pqrs.dashboard.chart')}
                status='info'
                outline
                size='xs'
                width='w-fit'
              />
            </div>

            <div class='mt-4 h-52 rounded-lg bg-b-light flex items-center justify-center dark:bg-b-dark'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-1/2' />
                <SkeletonBlock className='h-4 w-2/3' />
                <SkeletonBlock className='h-24 w-full' />
              </div>
            </div>
          </div>

          <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
            <div class='flex items-start justify-between gap-2 '>
              <div>
                <p class='text-xs uppercase tracking-wide'>
                  {t('pqrs.dashboard.weekly_trend')}
                </p>
                <h3 class='text-lg font-semibold'>
                  {t('pqrs.dashboard.response_time_cases')}
                </h3>
                <p class='text-sm'>
                  {t('pqrs.dashboard.response_time_desc')}
                </p>
              </div>
              <Badge
                label={t('pqrs.dashboard.line')}
                status='success'
                outline
                size='xs'
                width='w-fit'
              />
            </div>

            <div class='mt-4 h-52 rounded-lg dark:bg-b-dark bg-b-light flex items-center justify-center'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-2/5' />
                <SkeletonBlock className='h-28 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='space-y-6'>
        <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs uppercase tracking-wide'>
                {t('pqrs.dashboard.rec_tables')}
              </p>
              <h3 class='text-lg font-semibold'>
                {t('pqrs.dashboard.cases_by_agent')}
              </h3>
              <p class='text-sm'>
                {t('pqrs.dashboard.cases_by_agent_desc')}
              </p>
            </div>
            <Badge
              label={t('pqrs.dashboard.table')}
              status='warning'
              outline
              size='xs'
              width='w-fit'
            />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(5)].map((_, idx) => (
              <div
                key={`row-${idx}`}
                class='flex items-center justify-between gap-3 p-3 rounded-lg dark:bg-b-dark bg-b-light'
              >
                <div class='flex items-center gap-3'>
                  <SkeletonBlock className='h-10 w-10 rounded-full' />
                  <div class='space-y-1'>
                    <SkeletonBlock className='h-3 w-32' />
                    <SkeletonBlock className='h-2 w-24' />
                  </div>
                </div>
                <div class='flex items-center gap-2'>
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                  <SkeletonBlock className='h-3 w-14 rounded-full' />
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='p-6 bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs uppercase tracking-wide'>
                {t('pqrs.dashboard.key_alerts')}
              </p>
              <h3 class='text-lg font-semibold'>
                {t('pqrs.dashboard.expiring_cases')}
              </h3>
              <p class='text-sm'>
                {t('pqrs.dashboard.expiring_cases_desc')}
              </p>
            </div>
            <Badge
              label={t('pqrs.dashboard.reminders')}
              status='error'
              outline
              size='xs'
              width='w-fit'
            />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(3)].map((_, idx) => (
              <div
                key={`alert-${idx}`}
                class='p-3 rounded-lg dark:bg-b-dark bg-b-light text-error'
              >
                <div class='flex items-center justify-between'>
                  <SkeletonBlock className='h-3 w-40 bg-error/30' />
                  <SkeletonBlock className='h-3 w-12 bg-error/30' />
                </div>
                <SkeletonBlock className='h-2 w-full mt-2 bg-error/20' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;