import { getStatusLoading } from '@/store/signals/modals';
import './index.css';
import { type ILoadingProps } from './interface';
import { memo } from 'preact/compat';

export const Loading = memo((_: ILoadingProps) => {
  return (
    <div
      className={` ${getStatusLoading.value ? 'visible' : 'invisible'} bg-b-dark fixed inset-0 bg-opacity-90 flex items-center justify-center z-[9999]`}
    >
      <div className='w-10 h-10 relative'>
        <div className='loader'></div>
      </div>
    </div>
  );
});
