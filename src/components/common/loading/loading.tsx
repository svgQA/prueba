import { type ILoading } from './interface';

export const Loading = ({ open }: ILoading) => {
  return (
    <div
      className={` ${open ? 'visible' : 'invisible'} absolute inset-0 bg-opacity-50 flex items-center justify-center z-50`}
    >
      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2'></div>
    </div>
  );
};
