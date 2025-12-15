import { FunctionComponent } from 'preact';

interface IGaugeProps {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
}

export const SimpleGauge: FunctionComponent<IGaugeProps> = ({
  progress,
  size = 10,
  stroke = 10,
  color = 'blue',
}) => {
  const len_progress = String(progress).length > 1;
  return (
    <div className={`flex items-center justify-center`}>
      <div className={`w-${size} h-${size} relative`}>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          {/* Fondo del círculo */}
          <circle
            className='stroke-gray-200 dark:stroke-gray-700 fill-none'
            cx='50'
            cy='50'
            r='45'
            strokeWidth={stroke}
          />
          {/* Progreso dinámico */}
          <circle
            className={`fill-none`}
            cx='50'
            cy='50'
            r='45'
            strokeWidth={stroke}
            strokeLinecap='round'
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - (progress > 100 ? 100 : progress) / 100)}`,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              stroke: color, // Usar el color dinámico para el progreso
            }}
          />
          <text
            x='50'
            y='50'
            className='fill-gray-700 dark:fill-gray-200'
            dominantBaseline='middle'
            textAnchor='middle'
            style={{ fontSize: len_progress ? '20px' : '22px' }}
          >
            {progress.toFixed(0)}%
          </text>
        </svg>
      </div>
    </div>
  );
};
