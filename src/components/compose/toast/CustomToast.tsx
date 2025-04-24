import { type Error } from '@/utils/network/error';
import { type FunctionComponent } from 'preact';

interface ToastData {
  data: {
    title: string;
    error: Error;
  };
}

export const CustomToast: FunctionComponent<ToastData> = ({ data }) => {
  return (
    <div className='msg-container p-4 min-w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <p className='msg-title font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2'>
        {data.title}
      </p>
      <div className='msg-description-container bg-gray-50 dark:bg-gray-900 rounded-md p-3'>
        <p className='msg-description text-sm text-gray-600 dark:text-gray-400 max-h-[250px] overflow-y-auto whitespace-pre-wrap break-words max-w-[250px] vox-scroll-design font-mono'>
          {JSON.stringify(data.error, null, 2)}
        </p>
      </div>
    </div>
  );
};
