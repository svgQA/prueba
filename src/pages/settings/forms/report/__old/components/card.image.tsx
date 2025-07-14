import { handleFileChangeWrapper } from '@/components/common/file/utils/utils';
import { IPresignedRequest } from '@/types/file';
import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { IDropzoneProps } from './interface';
import { ToastManager } from '@/utils/toast/toast-manager';

export const CardDropzone = ({
  description,
  icon,
  name,
  onChange,
  accept = 'image/*',
  id,
  value,
}: IDropzoneProps) => {
  const dataset = useSignal({});
  const isLoading = useSignal(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !(e.target instanceof HTMLInputElement)) return;
    dataset.value = e.target.dataset;

    isLoading.value = true;
    try {
      await handleFileChangeWrapper(e, emitChange, 'report');
    } catch (error) {
      ToastManager.error('s_upload_error');
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
        value: image,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className='relative border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer border-b-light-dark dark:border-b-dark-light flex flex-row justify-between items-center'
    >
      {isLoading.value && (
        <div className='absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      )}
      <span className={`vox-icon vx-icon-${icon}`} />
      <p className='text-t-light dark:text-t-dark mx-3'>
        {value?.name || description}
      </p>

      <input
        id={id}
        name={name}
        ref={fileRef}
        onChange={handleFileChange}
        type='file'
        accept={accept}
        className='hidden'
      />
    </div>
  );
};
