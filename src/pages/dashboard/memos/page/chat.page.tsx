import { FunctionComponent } from 'preact';
// import { ChatHeader } from '../components/chat.header';
import { ChatCard } from '../components/chat.card';
import { ChatMessage } from '../components/chat.message';
import { ChatInput } from '../components/chat.input';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { IUserResponse } from '@/types/auth';
import { Chats, FrequentQuestion } from '../interface';
import { useWebSocket } from '@/utils/socket';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';
import { IMessage } from '@/utils/socket/interface';
import { useEffect, useState } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { MemoService } from '@/services';
import { ExtraData, Memo } from '../utils/memos';
import { DateUtils } from '@/utils/utilities/dates';
import { Field, Form } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { PredefinedService } from '@/services/shift/predefined';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { DateField } from '@/components/compose/forms';
import { IPresignedRequest } from '@/types/file';
import { File } from '@/components/common/file/file';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import ShowFiles from '@/components/common/file/show.file';
import { showAlert } from '@/components/common/show-alert/show-alert';
import i18n from '@/i18n';

interface IOption {
  label: string;
  value: string | number;
}

interface ChatMessage {
  message: string;
  isSender: boolean;
  from: string;
  to: string;
}

interface ChatViewProps {
  users: IUserResponse[];
  getUsersHandler: (page: number) => void;
  memosGroupedByService: any[];
  memosGroupedByUser: any[];
}

export enum TypeChatView {
  USERS = 'users',
  USERS_MEMO = 'users_memo',
  SERVICES_MEMO = 'services_memo',
}

const FrequentQuestions = () => {
  const { t } = useTranslation();
  const questions: FrequentQuestion[] = [
    { id: 1, question: t('memos.frequentQuestions.question1') },
    { id: 2, question: t('memos.frequentQuestions.question2') },
    { id: 3, question: t('memos.frequentQuestions.question3') },
  ];

  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      {questions.map((q) => (
        <div
          key={q.id}
          className='rounded-full px-4 py-2 cursor-pointer bg-b-light-dark dark:bg-b-dark-light border border-b-light-dark dark:border-b-dark-light'
        >
          {q.question}
        </div>
      ))}
    </div>
  );
};

