import { type VoxError } from '@/utils/network/error';
import { type FunctionComponent } from 'preact';

export const CustomToast: FunctionComponent<{ data: VoxError }> = ({
  data,
}) => {
  return (
    <div className='msg-container w-[280px] bg-white dark:bg-gray-800'>
      <div className='flex flex-col gap-1.5 justify-center items-center'>
        {/* URL */}
        <div className='flex items-center gap-1.5 text-[11px] w-full'>
          <span className='text-gray-500 dark:text-gray-400 vox-icon size-sm vx-icon-004'></span>
          <h5 className='truncate overflow-hidden text-ellipsis w-full text-gray-500 dark:text-gray-400'>
            {data.url}
          </h5>
        </div>

        {/* Main Message */}
        <p className='font-medium text-gray-900 text-sm leading-tight w-full text-left'>
          {data.message}
        </p>

        {/* Data Section */}
        {data.data && Object.keys(data.data).length > 0 && (
          <div className='bg-gray-50 dark:bg-gray-900 rounded p-1.5'>
            <p className='text-[11px] text-gray-600 dark:text-gray-400 max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words vox-scroll-design font-mono'>
              {JSON.stringify(data.data, null, 2)}
            </p>
          </div>
        )}

        {/* Timestamp */}
        <div className='flex justify-end w-full'>
          <h5 className='text-[10px] text-gray-400 dark:text-gray-500 truncate overflow-hidden text-ellipsis max-w-full'>
            {data.timestamp}
          </h5>
        </div>
      </div>
    </div>
  );
};
