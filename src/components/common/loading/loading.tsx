import './index.css';
import { type ILoading } from './interface';

export const Loading = ({ open }: ILoading) => {
  return (
    <div
      className={` ${open ? 'visible' : 'invisible'} bg-b-dark absolute inset-0 bg-opacity-90 flex items-center justify-center z-[999]`}
    >
      <div className='w-10 h-10 relative'>
        <div className='loader'></div>
      </div>
    </div>
  );
};
