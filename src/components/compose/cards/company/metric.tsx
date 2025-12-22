import { BalanceIndicator } from '@/components/common/balance/balance';
import { SimpleGauge } from '@/components/common/gauge/simple';
import { FunctionalComponent } from 'preact';
import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

type ToneMetric = 'neutral' | 'success' | 'warning' | 'danger';
type ActionMetric =
  | 'user-active'
  | 'shift-active'
  | 'shift-expected'
  | 'shift-started'
  | 'shift-ended';

type MetricIndicator = {
  label: string;
  value: number | string;
  unit?: string;
  icon?: string;
  tone?: ToneMetric;
  action?: ActionMetric;
  hide?: boolean;
};

type CardProps = {
  title: string;
  subtitle?: string;
  values: number[];
  unit?: string;
  icon?: string;
  indicator?: 'gauge' | 'balance' | 'button';
  color?: 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  indicators?: MetricIndicator[];
  className?: string;
};

const toneClass: Record<NonNullable<MetricIndicator['tone']>, string> = {
  neutral:
    'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-200',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
};

const palette = {
  sky: {
    ring: 'ring-sky-200/60 dark:ring-sky-400/10',
    iconBg: 'bg-sky-100 dark:bg-sky-900/40',
    iconText: '!text-sky-600 dark:!text-sky-300',
    valueBg: 'bg-sky-50 dark:bg-sky-950/30',
  },
  emerald: {
    ring: 'ring-emerald-200/60 dark:ring-emerald-400/10',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconText: '!text-emerald-600 dark:!text-emerald-300',
    valueBg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  amber: {
    ring: 'ring-amber-200/60 dark:ring-amber-400/10',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconText: '!text-amber-700 dark:!text-amber-300',
    valueBg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  rose: {
    ring: 'ring-rose-200/60 dark:ring-rose-400/10',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconText: '!text-rose-600 dark:!text-rose-300',
    valueBg: 'bg-rose-50 dark:bg-rose-950/30',
  },
  violet: {
    ring: 'ring-violet-200/60 dark:ring-violet-400/10',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconText: '!text-violet-600 dark:!text-violet-300',
    valueBg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  slate: {
    ring: 'ring-slate-200/60 dark:ring-slate-400/10',
    iconBg: 'bg-slate-100 dark:bg-slate-900/40',
    iconText: '!text-slate-700 dark:!text-slate-200',
    valueBg: 'bg-slate-50 dark:bg-slate-950/30',
  },
} as const;

const SimpleCard: FunctionalComponent<{
  label: string;
  tone: ToneMetric;
  icon?: string;
  unit?: string;
  value: number;
  action?: ActionMetric;
}> = ({ label, tone, icon, unit, value, action }) => {
  const { t } = useTranslation();
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-lg px-3 py-2',
        'ring-1 ring-black/5 dark:ring-white/10',
        toneClass[tone],
        `${action ? 'cursor-pointer hover:shadow-xl hover:opacity-80' : ''}`,
      ].join(' ')}
      data-action={action}
    >
      {icon ? (
        <span
          className={[
            `vox-icon vx-icon-${icon}`,
            'w-5 h-5 flex items-center justify-center opacity-90',
          ].join(' ')}
          aria-hidden='true'
        />
      ) : (
        <span className='w-5 h-5' aria-hidden='true' />
      )}
      <div className='min-w-0 flex-1'>
        <div className='text-xs font-medium truncate opacity-90'>
          {t(label)}
        </div>
        <div className='flex items-baseline gap-1'>
          <span className='text-sm font-semibold'>{value}</span>
          {unit && (
            <span className='text-xs font-semibold opacity-80'>{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const MetricCard: FunctionalComponent<CardProps> = memo(
  ({
    title,
    subtitle,
    values,
    unit,
    icon = '071',
    color = 'sky',
    indicator,
    indicators = [],
    className,
  }) => {
    const { t } = useTranslation();
    const theme = palette[color];

    const mainValue: number | string = values?.[0] ?? 0;
    const availableIndicatorCount = Math.min(
      indicators.length,
      Math.max(0, (values?.length ?? 0) - 1)
    );

    const mappedIndicators = indicators
      .slice(0, availableIndicatorCount)
      .map((ind, idx) => ({
        ...ind,
        value: values[idx + 1],
      }));

    const topIndicators = mappedIndicators.slice(0, 3);

    return (
      <div
        className={[
          'w-full px-4 py-2 flex flex-col justify-between rounded-lg relative',
          'ring-1',
          theme.ring,
          className,
        ].join(' ')}
      >
        {indicator !== 'button' && (
          <div className='flex items-start gap-x-2'>
            <div
              className={[
                'shrink-0 rounded-xl w-12 h-12 flex items-center justify-center',
                theme.iconBg,
              ].join(' ')}
              aria-hidden='true'
            >
              <span
                className={[
                  `vox-icon vx-icon-${icon}`,
                  'w-7 h-7 flex items-center justify-center',
                  theme.iconText,
                ].join(' ')}
              />
            </div>

            <div className='min-w-0 flex-1'>
              <h3 className='text-base font-semibold truncate'>{t(title)}</h3>
              {subtitle && (
                <p className='mt-0.5 text-sm text-t-light-dark dark:text-t-dark-light truncate'>
                  {t(subtitle)}
                </p>
              )}
            </div>

            {indicator === 'balance' && (
              <>
                {topIndicators.map((m, idx) => {
                  if (m.hide) return;
                  const tone = m.tone ?? 'neutral';
                  return (
                    <SimpleCard
                      key={`${m.label}-${idx}`}
                      tone={tone}
                      label={m.label}
                      value={m.value}
                      icon={m.icon}
                      unit={m.unit}
                      action={m.action}
                    />
                  );
                })}
              </>
            )}

            {!indicator && (
              <div
                className={[
                  'shrink-0 rounded-xl px-3 py-2',
                  'text-right',
                  theme.valueBg,
                ].join(' ')}
              >
                <div className='flex items-baseline gap-1 justify-end'>
                  <span className='text-2xl font-bold tracking-tight'>
                    {mainValue}
                  </span>
                  {unit && (
                    <span className='text-sm font-semibold opacity-80'>
                      {unit}
                    </span>
                  )}
                </div>
              </div>
            )}

            {indicator === 'gauge' && (
              <SimpleGauge progress={mainValue} color='red' size={14} />
            )}
          </div>
        )}

        <div
          className={
            indicator === 'button'
              ? 'flex flex-col h-full justify-evenly'
              : 'grid gap-2 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] mt-2 justify-center pb-2'
          }
        >
          {indicator === 'balance' && (
            <BalanceIndicator
              value={mainValue}
              leftLabel='m_early'
              centerLabel='m_on_time'
              rightLabel='m_late'
              showLabel={false}
            />
          )}

          {(indicator === 'gauge' || indicator === 'button' || !indicator) && (
            <>
              {topIndicators.map((m, idx) => {
                if (m.hide) return;
                const tone = m.tone ?? 'neutral';
                return (
                  <SimpleCard
                    key={`${m.label}-${idx}`}
                    tone={tone}
                    label={m.label}
                    value={m.value}
                    icon={m.icon}
                    unit={m.unit}
                    action={m.action}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }
);
