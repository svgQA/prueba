import { type IFileProps } from './interface';
import { useSignal } from '@preact/signals';
import { IPresignedRequest } from '@/types/file';
import { handleFileChangeWrapper } from './utils';

export const File = ({
  id,
  name,
  label,
  icon,
  required,
  onChange,
  meta,
  end,
  tabIndex,
  borderless,
  thin,
  multiple = false,
  accept,
  value = [],
  ...props
}: IFileProps) => {
  const dataset = useSignal({});
  const isLoading = useSignal(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !(e.target instanceof HTMLInputElement)) return;
    dataset.value = e.target.dataset;

    isLoading.value = true;
    try {
      await handleFileChangeWrapper(e, emitChange);
    } catch (error) {
      console.log('ERROR: No se ha podido cargar la imagen', error);
    } finally {
      isLoading.value = false;
      e.target.value = '';
    }
  };

  const emitChange = (dataset: any, image: IPresignedRequest) => {
    onChange?.({
      target: {
        name: name,
        type: 'file',
        dataset: dataset,
        value: [...value, image],
      },
    });
  };

  const removeAction = (file: string) => {
    onChange?.({
      target: {
        name: name,
        type: 'file',
        dataset: dataset.value,
        value: value.filter((f) => f.uuid !== file),
      },
    });
  };

  return (
    <div id={id} name={name} className='w-full my-1'>
      <div className='relative'>
        {isLoading.value && (
          <div className='absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        )}
        {label && (
          <label
            for={`${id}-input`}
            className='capitalize block text-sm font-medium'
          >
            {label}
          </label>
        )}
        <div
          className={`${borderless ? '' : 'border-b-light-dark dark:border-b-dark-light border'} rounded flex flex-row items-center`}
        >
          {!end && icon && (
            <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
          )}
          <input
            className={`px-2 w-full mr-2 bg-transparent rounded-md ${thin ? '' : 'py-2'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100`}
            onChange={handleFileChange}
            name={name}
            type='file'
            id={`${id}-input`}
            required={required}
            tabIndex={tabIndex}
            multiple={multiple}
            accept={accept}
            {...props}
          />
          {end && icon && <span className={`vox-icon vx-icon-${icon}`} />}
        </div>
        {meta && meta.touched && meta.error && <span>{meta?.error}</span>}
        <div className='mt-4 grid grid-cols-4 gap-4'>
          {Array.isArray(value) &&
            value.map((file) => (
              <div
                key={file.uuid}
                className='p-2 border rounded border-green-500 relative'
              >
                <span
                  className='vox-icon vx-icon-008 size-xs absolute top-0 right-1 cursor-pointer'
                  onClick={() => removeAction(file.uuid)}
                ></span>
                <p className='text-sm truncate'>{file.name}</p>
                <p className='text-xs text-gray-500'>{file.type}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
