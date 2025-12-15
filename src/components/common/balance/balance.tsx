import { FunctionalComponent } from 'preact';
import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

type BalanceIndicatorProps = {
  value: number;
  label?: string;

  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;

  heightClass?: string;
  showNeedle?: boolean;
  showLabel?: boolean;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const BalanceIndicator: FunctionalComponent<BalanceIndicatorProps> =
  memo(
    ({
      value,
      label,
      leftLabel = '',
      centerLabel = '',
      rightLabel = '',
      heightClass = 'h-2',
      showNeedle = true,
      showLabel = true,
    }) => {
      const { t } = useTranslation();
      const v = clamp(Number.isFinite(value) ? value : 50, 0, 100);

      const delta = v - 50;
      const magnitude = Math.abs(delta);
      const pctFromCenter = (magnitude / 50) * 50;

      const severity =
        magnitude === 0
          ? 'ok'
          : magnitude <= 10
            ? 'low'
            : magnitude <= 25
              ? 'mid'
              : 'high';

      const barTone =
        severity === 'ok'
          ? 'bg-emerald-500'
          : severity === 'low'
            ? 'bg-amber-400'
            : severity === 'mid'
              ? 'bg-orange-500'
              : 'bg-rose-500';

      const needleLeftPct = v;

      return (
        <div className='w-full pb-3'>
          {/* Header */}
          <div className='flex items-center justify-between gap-3 mb-2'>
            {showLabel && (
              <div className='min-w-0'>
                <div className='text-sm font-semibold truncate'>{label}</div>
                <div className='text-xs text-t-light-dark dark:text-t-dark-light'>
                  Valor: <span className='font-semibold'>{v}</span> · Centro: 50
                </div>
              </div>
            )}

            <div
              className={[
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                severity === 'ok'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                  : severity === 'low'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                    : severity === 'mid'
                      ? 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200'
                      : 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200',
              ].join(' ')}
            >
              {severity === 'ok'
                ? 'OK'
                : severity === 'low'
                  ? 'Leve'
                  : severity === 'mid'
                    ? 'Media'
                    : 'Alta'}
            </div>
          </div>

          {/* Track */}
          <div className='relative w-full'>
            <div
              className={[
                'w-full rounded-full',
                heightClass,
                'bg-slate-200 dark:bg-slate-800',
                'ring-1 ring-black/5 dark:ring-white/10',
              ].join(' ')}
              role='img'
              aria-label={`Indicador de balanza. Valor ${v}. 50 es el centro. 0 izquierda, 100 derecha.`}
            />

            {/* Center marker */}
            <div
              className={[
                'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2',
                'w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-100',
                'shadow-sm',
              ].join(' ')}
              aria-hidden='true'
            />

            {/* Bar drawn from center */}
            {magnitude > 0 ? (
              delta > 0 ? (
                // Derecha: desde 50% hacia la derecha
                <div
                  className={[
                    'absolute top-1/2 -translate-y-1/2',
                    heightClass,
                    'rounded-full',
                    barTone,
                    'transition-all duration-300 ease-out',
                  ].join(' ')}
                  style={{
                    left: '50%',
                    width: `${pctFromCenter}%`,
                  }}
                  aria-hidden='true'
                />
              ) : (
                // Izquierda: desde 50% hacia la izquierda
                <div
                  className={[
                    'absolute top-1/2 -translate-y-1/2',
                    heightClass,
                    'rounded-full',
                    barTone,
                    'transition-all duration-300 ease-out',
                  ].join(' ')}
                  style={{
                    right: '50%',
                    width: `${pctFromCenter}%`,
                  }}
                  aria-hidden='true'
                />
              )
            ) : (
              // Glow en el centro cuando está OK
              <div
                className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500/30'
                aria-hidden='true'
              />
            )}

            {/* Needle */}
            {showNeedle ? (
              <div
                className='absolute -top-3'
                style={{
                  left: `${needleLeftPct}%`,
                  transform: 'translateX(-50%)',
                }}
                aria-hidden='true'
              >
                <p className='text-xs absolute -top-5 font-bold'>{v - 50}</p>
                <div className='w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-slate-900 dark:border-t-slate-100' />
              </div>
            ) : null}

            {/* Labels */}
            <div className='absolute -bottom-4 left-0 right-0 flex justify-between text-[11px] text-t-light-dark dark:text-t-dark-light'>
              <span className='opacity-80'>{t(leftLabel)}</span>
              <span className='opacity-80'>{t(centerLabel)}</span>
              <span className='opacity-80'>{t(rightLabel)}</span>
            </div>
          </div>
        </div>
      );
    }
  );
