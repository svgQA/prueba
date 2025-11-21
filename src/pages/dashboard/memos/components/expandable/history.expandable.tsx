import { useEffect, useState } from 'preact/hooks';
import { Memo, ExtraData } from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import { MemoService } from '@/services';
import { File } from '@/components/common/file/file';
import { TextArea } from '@/components/common/text.area/text.area';
import { Signal, useSignal } from '@preact/signals';
import { Button } from '@/components/common/button/button';
import { ToastManager } from '@/utils/toast/toast-manager';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { FormattedDate } from '@/components/compose/forms';
import {
  IOption,
  SmartSelector,
} from '@/components/common/smart-selector/smart-select';
import { Field, Form } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { DateField } from '@/components/compose/forms';
import { DateUtils } from '@/utils/utilities/dates';
import { PredefinedService } from '@/services/shift/predefined';
import { IPresignedRequest } from '@/types/file';
import ShowFiles from '@/components/common/file/show.file';
import { IPanic } from '@/components/common/panic/utils/interface';
import { PanicService } from '@/services/memo/panic';
import { Badge } from '@/components/common/badge/badge';
import { useTranslation } from 'react-i18next';
import { required } from '@/utils/utilities';

import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  MessageEvent,
  MESSAGE_LISTENERS,
  SOCKET_MESSAGE_EVENTS,
} from '@/utils/socket/manager/types';
import { getPermissionByModuleState } from '@/store/signals/access/permission';

