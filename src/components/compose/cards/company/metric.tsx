// import { Card } from '@/components/common/card/card';
import { FunctionalComponent, ComponentChildren } from 'preact';
import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

type MetricIndicator = {
  label: string; // i18n key
  value: number | string;
  unit?: string;
  icon?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};

type CardProps = {
  title: string;
  subtitle?: string;
  value: number | string;
  unit?: string;
  icon?: string;
  color?: 'sky' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate';
  indicators?: MetricIndicator[];
  children?: ComponentChildren; // 👈 slot
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

export const MetricCard: FunctionalComponent<CardProps> = memo(
  ({
    title,
    subtitle,
    value,
    unit,
    icon = '071',
    color = 'sky',
    indicators = [],
    children,
  }) => {
    const { t } = useTranslation();
    const theme = palette[color];
    const topIndicators = indicators.slice(0, 3);
    const hasExtra = Boolean(children);

    return (
      <div
        className={[
          'w-full px-4 py-2 flex flex-col justify-between rounded-xl',
          'ring-1',
          theme.ring,
        ].join(' ')}
      >
        {/* Header row */}
        <div className='flex items-start gap-3'>
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
            {subtitle ? (
              <p className='mt-0.5 text-sm text-t-light-dark dark:text-t-dark-light truncate'>
                {t(subtitle)}
              </p>
            ) : (
              <div className='mt-0.5 h-5' />
            )}
          </div>

          <div
            className={[
              'shrink-0 rounded-xl px-3 py-2',
              'text-right',
              theme.valueBg,
            ].join(' ')}
          >
            <div className='flex items-baseline gap-1 justify-end'>
              <span className='text-2xl font-bold tracking-tight'>{value}</span>
              {unit ? (
                <span className='text-sm font-semibold opacity-80'>{unit}</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Optional extra content slot (gauge / balance / chart) */}
        {hasExtra ? (
          <div className='mt-4 rounded-lg p-3 bg-black/[0.02] dark:bg-white/[0.03] ring-1 ring-black/5 dark:ring-white/10'>
            {children}
          </div>
        ) : null}

        {/* Indicators (2-3) */}
        {topIndicators.length ? (
          <div
            className={[
              'grid grid-cols-1 sm:grid-cols-3 gap-2',
              hasExtra ? 'mt-3' : 'mt-4',
            ].join(' ')}
          >
            {topIndicators.map((m, idx) => {
              const tone = m.tone ?? 'neutral';
              return (
                <div
                  key={`${m.label}-${idx}`}
                  className={[
                    'flex items-center gap-2 rounded-lg px-3 py-2',
                    'ring-1 ring-black/5 dark:ring-white/10',
                    toneClass[tone],
                  ].join(' ')}
                >
                  {m.icon ? (
                    <span
                      className={[
                        `vox-icon vx-icon-${m.icon}`,
                        'w-5 h-5 flex items-center justify-center opacity-90',
                      ].join(' ')}
                      aria-hidden='true'
                    />
                  ) : (
                    <span className='w-5 h-5' aria-hidden='true' />
                  )}

                  <div className='min-w-0 flex-1'>
                    <div className='text-xs font-medium truncate opacity-90'>
                      {t(m.label)}
                    </div>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-sm font-semibold'>{m.value}</span>
                      {m.unit ? (
                        <span className='text-xs font-semibold opacity-80'>
                          {m.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
);
