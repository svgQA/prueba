import { IModelFile } from '@/types/ia';

export interface IFileCardProps {
  file: IModelFile;
}

export function FileCard({ file }: IFileCardProps) {
  return (
    <div className='border rounded-lg p-4 flex items-center space-x-4 max-w-80 min-w-72'>
      <span className='vox-icon vx-icon-152 flex-shrink-0' />
      <div className='min-w-0'>
        <h3 className='font-semibold truncate'>{file.name}</h3>
        <p className='text-sm text-gray-600'>Size: {file.size}</p>
        <p className='text-sm text-gray-600'>Status: {file.status}</p>
      </div>
    </div>
  );
}
