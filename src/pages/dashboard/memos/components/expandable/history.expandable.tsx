import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Memo } from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import SupervisorInfo from './supervisor.expandable';
import dayjs from 'dayjs';
import { Badge } from '@/components/common/badge/badge';
import { useUserStore } from '@/store/slices';
import { memo_history_service_url } from '@/env.config';
import { io } from 'socket.io-client';

const HistoryInfo = ({ memo }: { memo: Memo }) => {
  const [expandedMemoId, setExpandedMemoId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [memos, setMemos] = useState<Memo[]>([memo]);

  //socket
  const [_, setConnectionStatus] = useState<string>('Connecting...');
  const socketRef = useRef<any>(null);
  const { getToken, tenant } = useUserStore();

  const connect_socket = () => {
    const socket = io(memo_history_service_url, {
      query: { token: getToken(), tenantId: tenant },
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnectionStatus('Connected'));
    socket.on('disconnect', disconnect_socket);
    socket.on('connect_error', disconnect_socket);
  };

  const disconnect_socket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus('Disconnected');
  };

  useEffect(() => {
    connect_socket();
    return () => disconnect_socket();
  }, []);

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput && fileInput.files) {
      const fileList = fileInput.files;
      const filesArray: File[] = Array.from(fileList);
      setAttachments((prevAttachments) => [...prevAttachments, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  const handleSubmitMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Crear un nuevo memo basado en el memo inicial
    const newMemo: Memo = {
      ...memo, // Copiamos todos los campos del memo inicial
      id: Date.now(), // Nuevo ID
      description: message, // El mensaje como descripción
      updatedAt: new Date().toISOString(), // Nueva fecha
      updatedBy: 'Usuario Actual', // En producción, esto vendría del contexto de autenticación
      attachments: attachments.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file',
      })),
    };

    setMemos((prevMemos) => [...prevMemos, newMemo]);
    setMessage('');
    setAttachments([]);
  };

  const formatDate = (info: string | Date) => {
    const dateStr = String(info);
    if (!dateStr) return '-';

    try {
      return dayjs(dateStr).format('DD/MM/YYYY');
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status: string) => {
    let statusText = 'info';

    if (status === 'OPENED') {
      statusText = 'success';
    } else if (status === 'CLOSED') {
      statusText = 'error';
    } else if (status === 'IN_REVISION') {
      statusText = 'warning';
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
    <div className='w-full rounded-lg shadow-md bg-b-white dark:bg-b-dark border border-gray-border'>
      <div className='p-4 pb-2'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-xl font-bold text-t-light dark:text-t-dark'>
              {memo.novelty?.name || 'Memorando #' + memo.id}
            </h3>
            <p className='mt-1 text-sm text-gray-text-light dark:text-t-dark-light'>
              {memo.updatedBy || memo.extraData?.client?.name} •{' '}
              {memo.updatedAt
                ? formatDate(new Date(memo.updatedAt))
                : formatDate(new Date())}
            </p>
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
      <div className='p-4 pt-2'>
        <div className='space-y-4'>
          <div className='flex flex-col space-y-1'>
            <span className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
              Descripción:
            </span>
            <p className='text-sm text-t-light dark:text-t-dark'>
              {memo.description || 'Sin descripción disponible'}
            </p>
          </div>

          <div className='flex flex-col space-y-1'>
            <h4 className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
              Historial de cambios
            </h4>
            <div className='flex gap-6'>
              <div className='flex-1 flex items-start gap-3'>
                <div className='w-1 h-full bg-b-light-dark dark:bg-b-dark-light rounded-full' />
                <div>
                  <p className='font-medium text-t-light dark:text-t-dark'>
                    Creación del memorando
                  </p>
                  <p className='text-gray-text-light dark:text-t-dark-light text-xs'>
                    {formatDate(new Date(memo.createdAt || Date.now()))}
                  </p>
                </div>
              </div>
              <div className='flex-1 flex items-start gap-3'>
                <div className='w-1 h-full bg-b-light-dark dark:bg-b-dark-light rounded-full' />
                <div>
                  <p className='font-medium text-t-light dark:text-t-dark'>
                    Actualización de estado
                  </p>
                  <p className='text-gray-text-light dark:text-t-dark-light text-xs'>
                    {formatDate(new Date(memo.updatedAt || Date.now()))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {memo.resource && (
            <div className='flex flex-col space-y-1'>
              <span className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
                Archivos adjuntos:
              </span>
              <div className='flex flex-wrap gap-2'>
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
                            className='h-20 w-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity'
                            onClick={() =>
                              window.open(attachment.url, '_blank')
                            }
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-md' />
                        </div>
                      );
                    }

                    return (
                      <a
                        key={index}
                        href={attachment.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center p-2 bg-b-light dark:bg-b-dark-light rounded-md text-sm hover:bg-b-light-dark dark:hover:bg-b-dark transition-colors'
                      >
                        <span className='vox-icon size-sm vx-icon-311 px-2' />
                        <span className='truncate max-w-[150px] text-t-light dark:text-t-dark'>
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
      <div
        className={`overflow-y-auto p-4 ${memos.length > 1 ? 'h-[400px]' : 'min-h-[200px]'}`}
      >
        <div className='space-y-4'>
          {memos.map((memo) => (
            <div key={memo.id} className='flex gap-3'>
              <Avatar name={memo.extraData?.client?.name} size='sm' square />
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-sm text-t-light dark:text-t-dark'>
                    {memo.extraData?.client?.name}
                  </span>
                  <span className='text-xs text-gray-text-light dark:text-t-dark-light'>
                    {formatDate(memo.updatedAt || new Date())}
                  </span>
                </div>
                <div
                  className='mt-1 p-3 bg-b-light dark:bg-b-dark-light rounded-lg cursor-pointer hover:bg-b-light-dark dark:hover:bg-b-dark transition-colors'
                  onClick={() =>
                    setExpandedMemoId(
                      expandedMemoId === memo.id ? null : memo.id
                    )
                  }
                >
                  <p className='text-sm text-t-light dark:text-t-dark'>
                    {memo.description}
                  </p>

                  {memo.attachments && memo.attachments.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {memo.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center p-1.5 bg-b-white dark:bg-b-dark rounded-md text-xs hover:bg-b-light dark:hover:bg-b-dark-light transition-colors'
                        >
                          <span className='vox-icon size-sm vx-icon-311 px-2' />
                          <span className='truncate max-w-[120px] text-t-light dark:text-t-dark'>
                            {attachment.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Memo Details */}
                  {expandedMemoId === memo.id && (
                    <div className='mt-4 pt-4 border-t border-gray-border'>
                      <SupervisorInfo memo={memo} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className='p-4 border-t border-gray-border'>
        <form onSubmit={handleSubmitMessage}>
          <div className='flex flex-col space-y-2'>
            <textarea
              placeholder='Escribe un mensaje...'
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage((e.target as HTMLTextAreaElement).value)
              }
              className='min-h-[80px] w-full p-3 rounded-md border border-gray-border bg-b-white dark:bg-b-dark-light text-t-light dark:text-t-dark focus:outline-none focus:ring-2 focus:ring-primary'
            />

            {attachments.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center p-1.5 bg-b-light dark:bg-b-dark-light rounded-md text-xs group'
                  >
                    <span className='vox-icon size-sm vx-icon-311 px-2' />
                    <span className='truncate max-w-[120px] text-t-light dark:text-t-dark'>
                      {file.name}
                    </span>
                    <button
                      type='button'
                      onClick={() => removeAttachment(index)}
                      className='ml-1 text-gray-text-light hover:text-error'
                    >
                      <span className='vox-icon size-sm vx-icon-311 px-2' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='flex justify-between items-center mt-2'>
              <div className='flex gap-2'>
                <label htmlFor='file-upload' className='cursor-pointer'>
                  <div className='flex items-center text-sm text-gray-text-light hover:text-primary transition-colors'>
                    <span className='vox-icon size-sm vx-icon-311 px-2' />
                    <span>Adjuntar</span>
                  </div>
                  <input
                    id='file-upload'
                    type='file'
                    multiple
                    className='hidden'
                    onChange={handleAttachmentUpload}
                  />
                </label>
              </div>
              <button
                type='submit'
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-md text-sm flex items-center ${
                  message.trim()
                    ? 'bg-primary text-t-dark hover:bg-ternary'
                    : 'bg-b-light-dark text-gray-text-light cursor-not-allowed'
                } transition-colors`}
              >
                <span className='vox-icon size-sm vx-icon-311 px-2' />
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HistoryInfo;
