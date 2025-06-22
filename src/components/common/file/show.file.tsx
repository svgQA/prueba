import { IPresignedRequest } from '@/types/file';
import { ShowFilesProps } from './interface';
import { useUserStore } from '@/store/slices';
import { Avatar } from '../Avatar';
import { cdn_service_url } from '@/env.config';

const showFiles = ({ resources = [], removeFile }: ShowFilesProps) => {
  const { getTenant, getCompanyId } = useUserStore();

  const getUrl = (file: IPresignedRequest) => {
    return `${cdn_service_url}/${getTenant()}/${getCompanyId()}/${file.area}/${file.uuid}-${file.name}`;
  };

  return (
    <div className='flex flex-row py-1 w-full gap-2'>
      {resources.map((file) => (
        <div
          className='bg-contain dark:bg-gray-800 h-12 border rounded-md dark:border-b-dark-dark border-b-light-dark content-center text-center relative'
          key={file.uuid}
        >
          {file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/svg+xml' ? (
            <Avatar src={getUrl(file)} name='Image' square />
          ) : (
            <span className='vox-icon vx-icon-069 px-3' />
          )}
          {removeFile && (
            <span
              className='absolute vox-icon vx-icon-008 size-sm top-0 right-0 cursor-pointer'
              onClick={() => removeFile(file.uuid)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default showFiles;
