import type React from 'react';
import { useEffect, useState } from 'react';
import { IFilesMemo, IFile, Memo } from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import SupervisorInfo from './supervisor.expandable';
import dayjs from 'dayjs';
import { Badge } from '@/components/common/badge/badge';
import { MemoService } from '@/services';
import { File } from '@/components/common/file/file';
import { TextArea } from '@/components/common/text.area/text.area';
import { useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { EventBus } from '@/utils/network/event.bus';

const HistoryInfo = ({ memo }: { memo: Memo }) => {
  const [expandedMemoId, setExpandedMemoId] = useState<number | null>(null);
  const memos = useSignal<Memo[]>([]);
  const [files, setFiles] = useState<IFilesMemo[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();

    const unsubscribe = EventBus.subscribe((event) => {
      if (event.id.toString() === memo.id.toString()) {
        fetchInitialData();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchInitialData = async () => {
    const [responseMemos] = await Promise.all([
      MemoService.getMemosByHistory(memo.id.toString()),
    ]);

    if (responseMemos.getStatus()) {
      const memosData = responseMemos.getMany();
      // TODO: Cambiar esto, porque desde back se puede tener
      memos.value = memosData.map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
      })).sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateA.getTime() - dateB.getTime();
      });
    }
  };

  const handleSubmitMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    const newMemo = {
      ...memo,
      description: message,
      priority:
        memo.priority === 'Alta' ? 5 : memo.priority === 'Media' ? 4 : 3,
      updatedAt: new Date(),
      createdAt: new Date(),
      resource: {
        images: files[files.length - 1]?.images || [],
        files: files[files.length - 1]?.files || [],
      },
      parentId: memo.id,
    };

    const response = await MemoService.createMemo(newMemo);

    if (response.getStatus()) {
      memos.value = [...memos.value, response.getOne()];
    }

    setFiles([]);
    setMessage('');
  };

  const handleAttachmentUpload = (e: any) => {
    const type = e.target.type;
    const fileInput: IFile = e.target.value[0];
    fileInput.area = 'memo';

    if (type === 'file') {
      setFiles([
        ...files,
        {
          images: files[files.length - 1]?.images || [],
          files: [...(files[files.length - 1]?.files || []), fileInput],
        },
      ]);
    } else {
      setFiles([
        ...files,
        {
          images: [...(files[files.length - 1]?.images || []), fileInput],
          files: files[files.length - 1]?.files || [],
        },
      ]);
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const getStatusColor = (status?: string) => {
    let statusText = 'info';

    if (status === 'OPENED') {
      statusText = 'success';
    } else if (status === 'CLOSED') {
      statusText = 'error';
    } else if (status === 'IN_REVISION') {
      statusText = 'warning';
    } else {
      statusText = 'info';
    }

    return statusText;
  };

  const getPriorityColor = (priority: string) => {
    let status = 'info';

    if (priority === 'Alta') {
      status = 'error';
    } else if (priority === 'Media') {
      status = 'warning';
    }

    return status;
  };

  return (
    <div className='w-full rounded-lg bg-b-white-light dark:bg-b-dark-light border border-b-light-dark dark:border-b-dark-light shadow-sm h-[450px] overflow-y-auto'>
      <div className='p-6 pb-3'>
        <div className='flex justify-between items-start gap-6'>
          <div className='space-y-2 flex-1'>
            <h3 className='text-2xl font-bold text-t-light dark:text-t-dark'>
              {memo.novelty?.name || 'Memorando #' + memo.id}
            </h3>
            <p className='text-sm text-gray-text-light dark:text-t-dark-light'>
              {memo.updatedBy || memo.extraData?.client?.name} •{' '}
              {memo.updatedAt
                ? formatDate(new Date(memo.updatedAt))
                : formatDate(new Date())}
            </p>
          </div>
          <div className='flex gap-4 flex-1'>
            <div className='flex-1 flex items-start gap-3 bg-gradient-to-br from-b-light-light to-b-light dark:from-b-dark-dark dark:to-b-dark rounded-lg p-4 shadow-sm'>
              <div className='w-1 h-full bg-primary rounded-full' />
              <div className='space-y-1'>
                <p className='font-medium text-t-light dark:text-t-dark text-sm'>
                  Creación del memorando
                </p>
                <p className='text-xs text-gray-text-light dark:text-t-dark-light'>
                  {formatDate(new Date(memo.createdAt || Date.now()))}
                </p>
              </div>
            </div>
            <div className='flex-1 flex items-start gap-3 bg-gradient-to-br from-b-light-light to-b-light dark:from-b-dark-dark dark:to-b-dark rounded-lg p-4 shadow-sm'>
              <div className='w-1 h-full bg-primary rounded-full' />
              <div className='space-y-1'>
                <p className='font-medium text-t-light dark:text-t-dark text-sm'>
                  Actualización de estado
                </p>
                <p className='text-xs text-gray-text-light dark:text-t-dark-light'>
                  {formatDate(new Date(memo.updatedAt || Date.now()))}
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              label={memo?.state}
              status={
                `${getStatusColor(memo.state)}` as
                  | 'info'
                  | 'error'
                  | 'warning'
                  | 'success'
              }
              full
              outline
            />
            <Badge
              label={memo?.priority?.toString()}
              status={
                `${getPriorityColor(memo.priority?.toString() || '')}` as
                  | 'info'
                  | 'error'
                  | 'warning'
                  | 'success'
              }
              full
              outline
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-6 py-3'>
        <div className='space-y-6'>
          <div className='flex flex-col space-y-2'>
            <span className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
              Descripción:
            </span>
            <p className='text-t-light dark:text-t-dark leading-relaxed'>
              {memo.description || 'Sin descripción disponible'}
            </p>
          </div>

          {memo.resource && (
            <div className='flex flex-col space-y-2'>
              <span className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
                Archivos adjuntos:
              </span>
              <div className='flex flex-wrap gap-3 bg-b-light-light dark:bg-b-dark-dark rounded-lg p-4'>
                {(() => {
                  interface Attachment {
                    url: string;
                    name: string;
                    type: 'image' | 'file';
                  }

                  const allAttachments: Attachment[] = [];

                  // Procesar imágenes
                  if (memo.resource.images) {
                    const images = Array.isArray(memo.resource.images)
                      ? memo.resource.images
                      : [memo.resource.images];

                    images.forEach((imageUrl) => {
                      if (imageUrl) {
                        allAttachments.push({
                          url: imageUrl,
                          name: imageUrl.split('/').pop() || 'Imagen',
                          type: 'image',
                        });
                      }
                    });
                  }

                  // Procesar archivos
                  if (memo.resource.files) {
                    const files = Array.isArray(memo.resource.files)
                      ? memo.resource.files
                      : [memo.resource.files];

                    files.forEach((fileUrl) => {
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
                            className='h-24 w-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm'
                            onClick={() =>
                              window.open(attachment.url, '_blank')
                            }
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
                        className='flex items-center p-3 bg-b-white dark:bg-b-dark-light rounded-lg hover:bg-b-light-dark dark:hover:bg-b-dark transition-colors shadow-sm'
                      >
                        <span className='vox-icon size-sm vx-icon-311 px-2' />
                        <span className='truncate max-w-[200px] text-t-light dark:text-t-dark'>
                          {attachment.name}
                        </span>
                      </a>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className='h-px bg-gray-border dark:bg-b-dark-light' />

      {/* Chat Messages */}
      <div className='px-6 py-4 pb-25'>
        <div className='space-y-6'>
          {memos.value.map((memo: Memo) => (
            <div key={memo.id} className='flex gap-4'>
              <Avatar
                name={memo.user?.name + ' ' + memo.user?.surname || 'Unknown User'}
                size='md'
                square
              />
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='font-medium text-t-light dark:text-t-dark'>
                    {memo.user?.name + ' ' + memo.user?.surname || 'Unknown User'}
                  </span>
                  <span className='text-xs text-gray-text-light dark:text-t-dark-light'>
                    {formatDate(memo.updatedAt || new Date())}
                  </span>
                </div>
                <div
                  className='p-4 bg-b-light-light dark:bg-b-dark-light rounded-lg cursor-pointer shadow-sm'
                  onClick={() =>
                    setExpandedMemoId(
                      expandedMemoId === memo.id ? null : memo.id
                    )
                  }
                >
                  <p className='text-t-light dark:text-t-dark leading-relaxed whitespace-pre-wrap'>
                    {memo.description}
                  </p>

                  {memo.attachments && memo.attachments.length > 0 && (
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {memo.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center p-2 bg-b-white dark:bg-b-dark rounded-md text-xs shadow-sm'
                        >
                          <span className='vox-icon size-sm vx-icon-311 px-2' />
                          <span className='truncate max-w-[150px] text-t-light dark:text-t-dark'>
                            {attachment.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Memo Details */}
                  {expandedMemoId === memo.id && (
                    <div className='mt-4 pt-4 border-t border-b-light-dark dark:border-b-dark-light'>
                      <SupervisorInfo memo={memo} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {memos.value.length === 0 && (
            <div className='flex justify-center items-center h-32'>
              <p className='text-gray-text-light dark:text-t-dark-light'>
                No hay Comentarios
              </p>
            </div>
          )}
        </div>
      </div>

     {/* Message Input */}
     <div className='p-4 border-t border-b-light-dark dark:border-b-dark-light'>
        <form onSubmit={handleSubmitMessage}>
          <div className='flex flex-col space-y-2'>
            <TextArea
              name='message'
              placeholder='Escribe un Comentario...'
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage((e.target as HTMLTextAreaElement).value)
              }
            />

            {files.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {files[files.length - 1]?.images.map((image, index) => (
                  <div key={`img-${index}`} className='relative group'>
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.name}
                        className='h-20 w-20 object-cover rounded-md'
                      />
                    ) : (
                      <div className='h-20 w-20 bg-b-light dark:bg-b-dark-light rounded-md flex items-center justify-center'>
                        <span className='vox-icon size-sm vx-icon-311' />
                      </div>
                    )}
                  </div>
                ))}
                {files[files.length - 1]?.files.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className='flex items-center p-1.5 bg-b-light dark:bg-b-dark-light rounded-md text-xs group'
                  >
                    <span className='vox-icon size-sm vx-icon-311 px-2' />
                    <span className='truncate max-w-[120px] text-t-light dark:text-t-dark'>
                      {file.name}
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        const newFiles = [...files];
                        newFiles[newFiles.length - 1].files = newFiles[
                          newFiles.length - 1
                        ].files.filter((_, i) => i !== index);
                        setFiles(newFiles);
                      }}
                      className='ml-1 text-gray-text-light hover:text-error'
                    >
                      <span className='vox-icon size-sm vx-icon-311' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='flex justify-between items-center mt-2'>
              <div className='flex gap-2'>
                <File
                  name='attachments'
                  onChange={handleAttachmentUpload}
                  value={[]}
                  accept='image/*'
                  multiple={true}
                />
              </div>
              <Button
                name='memo-send-response'
                type='submit'
                disabled={!message.trim()}
                label='Enviar'
                icon='311'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistoryInfo;
