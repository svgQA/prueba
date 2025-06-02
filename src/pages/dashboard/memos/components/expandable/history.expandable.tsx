import { useEffect, useState } from 'preact/hooks';
import {
  IFilesMemo,
  IFile,
  Memo,
  Resource,
  ExtraData,
} from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import { MemoService } from '@/services';
import { File } from '@/components/common/file/file';
import { TextArea } from '@/components/common/text.area/text.area';
import { Signal, useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { ToastManager } from '@/utils/toast/toast-manager';
import i18n from '@/i18n';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { FormattedDate } from '@/components/compose/forms';
import { IBaseSSE, SSE_EVENTS, SSE_TYPE } from '@/utils/network/sse/base';
import { EventBus } from '@/utils/network/event.bus';
import {
  IOption,
  SmartSelector,
} from '@/components/common/smart-selector/smart-select';
import { Field, Form } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { DateField } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { PredefinedService } from '@/services/shift/predefined';

const HistoryInfo = ({ memo }: { memo: Memo }) => {
  const [expandedMemoId, setExpandedMemoId] = useState<number | null>(null);
  const memos = useSignal<Memo[]>([]);
  const [files, setFiles] = useState<IFilesMemo[]>([]);
  const [message, setMessage] = useState('');
  const [btnLabel, setBtnLabel] = useState('Check In');
  const [_showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const predefined: Signal<IOption[]> = useSignal([]);
  const [selectedPredefined, setSelectedPredefined] = useState<IOption | null>(
    null
  );
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    fetchInitialData();
    EventBus.on(SSE_TYPE.MEMO, handleMemoSSE);
  }, []);

  const handleMemoSSE = (event: IBaseSSE) => {
    const { name } = event;
    if (name === SSE_EVENTS.CREATE_PARENT) {
      fetchInitialData();
    }
  };

  const fetchInitialData = async () => {
    const [responseMemos, responsePredefined] = await Promise.all([
      MemoService.getMemosByHistory(memo.id.toString()),
      PredefinedService.getPredefined(),
    ]);

    if (responseMemos.getStatus()) {
      // memos.value = responseMemos.getMany();
      const memosData = responseMemos.getMany();
      // TODO: Cambiar esto, porque desde back se puede tener
      memos.value = memosData
        .map((memo) => ({
          ...memo,
          priority:
            memo.priority === 5
              ? 'Alta'
              : memo.priority === 4
                ? 'Media'
                : 'Baja',
        }))
        .sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
    }

    if (responsePredefined.getStatus()) {
      predefined.value = responsePredefined.getMany().map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }

    getStatus(memo?.state || '');
  };

  const getStatus = (state: string) => {
    const statesToSolve = new Set(['OPENED', 'IN_REVISION', 'CREATED']);
    const status = statesToSolve.has(state) ? 'SOLVE' : 'RESOLVED';
    setBtnLabel(status);
  };

  const getLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      return position;
    } catch (error) {
      getErrorGeolocation(error as GeolocationPositionError);
      return null;
    }
  };

  const getErrorGeolocation = (error: GeolocationPositionError) => {
    if (!(error instanceof GeolocationPositionError)) return;

    if (error.code === error.PERMISSION_DENIED) {
      showAlert({
        title: i18n.t('shift.expandable.date.location.title'),
        message: i18n.t('shift.expandable.date.location.message'),
        onConfirm: () => {},
        onCancel: () => {},
      });
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      ToastManager.error(i18n.t('shift.expandable.date.location.gpsMessage'));
    } else {
      ToastManager.error(
        i18n.t('shift.expandable.date.location.timeoutMessage')
      );
    }
  };

  const handleCheck = async () => {
    const position = await getLocation();
    if (!position) return null;

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type: btnLabel === 'SOLVE' ? 'SOLVE' : 'RESOLVED',
    };

    // const response = await MemoService.createCheck(checkData, memo.id);
    await MemoService.createCheck(checkData, memo.id);

    // if (response.getStatus()) {
    //   ToastManager.success(i18n.t('shift.expandable.date.success'));
    // }
  };

  const handleSubmitMessage = async (values: any) => {
    if (!message.trim() && !values.predefined) return;

    let extraData: ExtraData = { ...memo.extraData } as ExtraData;

    if (values.predefined) extraData.predefined = values.predefined;
    if (values.duration) extraData.duration = values.duration;
    if (values.date) extraData.time = values.date;

    const newMemo: Memo = {
      ...memo,
      description: message.trim() ? message : '...',
      priority:
        memo.priority === 'Alta' ? 5 : memo.priority === 'Media' ? 4 : 3,
      updatedAt: DateUtils.dateToBackend(new Date()),
      createdAt: DateUtils.dateToBackend(new Date()),
      resource: {
        images: files[files.length - 1]?.images || [],
        files: files[files.length - 1]?.files || [],
      },
      parentId: memo.id,
      extraData: extraData,
    };

    const response = await MemoService.createMemo(newMemo);

    if (response.getStatus()) {
      // Verificar si el memo ya existe antes de agregarlo
      const newMemoData = response.getOne();
      const exists = memos.value.find((m) => m.id === newMemoData.id);
      if (!exists) {
        memos.value = [...memos.value, newMemoData];
      }
      setFiles([]);
      setMessage('');
      setShowAdditionalInfo(false);
    }
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

  const showFiles = (resource: Resource) => {
    return (
      <div className='px-4 py-2'>
        <div className='flex flex-wrap gap-2 rounded-lg p-2'>
          {(() => {
            interface Attachment {
              url: string;
              name: string;
              type: 'image' | 'file';
            }

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

  const messageHistory = () => {
    return (
      <div className='w-[60%] max-h-[400px] overflow-y-auto vox-scroll-design'>
        <div className='p-4 space-y-3'>
          {memos.value.map((memo: Memo) => (
            <div key={memo.id} className='flex gap-3'>
              <Avatar
                name={
                  memo.user?.name + ' ' + memo.user?.surname || 'Unknown User'
                }
                size='sm'
                square
              />
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-medium text-t-light dark:text-t-dark text-sm'>
                    {memo.user?.name + ' ' + memo.user?.surname ||
                      'Unknown User'}
                  </span>
                  <span className='text-xs text-gray-text-light dark:text-t-dark-light'>
                    <FormattedDate date={memo.updatedAt} format='datetime' />
                  </span>
                </div>
                <div
                  onClick={() =>
                    setExpandedMemoId(
                      expandedMemoId === memo.id ? null : memo.id
                    )
                  }
                >
                  <div className='bg-b-light-light dark:bg-b-dark-dark rounded-lg p-3'>
                    <div className='flex items-start gap-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-sm text-t-light dark:text-t-dark'>
                            {memo.extraData?.predefined?.label}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='vox-icon size-sm vx-icon-113 text-primary' />
                          <span className='text-sm text-t-light dark:text-t-dark'>
                            {memo.description}
                          </span>
                        </div>
                        {memo.extraData && (
                          <div className='flex flex-wrap gap-2 text-xs text-t-light dark:text-t-dark'>
                            {/* {memo.extraData.category && (
                                <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                                  <span className='vox-icon size-sm vx-icon-234 text-primary' />
                                  {memo.extraData.category.label}
                                </span>
                              )}
                              {memo.extraData.resolution && (
                                <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                                  <span className='vox-icon size-sm vx-icon-235 text-primary' />
                                  {memo.extraData.resolution.label}
                                </span>
                              )} */}
                            {memo.extraData.duration && (
                              <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                                <span className='vox-icon size-sm vx-icon-236 text-primary' />
                                {memo.extraData.duration}
                              </span>
                            )}
                            {memo.extraData.time && (
                              <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                                <span className='vox-icon size-sm vx-icon-237 text-primary' />
                                {DateUtils.dateToFrontend(memo.extraData.time, {
                                  format: 'DD/MM/YYYY HH:mm',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                        {memo.attachments && memo.attachments.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {memo.attachments.map((attachment, idx) => (
                              <a
                                key={idx}
                                href={attachment.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center p-1.5 bg-b-white dark:bg-b-dark rounded-md text-xs shadow-sm'
                              >
                                <span className='vox-icon size-sm vx-icon-311 px-1' />
                                <span className='truncate max-w-[120px] text-t-light dark:text-t-dark'>
                                  {attachment.name}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedMemoId === memo.id &&
                    memo.resource &&
                    showFiles(memo.resource)}
                </div>
              </div>
            </div>
          ))}
          {memos.value.length === 0 && (
            <div className='flex justify-center items-center h-20'>
              <p className='text-gray-text-light dark:text-t-dark-light text-sm'>
                No hay Comentarios
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const messageInput = () => {
    return (
      <div className='w-[40%] border-l border-l-b-light-dark dark:border-l-b-dark-dark mt-2'>
        <Form
          onSubmit={handleSubmitMessage}
          render={({ handleSubmit, form }) => (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit();
                form.reset();
                setMessage('');
                setFiles([]);
              }}
            >
              {/* Additional Fields */}
              <div className='flex-1'>
                {/* Attachments Preview */}

                {files.length > 0 && (
                  <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-2'>
                    {files.map((file: any) => showFiles(file))}
                  </div>
                )}

                {/* Additional Fields */}
                <div className='grid grid-cols-1 gap-4'>
                  <div className='p-3'>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='vox-icon size-sm vx-icon-233 text-primary' />
                      <h4 className='text-sm font-medium text-gray-text-light dark:text-t-dark-light'>
                        Formulario de Comentarios
                      </h4>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <Field<IOption> name='predefined'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            name='predefined'
                            id='select-predefined'
                            placeholder='Opciones predefinidas'
                            label='Opciones predefinidas'
                            options={predefined.value}
                            menuPortalTarget={document.body}
                            end={false}
                            onChange={(value?: IOption) => {
                              input.onChange(value);
                              setSelectedPredefined(value || null);
                            }}
                          />
                        )}
                      </Field>

                      <Field<string> name='duration'>
                        {({ input }) => (
                          <Input
                            {...input}
                            type='text'
                            name='duration'
                            label='Duración'
                            placeholder=' min, hh:mm'
                          />
                        )}
                      </Field>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <Field<string> name='date'>
                        {({ input }) => (
                          <DateField {...input} name='date' label='Fecha' />
                        )}
                      </Field>

                      <Field name='attachments'>
                        {() => (
                          <File
                            name='attachments'
                            onChange={handleAttachmentUpload}
                            value={[]}
                            accept='image/*'
                            multiple={true}
                            label='Adjuntos'
                          />
                        )}
                      </Field>
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                      <input
                        type='checkbox'
                        id='showComment'
                        checked={showComment}
                        onChange={(e) =>
                          setShowComment((e.target as HTMLInputElement).checked)
                        }
                        className='rounded border-gray-300 text-primary focus:ring-primary'
                      />
                      <label
                        htmlFor='showComment'
                        className='text-sm text-gray-text-light dark:text-t-dark-light'
                      >
                        Agregar comentario adicional
                      </label>
                    </div>
                    <div
                      className={`gap-3 w-full ${showComment ? 'visible' : 'invisible'}`}
                    >
                      <Field<string> name='message'>
                        {({}) => (
                          <TextArea
                            label='Comentario'
                            name='message'
                            placeholder='Escribe un Comentario...'
                            value={message}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                              setMessage(
                                (e.target as HTMLTextAreaElement).value
                              )
                            }
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
                <div className='w-full flex justify-end px-2'>
                  <Button
                    name='memo-send-response'
                    type='submit'
                    disabled={!message.trim() && !selectedPredefined}
                    label='Enviar'
                    icon='311'
                    className='w-full'
                  />
                </div>
              </div>
            </form>
          )}
        />
      </div>
    );
  };

  return (
    <div className='w-full rounded-lg bg-b-white-light dark:bg-b-dark-light border border-b-light-dark dark:border-b-dark-light shadow-sm h-[500px]'>
      <div className='flex items-center justify-between gap-4 p-0 border-b border-b-light-dark dark:border-b-dark-dark max-h-20'>
        <div className='flex-1 rounded-lg'>
          {memo.resource && showFiles(memo.resource)}
        </div>

        {/* Info Section - Right */}
        <div className='flex items-center gap-4'>
          {/* Action Button */}
          {memo.state != 'IN_REVISION' && memo.state != 'CREATED' && (
            <div className='flex items-center h-[72px]'>
              <Button
                label={btnLabel}
                icon={
                  btnLabel === 'SOLVE' || btnLabel === 'RESOLVED'
                    ? '023'
                    : '024'
                }
                disabled={btnLabel === 'RESOLVED'}
                onClick={() =>
                  showAlert({
                    title: btnLabel,
                    message: `¿Está seguro de que desea realizar el ${btnLabel}?`,
                    onConfirm: () => handleCheck(),
                    onCancel: () => {},
                  })
                }
                name={btnLabel}
              />
            </div>
          )}

          {/* Dates Section */}
          <div className='flex items-center gap-2 rounded-lg p-0 shadow-sm h-[40px] min-w-[140px]'>
            <div className='w-1 h-full bg-primary rounded-full' />
            <div>
              <p className='font-medium text-t-light dark:text-t-dark text-xs'>
                Creación
              </p>
              <p className='text-xs text-gray-text-light dark:text-t-dark-light'>
                <FormattedDate date={memo.createdAt} format='datetime' />
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 rounded-lg p-0 shadow-sm h-[40px] min-w-[140px]'>
            <div className='w-1 h-full bg-primary rounded-full' />
            <div>
              <p className='font-medium text-t-light dark:text-t-dark text-xs'>
                Actualización
              </p>
              <p className='text-xs text-gray-text-light dark:text-t-dark-light'>
                <FormattedDate date={memo.updatedAt} format='datetime' />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row'>
        {messageHistory()}
        {messageInput()}
      </div>
    </div>
  );
};

export default HistoryInfo;
