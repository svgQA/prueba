import { useState } from 'preact/hooks';
import { SHIFT_MODE } from '../store/shift';

export default function ModeSwitch({ value = SHIFT_MODE, onChange }: any) {
  const [mode, setMode] = useState<SHIFT_MODE>(value);
  const isMonitoring = mode === SHIFT_MODE.MONITOR;

  const toggleMode = () => {
    const newMode = isMonitoring ? SHIFT_MODE.HISTORY : SHIFT_MODE.MONITOR;
    setMode(newMode);
    onChange?.(newMode);
  };

  return (
    <button
      type='button'
      onClick={toggleMode}
      aria-pressed={isMonitoring}
      className='
        relative inline-flex items-center
        h-8 w-56 rounded-full p-1
        bg-gray-200 dark:bg-gray-700
        active:scale-100
        select-none
        focus:outline-none
      '
    >
      {/*  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 */}
      {/* Thumb (se mueve con translate-x-full) */}
      <span
        className={`
          absolute left-1 top-1 h-[1.4rem] w-[calc(50%-0.25rem)]
          rounded-full shadow
          transition-transform duration-300 ease-out
          ${isMonitoring ? 'translate-x-0 bg-ternary' : 'translate-x-full bg-ternary'}
        `}
      />

      {/* Labels */}
      <span className='relative z-10 w-1/2 text-center text-sm font-semibold flex flex-row justify-center items-center'>
        <span
          className={`${isMonitoring ? 'text-white' : ''} transition-colors`}
        >
          Monitoreo
        </span>
      </span>

      <span className='relative z-10 w-1/2 text-center text-sm font-semibold flex flex-row justify-center items-center'>
        <span
          className={`${!isMonitoring ? 'text-white' : ''} transition-colors`}
        >
          Historial
        </span>
      </span>
    </button>
  );
}
