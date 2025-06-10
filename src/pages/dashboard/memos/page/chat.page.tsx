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
import { useEffect } from 'preact/hooks';
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
}

export enum TypeChatView {
  USERS = 'users',
  SERVICES = 'services',
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
  memosGroupedByService
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
  const predefined = useSignal<IOption[]>([]);
  const replyToId = useSignal<number | undefined>();
  const replyToMessage = useSignal<{ message: string; title?: string; date?: string | Date } | undefined>();
  const messages = useSignal<string>('');
  const serviceId = useSignal<string>('');
  const files = useSignal<IPresignedRequest[]>([]);

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
      replyTo: replyId
    };
    wsManager.sendMessage(objMessage);

    chats.value = addMessageArray(objMessage.to, objMessage, true);
    replyToId.value = undefined;
    replyToMessage.value = undefined;
  };

  const handleReply = (id: number, message: string, title?: string, date?: string | Date) => {
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
    chatId: string,
    isService: boolean = false
  ): Promise<void> => {
    selectedChat.value = chatId;
    userSelected.value = users.find((user) => user.cognitoId === chatId);

    if (isService) {
      const response = await MemoService.get_all_by_service_id(chatId);
      if (!response.getStatus()) return;
      memoByService.value = response.getMany().map((memo) => ({ ...memo, priority: memo.priority === 5 ? 'Alta' : memo.priority === 4 ? 'Media' : 'Baja' }));
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
      resource: (files.value && files.value.length > 0) ? files.value : undefined,
      parentId: memo.id,
      extraData: extraData,
    };

    await MemoService.createMemo(newMemo);
    replyToId.value = undefined;
    replyToMessage.value = undefined;
    messages.value = '';
    handleChatSelect(serviceId.value, true);
  };

  const handleAttachmentUpload = (e: any) => {
    const fileInput: IPresignedRequest = e.target.value[0];
    files.value = [...files.value, fileInput];
  };

  return (
    <>
      <div className='w-full flex flex-col h-full'>
        <div className='flex flex-1 overflow-y-auto border-t border-b-light-dark dark:border-b-dark-light'>
          <div className='w-[30%] flex flex-col h-full border-r border-b-light-dark dark:border-b-dark-light'>
            <div className='p-4 border-b border-b-light-dark dark:border-b-dark-light'>
              <div className='flex gap-2'>
                <Button
                  name='users'
                  icon='321'
                  onClick={() => (viewMode.value = TypeChatView.USERS)}
                  className={`flex-1 ${viewMode.value === TypeChatView.USERS ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
                  label={t('memos.view.users')}
                />
                <Button
                  icon='113'
                  name='services'
                  onClick={() => (viewMode.value = TypeChatView.SERVICES)}
                  className={`flex-1 ${viewMode.value === TypeChatView.SERVICES ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
                  label={t('memos.view.services')}
                />
              </div>
            </div>
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
              {viewMode.value === 'users'
                ? users.map((user: IUserResponse) => (
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
                ))
                : memosGroupedByService.map((service: any) => (
                  <ChatCard
                    key={`service-card-${service.service.id}`}
                    id={service.service.id}
                    name={service.service.name}
                    lastMessage={service.service.description || ''}
                    time={service.service.time || ''}
                    amount={service.service.unreadCount}
                    onClick={() => {
                      handleChatSelect(service.service.id, true)
                      serviceId.value = service.service.id;
                    }}
                    isSelected={selectedChat.value === service.service.id}
                  />
                ))}
            </div>
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
                memoByService.value.map((memo: Memo, index) => (
                  <>
                    {/* Memo principal */}
                    <ChatMessage
                      key={`parent-${index}`}
                      message={`${memo.novelty?.description || ''}`}
                      isSender={false}
                      title={memo.novelty?.name}
                      resource={memo.resource}
                      date={memo.updatedAt}
                      priority={memo.priority}
                      id={memo.id}
                      onReply={(id) => handleReply(id, memo.novelty?.description || '', memo.novelty?.name, memo.updatedAt)}
                      isSelected={replyToId.value === memo.id}
                      status={memo.state}
                    />
                    {/* Submemos */}
                    {memo.children?.map(
                      (childMemo: Memo, childIndex: number) => (
                        <ChatMessage
                          key={`child-${index}-${childIndex}`}
                          message={`${childMemo.description || ''}`}
                          isSender={true}
                          title={childMemo.extraData?.predefined?.label}
                          resource={childMemo.resource}
                          date={childMemo.updatedAt}
                        >
                          {childMemo.extraData && (
                            <div className='flex flex-wrap gap-2 text-xs'>
                              {childMemo.extraData.duration && (
                                <span className='flex items-center gap-1 px-2 py-1 rounded-md'>
                                  <span className='vox-icon size-sm vx-icon-236' />
                                  {'duracion: ' + childMemo.extraData.duration}
                                </span>
                              )}
                              {childMemo.extraData.time && (
                                <span className='flex items-center gap-1 px-2 py-1 rounded-md'>
                                  <span className='vox-icon size-sm vx-icon-237' />
                                  {'fecha: ' + DateUtils.dateToFrontend(childMemo.extraData.time, { format: 'DD/MM/YYYY HH:mm', })}
                                </span>
                              )}
                            </div>
                          )}
                        </ChatMessage>
                      )
                    )}
                  </>
                ))}
            </div>
            {viewMode.value === TypeChatView.USERS ? (
              <ChatInput
                onSend={handleSendMessage}
                input={messages}
              />
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
                                  placeholder=' min, hh:mm'
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
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                />
              </ChatInput>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
