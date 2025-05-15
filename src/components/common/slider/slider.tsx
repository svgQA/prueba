import { type FunctionComponent } from 'preact';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const Slider: FunctionComponent<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`mt-4 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          {label}: {showValue ? value : ''}
        </label>
      )}
      <div className='relative w-full h-2 bg-gray-200 rounded-full'>
        <div
          className='absolute h-full bg-cyan-500 rounded-full'
          style={{ width: `${percentage}%` }}
        />
        <div
          className='absolute top-0 h-6 w-6 bg-cyan-500 rounded-full -mt-2 pointer-events-none'
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
          style={{
            height: '24px',
            marginTop: '-8px',
          }}
        />
      </div>
    </div>
  );
};