export const ChatView: FunctionComponent<ChatViewProps> = ({
  users,
  getUsersHandler,
  memosGroupedByService,
  memosGroupedByUser,
}) => {
  const { t } = useTranslation();
  const { cognito } = useUserStore();
  const wsManager = useWebSocket();
  const userSelected = useSignal<IUserResponse | undefined>();
  const currentPage = useSignal<number>(1);
  const totalPages = useSignal<number>(3);
  const selectedChat = useSignal<string>('0');
  const chats = useSignal<Chats>({});
  const viewMode = useSignal<TypeChatView>(TypeChatView.USERS);
  const memoByService = useSignal<any[]>([]);
  const memoByUser = useSignal<any[]>([]);
  const predefined = useSignal<IOption[]>([]);
  const replyToId = useSignal<number | undefined>();
  const replyToMessage = useSignal<
    { message: string; title?: string; date?: string | Date } | undefined
  >();
  const messages = useSignal<string>('');
  const files = useSignal<IPresignedRequest[]>([]);
  const [btnLabel, setBtnLabel] = useState('Check In');

  useEffect(() => {
    fetchPredefinedOptions();
  }, []);

  const fetchPredefinedOptions = async () => {
    const responsePredefined = await PredefinedService.getPredefined();
    if (responsePredefined.getStatus()) {
      predefined.value = responsePredefined.getMany().map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    }
  };

  useEffect(() => {
    wsManager.addListener('memos', handleReceiveMessage);
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

  useEffect(() => {
    // Reset pagination when view mode changes
    currentPage.value = 1;
    totalPages.value = viewMode.value === 'users' ? 3 : 1;
  }, [viewMode.value]);

  useEffect(() => {
    // Reset reply values when view mode changes
    replyToId.value = undefined;
    replyToMessage.value = undefined;
    messages.value = '';
    files.value = [];
    // Set selected chat to AI assistant
    selectedChat.value = '0';
    userSelected.value = undefined;
  }, [viewMode.value]);

  useEffect(() => {
    if (replyToId.value) {
      const memo =
        viewMode.value === TypeChatView.SERVICES_MEMO
          ? memoByService.value.find((m) => m.id === replyToId.value)
          : memoByUser.value.find((m) => m.id === replyToId.value);

      if (memo) {
        getStatus(memo.state);
      }
    }
  }, [replyToId.value, memoByService.value, memoByUser.value]);

  const handleReceiveMessage = (message: IMessage) => {
    chats.value = addMessageArray(message.from, message);
  };

  const addMessageArray = (
    sender: string,
    message: IMessage,
    isSender: boolean = false
  ) => {
    const newChats = { ...chats.value };

    if (!newChats[sender]) {
      newChats[sender] = {
        new: 1,
        messages: [
          {
            message: message.message,
            from: message.from,
            to: message.to,
            isSender: isSender,
          },
        ],
      };
    } else {
      newChats[sender] = {
        new: isSender ? newChats[sender].new : newChats[sender].new + 1,
        messages: [
          ...newChats[sender].messages,
          {
            message: message.message,
            from: message.from,
            to: message.to,
            isSender: isSender,
          },
        ],
      };
    }

    return newChats;
  };

  const handleSendMessage = (message: string, replyId?: number) => {
    if (!cognito || !userSelected.value?.cognitoId) {
      ToastManager.error('El mensaje tiene mala estructura');
      return;
    }
    const objMessage: IMessage = {
      from: cognito,
      to: userSelected.value?.cognitoId,
      message,
      replyTo: replyId,
    };
    wsManager.sendMessage(objMessage);

    chats.value = addMessageArray(objMessage.to, objMessage, true);
    replyToId.value = undefined;
    replyToMessage.value = undefined;
  };

  const handleReply = (
    id: number,
    message: string,
    title?: string,
    date?: string | Date
  ) => {
    if (replyToId.value === id) {
      replyToId.value = undefined;
      replyToMessage.value = undefined;
      return;
    }
    replyToId.value = id;
    replyToMessage.value = { message, title, date };
  };

  const handleCancelReply = () => {
    replyToId.value = undefined;
    replyToMessage.value = undefined;
  };

  const handleNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
      getUsersHandler(currentPage.value);
    }
  };

  const handlePrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
      getUsersHandler(currentPage.value);
    }
  };

  const handleChatSelect = async (
    id: string,
    view: TypeChatView = TypeChatView.USERS
  ): Promise<void> => {
    selectedChat.value = id;
    userSelected.value = users.find((user) => user.cognitoId === id);
    viewMode.value = view;

    if (view === TypeChatView.SERVICES_MEMO) {
      const response = await MemoService.get_all_by_service_id(id);
      if (!response.getStatus()) return;
      memoByService.value = response.getMany().map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
      }));
    }

    if (view === TypeChatView.USERS_MEMO) {
      const response = await MemoService.get_all_by_user_id(id);
      if (!response.getStatus()) return;
      memoByUser.value = response.getMany().map((memo) => ({
        ...memo,
        priority:
          memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja',
      }));
    }
  };

  const handleSubmitMessage = async (values: any) => {
    let memo: Memo = memoByService.value.find((e) => e.id == replyToId.value);
    let extraData: ExtraData = { ...memo.extraData } as ExtraData;

    if (values.predefined) extraData.predefined = values.predefined;
    if (values.duration) extraData.duration = values.duration;
    if (values.date) extraData.time = values.date;

    const newMemo: Memo = {
      ...memo,
      description: messages.value.trim() ? messages.value : '...',
      priority:
        memo.priority === 'Alta' ? 5 : memo.priority === 'Media' ? 4 : 3,
      updatedAt: DateUtils.dateToBackend(new Date()),
      createdAt: DateUtils.dateToBackend(new Date()),
      resource: files.value && files.value.length > 0 ? files.value : undefined,
      parentId: memo.id,
      extraData: extraData,
    };

    await MemoService.createMemo(newMemo);
    replyToId.value = undefined;
    replyToMessage.value = undefined;
    messages.value = '';
    handleChatSelect(selectedChat.value, viewMode.value);
  };

  const handleAttachmentUpload = (e: any) => {
    const fileInput: IPresignedRequest = e.target.value[0];
    files.value = [...files.value, fileInput];
  };

  const chatCardGroupedBy = () => (
    <>
      <ChatCard
        id={'0'}
        name={t('memos.chat.aiAssistant')}
        lastMessage={t('memos.chat.aiDefaultMessage')}
        time={t('memos.chat.time')}
        isAI
        onClick={handleChatSelect}
        isSelected={selectedChat.value === '0'}
      />
      <div className='flex-1 overflow-y-auto vox-scroll-design border-b-light-dark dark:border-b-dark-light'>
        {viewMode.value === TypeChatView.USERS &&
          users.map((user: IUserResponse) => (
            <ChatCard
              user={user}
              key={`chat-card-${user.cognitoId}`}
              id={user.cognitoId}
              name={`${user.name} ${user.surname}`}
              lastMessage={`${cognito === user.cognitoId ? 'SOY YO' : 'OTRO'}`}
              time='10:15'
              amount={chats.value[user.cognitoId]?.new}
              onClick={handleChatSelect}
              isSelected={selectedChat.value === user.cognitoId}
            />
          ))}

        {viewMode.value == TypeChatView.SERVICES_MEMO &&
          memosGroupedByService.map((service: any) => (
            <ChatCard
              key={`service-card-${service.service.id}`}
              id={service.service.id}
              name={service.service.name}
              lastMessage={service.service.description || ''}
              time={service.service.time || ''}
              amount={service.service.unreadCount}
              onClick={() => {
                handleChatSelect(
                  service.service.id,
                  TypeChatView.SERVICES_MEMO
                );
              }}
              isSelected={selectedChat.value === service.service.id}
            />
          ))}

        {viewMode.value == TypeChatView.USERS_MEMO &&
          memosGroupedByUser.map((value: any) => (
            <ChatCard
              key={`user-card-${value.user.id}`}
              id={value.user.id}
              name={value.user.name}
              lastMessage={value.user.description || ''}
              time={value.user.time || ''}
              amount={value.user.unreadCount}
              onClick={() => {
                handleChatSelect(value.user.id, TypeChatView.USERS_MEMO);
              }}
              isSelected={selectedChat.value === value.user.id}
            />
          ))}
      </div>
    </>
  );

  const showChatMemoAndSubMemo = (memo: Memo, index: number) => {
    return (
      <>
        {/* Memo principal */}
        <ChatMessage
          key={`parent-${index}`}
          message={memo.description}
          isSender={false}
          title={memo.novelty?.name}
          resource={memo.resource}
          date={memo.updatedAt}
          priority={memo.priority}
          id={memo.id}
          onReply={(id) =>
            handleReply(
              id,
              memo.novelty?.description || '',
              memo.novelty?.name,
              memo.updatedAt
            )
          }
          isSelected={replyToId.value === memo.id}
          status={memo.state}
        >
          <div className='flex items-center gap-2 text-xs my-2'>
            <span className='vox-icon size-sm vx-icon-318' />
            <span>
              {memo.user?.name} {memo.user?.surname}
            </span>
            {memo.relatedShiftId && (
              <>
                <span className='mx-1'>•</span>
                <span className='vox-icon size-sm vx-icon-239' />
                <span>Shift ID: {memo.relatedShiftId}</span>
                {memo.user?.isSupervisor && memo.relatedShift && (
                  <span className='ml-1'>({memo.relatedShift.name})</span>
                )}
              </>
            )}
          </div>
        </ChatMessage>
        {/* Submemos */}
        {memo.children?.map((childMemo: Memo, childIndex: number) => (
          <ChatMessage
            key={`child-${index}-${childIndex}`}
            message={childMemo.description}
            isSender={true}
            title={childMemo.extraData?.predefined?.label}
            resource={childMemo.resource}
            date={childMemo.updatedAt}
          >
            <div className='items-center gap-2 text-xs my-2 flex flex-row'>
              <span className='vx-icon size-sm vx-icon-318 dark:text-white' />
              <span>
                {childMemo.user?.name} {childMemo.user?.surname}
              </span>
              {childMemo.extraData && (
                <>
                  {childMemo.extraData.duration && (
                    <span className='flex items-center gap-1 px-2 py-1 rounded-md'>
                      <span className='vox-icon size-sm vx-icon-236' />
                      {'duracion: ' + childMemo.extraData.duration}
                    </span>
                  )}
                  {childMemo.extraData.time && (
                    <span className='flex items-center gap-1 px-2 py-1 rounded-md'>
                      <span className='vox-icon size-sm vx-icon-237' />
                      {'fecha: ' +
                        DateUtils.dateToFrontend(childMemo.extraData.time, {
                          format: 'DD/MM/YYYY HH:mm',
                        })}
                    </span>
                  )}
                </>
              )}
            </div>
          </ChatMessage>
        ))}
      </>
    );
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
    if (!replyToId.value) return;

    const position = await getLocation();
    if (!position) return null;

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type: btnLabel === 'SOLVE' ? 'SOLVE' : 'RESOLVED',
    };

    await MemoService.createCheck(checkData, replyToId.value);
    handleChatSelect(selectedChat.value, viewMode.value);
  };

  const formMinutesByInputs = () => (
    <>
      <Form
        onSubmit={handleSubmitMessage}
        render={({ handleSubmit }) => (
          <form
            id='chat-input-form'
            name='chat-input-form'
            onSubmit={handleSubmit}
          >
            <div className='grid grid-cols-1 gap-4'>
              <div className='p-3'>
                <div className='grid grid-cols-3 gap-3'>
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
                        }}
                      />
                    )}
                  </Field>

                  <Field<string> name='duration'>
                    {({ input }) => (
                      <Input
                        {...input}
                        type='number'
                        name='duration'
                        label='Duración'
                        placeholder='Min'
                      />
                    )}
                  </Field>

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
                        area='memo'
                      />
                    )}
                  </Field>

                  {files.value.length > 0 && (
                    <div className='flex items-center gap-2'>
                      <ShowFiles resources={files.value} />
                    </div>
                  )}

                  {replyToId.value && (
                    <div className='flex items-center gap-2'>
                      <Button
                        label={btnLabel}
                        icon={
                          btnLabel === 'SOLVE' || btnLabel === 'RESOLVED'
                            ? '030'
                            : '032'
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
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </>
  );

  return (
    <>
      <div className='w-full flex flex-col h-full'>
        <div className='flex flex-1 overflow-y-auto border-t border-b-light-dark dark:border-b-dark-light'>
          <div className='w-[30%] flex flex-col h-full border-r border-b-light-dark dark:border-b-dark-light'>
            <div className='p-4 border-b border-b-light-dark dark:border-b-dark-light'>
              <div className='flex gap-2 items-center'>
                <Button
                  name='users'
                  icon='321'
                  borderless
                  onClick={() => (viewMode.value = TypeChatView.USERS)}
                  label={t('memos.view.users')}
                />
                <Dropdown
                  name='view-mode'
                  options={[
                    {
                      label: t('memos.chat.view.users'),
                      value: TypeChatView.USERS_MEMO,
                      icon: '321',
                    },
                    {
                      label: t('memos.chat.view.services'),
                      value: TypeChatView.SERVICES_MEMO,
                      icon: '321',
                    },
                  ]}
                  selectedTag={t('memos.chat.view.select')}
                  onChange={(value) => {
                    viewMode.value =
                      value === TypeChatView.USERS_MEMO
                        ? TypeChatView.USERS_MEMO
                        : TypeChatView.SERVICES_MEMO;
                  }}
                />
              </div>
            </div>
            {/* Chat info card grouped by */}
            {chatCardGroupedBy()}
            {/* Chat pagination */}
            <div className='flex justify-between items-center p-4 border-t border-r dark:border-b-dark-light border-b-light-dark'>
              <Button
                name={t('memos.pagination.previous')}
                onClick={handlePrevPage}
                disabled={currentPage.value === 1}
                icon='014'
                label={t('memos.pagination.previous')}
              />
              <span className='text-sm text-gray-500'>
                {t('memos.pagination.page')} {currentPage.value}{' '}
                {t('memos.pagination.of')} {totalPages.value}
              </span>
              <Button
                name={t('memos.pagination.next')}
                onClick={handleNextPage}
                disabled={currentPage.value >= totalPages.value}
                icon='015'
                label={t('memos.pagination.next')}
              />
            </div>
          </div>

          <div className='w-[70%] flex flex-col'>
            <div className='flex-1 overflow-y-auto p-4 vox-scroll-design'>
              {selectedChat.value === '0' && <FrequentQuestions />}
              {selectedChat.value === '0' &&
                chats.value[selectedChat.value]?.messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.message}
                    isSender={msg.isSender}
                  />
                ))}
              {selectedChat.value !== '0' &&
                viewMode.value == TypeChatView.SERVICES_MEMO &&
                memoByService.value.map((memo: Memo, index) =>
                  showChatMemoAndSubMemo(memo, index)
                )}
              {selectedChat.value !== '0' &&
                viewMode.value == TypeChatView.USERS_MEMO &&
                memoByUser.value.map((memo: Memo, index) =>
                  showChatMemoAndSubMemo(memo, index)
                )}
            </div>
            {viewMode.value === TypeChatView.USERS ? (
              <ChatInput onSend={handleSendMessage} input={messages} />
            ) : (
              <ChatInput
                onSend={handleSendMessage}
                onCancelReply={handleCancelReply}
                input={messages}
                disabled={replyToId.value === undefined}
                replyId={replyToId.value}
                replyTo={replyToMessage.value}
                form='chat-input-form'
              >
                {formMinutesByInputs()}
              </ChatInput>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
