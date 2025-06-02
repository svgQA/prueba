import { Attachment, Resource } from "./interface";

export const showFiles = (resource: Resource) => {
    return (
        <div className='px-4 py-2'>
            <div className='flex flex-wrap gap-2 rounded-lg p-2'>
                {(() => {
                    const allAttachments: Attachment[] = [];

                    if (resource.images) {
                        const images = Array.isArray(resource.images)
                            ? resource.images
                            : [resource.images];

                        images.forEach((imageUrl: string) => {
                            if (imageUrl) {
                                allAttachments.push({
                                    url: imageUrl,
                                    name: imageUrl.split('/').pop() || 'Imagen',
                                    type: 'image',
                                });
                            }
                        });
                    }

                    if (resource.files) {
                        const files = Array.isArray(resource.files)
                            ? resource.files
                            : [resource.files];

                        files.forEach((fileUrl: string) => {
                            if (fileUrl) {
                                allAttachments.push({
                                    url: fileUrl,
                                    name: fileUrl.split('/').pop() || 'Archivo',
                                    type: 'file',
                                });
                            }
                        });
                    }

                    if (allAttachments.length === 0) {
                        return (
                            <span className='text-sm text-gray-text-light dark:text-t-dark-light'>
                                No hay archivos adjuntos
                            </span>
                        );
                    }

                    return allAttachments.map((attachment, index) => {
                        if (attachment.type === 'image') {
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
                        }

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
                    });
                })()}
            </div>
        </div>
    );
};