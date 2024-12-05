import { IModelFile } from '@/types/ia';

export interface IFileCardProps {
  file: IModelFile;
}

export const FileCard = ({ file }: IFileCardProps) => {
  return (
    <div className='border rounded-lg p-4 flex items-center space-x-4 max-w-80 min-w-72 dark:border-b-dark-light'>
      <span className='vox-icon vx-icon-152 flex-shrink-0' />
      <div className='min-w-0'>
        <h3 className='font-semibold truncate'>{file.name}</h3>
        <p className='text-sm'>Size: {file.size}</p>
        <p className='text-sm'>Status: {file.status}</p>
      </div>
    </div>
  );
};
