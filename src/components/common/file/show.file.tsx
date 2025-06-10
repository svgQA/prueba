// import { useSignal } from '@preact/signals';
// import { IPresignedRequest } from '@/types/file';
import { ShowFilesProps } from './interface';
// import { default_service_url } from '@/env.config';
// import { useUserStore } from '@/store/slices';

const showFiles = ({ resources = [], removeFile }: ShowFilesProps) => {
  // const allAttachments = useSignal<Attachment[]>([]);
  // const { tenant, getCompanyId } = useUserStore();

  /*
  const getAttachments = () => {
    resources.forEach((resource: IPresignedRequest) => {
      if (resource) {
        allAttachments.value.push({
          url: `/files/${resource.area}/${resource.uuid}/${resource.name}`,
          // url: `${default_service_url}/files/${tenant}/${getCompanyId()}/${resource.area}/${resource.uuid}/${resource.name}`,
          name: resource.name,
          type: resource.type.startsWith('image/') ? 'image' : 'file',
        });
      }
    });
  };
  */

  /*
  const showAttachmentsFiles = (attachment: Attachment, index: number) => {
    return (
      <a
        key={index}
        href={attachment.url}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center ml-2 p-2 bg-b-light-dark dark:bg-b-dark rounded-lg selection:transition-colors shadow-sm'
      >
        <span className='vox-icon size-sm vx-icon-311 px-2' />
        <span className='truncate max-w-[150px] text-t-light dark:text-t-dark text-xs'>
          {attachment.name}
        </span>
      </a>
    );
  };
  */

  /*
  const showAttachmentsImages = (attachment: Attachment, index: number) => {
    return (
      <div key={index} className='relative group'>
        <img
          src={attachment.url}
          alt={attachment.name}
          className='h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm'
          onClick={() => window.open(attachment.url, '_blank')}
        />
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg' />
      </div>
    );
  };
  */

  // getAttachments();

  return (
    <div className='flex flex-row py-1 w-full gap-2'>
      {resources.map((file) => (
        <div
          className='bg-contain dark:bg-gray-800 w-12 h-12 border rounded-md dark:border-b-dark-dark border-b-light-dark content-center text-center relative'
          key={file.uuid}
        >
          <span className='vox-icon vx-icon-067' />
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
  /*
    <div className='px-4 py-2'>
      <div className='flex flex-wrap gap-2 rounded-lg p-2'>
        {allAttachments.value.length > 0
          ? allAttachments.value.map((attachment, index) =>
              attachment.type === 'image'
                ? showAttachmentsImages(attachment, index)
                : showAttachmentsFiles(attachment, index)
            )
          : alertEmpty && (
              <span className='text-sm text-gray-text-light dark:text-t-dark-light'>
                No hay archivos adjuntos
              </span>
            )}
      </div>
    </div>
  );
    */
};

export default showFiles;
