import { FunctionComponent } from 'preact';

interface PreviewProps {
  preview: string;
  label: string;
  accept?: string;
  onChange: (e: Event) => void;
}

export const Preview: FunctionComponent<PreviewProps> = ({
  preview,
  label,
  accept = '.svg',
  onChange,
}) => {
  return (
    <div className='col-span-1'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
        {label}
      </label>
      {preview && (
        <div className='mt-2 p-2 my-4 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800'>
          <img
            src={preview}
            alt={`${label} Preview`}
            className='max-h-20 mx-auto'
          />
        </div>
      )}
      <input
        type='file'
        accept={accept}
        onChange={onChange}
        className='block w-full text-sm text-gray-700 dark:text-gray-200
          file:mr-4 file:py-2 file:px-4 
          file:rounded-md file:border-0 
          file:text-sm file:font-semibold 
          file:bg-cyan-50 dark:file:bg-cyan-900
          file:text-cyan-700 dark:file:text-cyan-100
          hover:file:bg-cyan-100 dark:hover:file:bg-cyan-800
          cursor-pointer'
      />
    </div>
  );
};