const HistoryInfo = ({ memo }: { memo: Memo }) => {
  const { t } = useTranslation();
  const [expandedMemoId, setExpandedMemoId] = useState<number | null>(null);
  const memos = useSignal<Memo[]>([]);
  const files = useSignal<IPresignedRequest[]>([]);
  const [btnLabel, setBtnLabel] = useState('Check In');
  const predefined: Signal<IOption[]> = useSignal([]);
  const panic = useSignal<IPanic[]>([]);
  const disable =
    memo.state === 'RESOLVED' || !getPermissionByModuleState('memo', 'close');
  const loading = useSignal<boolean>(false);
  const status = useSignal<string | undefined>(memo.state);

  useEffect(() => {
    fetchInitialData();
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.MEMOS,
      handleMessage,
      MESSAGE_LISTENERS.MEMO_HISTORY
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.MEMOS,
        MESSAGE_LISTENERS.MEMO_HISTORY
      );
    };
  }, []);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name, message } = event.payload;
    if (
      name === SOCKET_MESSAGE_EVENTS.CREATE_PARENT ||
      name === SOCKET_MESSAGE_EVENTS.PANIC
    ) {
      fetchInitialData();
    }

    if (name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK) {
      if (memo.id !== Number(message.id)) return;
      status.value = message.state;
    }
  };

  const fetchInitialData = async () => {
    const [responseMemos, responsePredefined, responsePanic] =
      await Promise.all([
        MemoService.getMemosByHistory(memo.id.toString()),
        PredefinedService.getPredefined(),
        PanicService.get_all_panic_by_user(memo.user?.id.toString()),
      ]);

    if (responseMemos.getStatus()) {
      // memos.value = responseMemos.getMany();
      const memosData = responseMemos.getMany();
      // TODO: Cambiar esto, porque desde back se puede tener
      memos.value = memosData.map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
      }));
    }

    if (responsePredefined.getStatus()) {
      predefined.value = responsePredefined.getMany().map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      predefined.value = [
        ...predefined.value,
        { label: 'Otro', value: 'other' },
      ];
    }

    if (responsePanic.getStatus()) {
      panic.value = responsePanic.getMany();
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
        title: t('i_location_title'),
        message: t('i_location_message'),
        onConfirm: () => {},
        onCancel: () => {},
      });
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      ToastManager.error('s_gps_error');
    } else {
      ToastManager.error('s_gps_timeout');
    }
  };

  const handleCheck = async () => {
    try {
      const position = await getLocation();
      if (!position) return null;

      const checkData = {
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
        date: new Date().toISOString(),
        platform: 'web',
        type: btnLabel === 'SOLVE' ? 'SOLVE' : 'RESOLVED',
      };

      const response = await MemoService.createCheck(checkData, memo.id);
      // await MemoService.createCheck(checkData, memo.id);

      if (response.getStatus()) {
        ToastManager.success(t('shift.expandable.date.success'));
      }
    } finally {
      loading.value = false;
    }
  };

  const handleSubmitMessage = async (values: any, form: any) => {
    loading.value = true;
    try {
      let lastMemo: Omit<Memo, 'resource'> = memo;
      let extraData: ExtraData = { ...memo.extraData } as ExtraData;

      if (!values.message.trim() && !values.predefined) return;
      if (values.predefined && values.predefined.value !== 'other')
        extraData.predefined = values.predefined;
      if (values.duration) extraData.duration = values.duration;
      if (values.date) extraData.time = values.date;

      const newMemo: Memo = {
        // ...lastMemo -> No poner, porque son cosas que no corresponde
        // al memo que se desea crear, para eso existe la asociacion
        description: values.message.trim() ? values.message : '...',
        priority:
          lastMemo.priority === 'Alta'
            ? 5
            : lastMemo.priority === 'Media'
              ? 4
              : 3,
        date: DateUtils.dateToBackend(new Date()),
        // TODO: Corregir estas porque son las coordenadas del browser
        latitude: lastMemo.latitude,
        longitude: lastMemo.longitude,
        parentId: lastMemo.id,
        extraData: extraData,
        resource:
          files.value && files.value.length > 0 ? files.value : undefined,
      };

      const response = await MemoService.createMemo(newMemo);

      if (response.getStatus()) {
        form.reset();
        files.value = [];
        fetchInitialData();
        ToastManager.success('Se a envió la respuesta correctamente');
      }
    } finally {
      loading.value = false;
    }
  };

  const handleAttachmentUpload = (e: any) => {
    const fileInput: IPresignedRequest = e.target.value[0];
    files.value = [...files.value, fileInput];
  };

  const messageHistory = () => {
    return (
      <div
        className={`w-[60%] max-h-[250px] overflow-y-auto vox-scroll-design`}
      >
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
                    <FormattedDate
                      date={memo.updatedAt as string}
                      format='datetime'
                    />
                  </span>
                </div>
                <div className='rounded-lg px-3 py-2 relative'>
                  {memo.resource && memo?.resource?.length > 0 && (
                    <div className='absolute top-0 right-0'>
                      <Button
                        name='memo-expand-data'
                        transparent
                        icon='321'
                        borderless
                        onClick={() =>
                          setExpandedMemoId(
                            expandedMemoId === memo.id ? null : memo.id
                          )
                        }
                      ></Button>
                    </div>
                  )}
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
                      {memo?.extraData && (
                        <div className='flex flex-wrap gap-2 text-xs text-t-light dark:text-t-dark'>
                          {memo?.extraData?.duration && (
                            <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                              <span className='vox-icon size-sm vx-icon-236 text-primary' />
                              {memo?.extraData?.duration}
                            </span>
                          )}
                          {memo?.extraData?.time && (
                            <span className='flex items-center gap-1 bg-b-white dark:bg-b-dark px-2 py-1 rounded-md'>
                              <span className='vox-icon size-sm vx-icon-237 text-primary' />
                              <FormattedDate
                                date={memo?.createdAt as string}
                                format='datetime'
                              />
                            </span>
                          )}
                        </div>
                      )}
                      {memo?.attachments && memo?.attachments?.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {memo?.attachments.map(
                            (attachment: any, idx: number) => (
                              <a
                                key={idx}
                                href={attachment?.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center p-1.5 bg-b-white dark:bg-b-dark rounded-md text-xs shadow-sm'
                              >
                                <span className='vox-icon size-sm vx-icon-311 px-1' />
                                <span className='truncate max-w-[120px] text-t-light dark:text-t-dark'>
                                  {attachment?.name}
                                </span>
                              </a>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {expandedMemoId === memo.id && memo.resource && (
                  <ShowFiles resources={memo.resource} />
                )}
              </div>
            </div>
          ))}
          {memos?.value?.length === 0 && (
            <div className='flex justify-center items-center h-20'>
              <p className='text-gray-text-light dark:text-t-dark-light text-sm'>
                {t('i_comment')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const removeFile = (uuid: string) => {
    files.value = files.value.filter((file) => file.uuid !== uuid);
  };

  const calculateInitialDuration = () => {
    const startDate = memo.updatedAt ?? memo.createdAt;
    const timeDifference = DateUtils.getTimeDifference(
      startDate as Date | string,
      DateUtils.nowUTCDate()
    );
    const totalMinutes = timeDifference.hours * 60 + timeDifference.minutes;
    return totalMinutes;
  };

  const messageInput = () => {
    return (
      <div
        className={`w-[40%] max-h-[250px] overflow-y-hidden border-l border-l-b-light-dark dark:border-l-b-dark-dark`}
      >
        <Form
          onSubmit={handleSubmitMessage}
          initialValues={{
            duration: calculateInitialDuration(),
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} id='form-message-memo'>
              <fieldset
                disabled={disable}
                style={{ border: 0, padding: 0, margin: 0 }}
              >
                <div className='flex-1'>
                  <div className='grid grid-cols-1 gap-4 '>
                    <div className='p-3'>
                      <div className='grid grid-cols-2 gap-2'>
                        <Field<IOption> name='predefined'>
                          {({ input, meta }) => (
                            <SmartSelector
                              {...input}
                              meta={meta}
                              name='predefined'
                              id='select-predefined'
                              placeholder='p_predefined'
                              label='p_predefined'
                              options={predefined.value}
                              menuPortalTarget={document.body}
                              allowAll={true}
                              onChange={(value?: IOption) => {
                                input.onChange(value);
                              }}
                              disabled={disable}
                            />
                          )}
                        </Field>

                        <Field<string> name='duration'>
                          {({ input }) => {
                            return (
                              <Input
                                disabled={true}
                                {...input}
                                type='number'
                                name='duration'
                                label='h_duration'
                                placeholder='min'
                              />
                            );
                          }}
                        </Field>
                      </div>
                      <div className='grid grid-cols-2 gap-2'>
                        <Field<string> name='date'>
                          {({ input }) => {
                            return (
                              <DateField
                                {...input}
                                name='date'
                                label='h_date'
                                defaultToNow={true}
                                disabled={true}
                                type='datetime-local'
                              />
                            );
                          }}
                        </Field>

                        <Field name='attachments'>
                          {() => (
                            <File
                              name='attachments'
                              onChange={handleAttachmentUpload}
                              value={[]}
                              accept='image/*, video/*'
                              multiple={true}
                              label='h_attachment'
                              area='memo'
                              showFiles={false}
                              disabled={disable}
                            />
                          )}
                        </Field>
                      </div>
                      <div
                        className={`grid ${files.value.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}
                      >
                        <Field<string> name='message' validate={required}>
                          {({ input }) => (
                            <TextArea
                              name={input.name}
                              value={input.value}
                              onChange={input.onChange}
                              onBlur={input.onBlur}
                              onFocus={input.onFocus}
                              placeholder='p_comment'
                              disabled={disable}
                            />
                          )}
                        </Field>
                        <ShowFiles
                          resources={files.value}
                          removeFile={removeFile}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          )}
        />
      </div>
    );
  };

  const showDate = (
    title: string,
    date: string | Date,
    format: 'date' | 'datetime' | 'time'
  ) => (
    <div className='flex items-center gap-2 rounded-lg p-0 h-[40px] min-w-[140px]'>
      <div className='w-1 h-full bg-primary rounded-full' />
      <div>
        <p className='font-medium text-t-light dark:text-t-dark text-xs'>
          {t(title)}
        </p>
        <p className='text-xs text-gray-text-light dark:text-t-dark-light'>
          <FormattedDate date={date} format={format} />
        </p>
      </div>
    </div>
  );

  return (
    <div className='w-full rounded-lg bg-b-white-light max-h-[450px]'>
      <div className='flex items-center justify-between gap-1 border-b border-b-light-dark dark:border-b-dark max-h-20 w-full dark:bg-b-dark-dark bg-b-light-dark rounded-lg'>
        <div className='flex-1 rounded-lg ml-5 w-7/12'>
          {memo.resource && <ShowFiles resources={memo.resource} />}
        </div>

        <div className='flex flex-col gap-2 w-2/12'>
          {memo.panicUuuid && panic.value.length > 0 && (
            <Badge
              label='panic_button'
              icon='020'
              status='error'
              full
              outline
            />
          )}
        </div>

        <div className='flex items-center gap-4 w-5/12 flex-row justify-between px-3'>
          {status.value != 'IN_REVISION' && status.value != 'CREATED' && (
            <Button
              name='btn-check-memo'
              label={status.value === 'OPENED' ? 'SOLVE' : 'RESOLVED'}
              icon='030'
              disabled={status.value === 'RESOLVED'}
              onClick={() =>
                showAlert({
                  title: status.value ? `${t(status.value)}` : '',
                  message: `${t('message_confirm')}`,
                  onConfirm: () => handleCheck(),
                  onCancel: () => {},
                })
              }
              loading={loading.value}
              permissions={{ name: 'memo', state: 'close' }}
            />
          )}

          {memo.createdAt && showDate('h_created', memo.createdAt, 'datetime')}
          {memo.updatedAt &&
            memo.createdAt &&
            showDate(
              'h_updated',
              memo.updatedAt != null ? memo.updatedAt : memo.createdAt,
              'datetime'
            )}

          <Button
            name='memo-send-response'
            form='form-message-memo'
            type='submit'
            disabled={disable}
            label='send'
            icon='311'
            loading={loading.value}
            permissions={{ name: 'memo', state: 'comment' }}
          />
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
