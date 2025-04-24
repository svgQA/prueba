import { Error } from '@/utils/network/error';
import { type FunctionComponent } from 'preact';

interface ToastData {
  data: {
    title: string;
    error: Error;
  };
}

export const CustomToast: FunctionComponent<ToastData> = ({ data }) => {
  return (
    <div className='msg-container p-4 min-w-[300px]'>
      <p className='msg-title font-semibold text-gray-900 dark:text-gray-100'>
        {data.title}
      </p>
      <p className='msg-description text-sm text-gray-600 dark:text-gray-400 mt-1 max-h-[250px] overflow-y-auto whitespace-pre-wrap break-words max-w-[250px] vox-scroll-design'>
        {JSON.stringify(data.error, null, 2)}
      </p>
    </div>
  );
};
