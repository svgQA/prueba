import { FunctionComponent } from 'preact';
import { IGaugeProps } from './interface';

export const Gauge: FunctionComponent<IGaugeProps> = ({
  gauges,
  size = 24,
  stroke = 8,
}) => {
  const baseRadius = 45;
  const gap = 2;

  return (
    <div className='flex items-center justify-center'>
      <div className={`w-${size} h-${size} relative`}>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          {/* Fondo */}
          <circle
            cx='50'
            cy='50'
            r={baseRadius}
            strokeWidth={stroke}
            className='stroke-gray-200 dark:stroke-gray-700 fill-none'
          />

          {/* Gauges dinámicos */}
          {gauges.map((gauge, index) => {
            const r = baseRadius - index * (stroke + gap);
            const circumference = 2 * Math.PI * r;
            const progress = Math.min(100, Math.max(0, gauge.progress));

            return (
              <circle
                key={index}
                cx='50'
                cy='50'
                r={r}
                fill='none'
                stroke={gauge.color}
                strokeWidth={stroke}
                strokeLinecap='round'
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference * (1 - progress / 100),
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                }}
              />
            );
          })}

          {/* Texto central (por ejemplo el primero) */}
          <text
            x='50'
            y='50'
            dominantBaseline='middle'
            textAnchor='middle'
            className='fill-gray-700 dark:fill-gray-200'
            style={{ fontSize: '20px' }}
          >
            {gauges[0]?.progress.toFixed(0)}%
          </text>
        </svg>
      </div>
    </div>
  );
};
