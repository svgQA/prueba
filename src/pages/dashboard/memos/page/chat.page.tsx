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
import { Memo } from '../utils/memos';

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
}) => {
  const { t } = useTranslation();
  const { cognito } = useUserStore();
  const wsManager = useWebSocket();
  const userSelected = useSignal<IUserResponse | undefined>();
  const currentPage = useSignal<number>(1);
  const totalPages = useSignal<number>(3);
  const selectedChat = useSignal<string>('0');
  const chats = useSignal<Chats>({});
  const viewMode = useSignal<'users' | 'services'>('users');
  const memoByService = useSignal<any[]>([]);

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

  const handleSendMessage = (message: string) => {
    if (!cognito || !userSelected.value?.cognitoId) {
      ToastManager.error('El mensaje tiene mala estructura');
      return;
    }
    const objMessage: IMessage = {
      from: cognito,
      to: userSelected.value?.cognitoId,
      message,
    };
    wsManager.sendMessage(objMessage);

    chats.value = addMessageArray(objMessage.to, objMessage, true);
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

  const handleChatSelect = async (chatId: string, isService: boolean = false): Promise<void> => {
    selectedChat.value = chatId;
    userSelected.value = users.find((user) => user.cognitoId === chatId);
   
    if (isService) {
      const response = await MemoService.get_all_by_service_id(chatId);
      if (!response.getStatus()) return;
      memoByService.value = response.getMany();
    }
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
                  onClick={() => viewMode.value = 'users'}
                  className={`flex-1 ${viewMode.value === 'users' ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
                  label={t('memos.view.users')}
                />
                <Button
                  name='services'
                  onClick={() => viewMode.value = 'services'}
                  className={`flex-1 ${viewMode.value === 'services' ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
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
              {viewMode.value === 'users' ? (
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
                ))
              ) : (
                memosGroupedByService.map((service: any) => (
                  <ChatCard
                    key={`service-card-${service.service.id}`}
                    id={service.service.id}
                    name={service.service.name}
                    lastMessage={service.service.description || ''}
                    time={service.service.time || ''}
                    amount={service.service.unreadCount}
                    onClick={() => handleChatSelect(service.service.id, true)}
                    isSelected={selectedChat.value === service.service.id}
                  />
                ))
              )}
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
              {selectedChat.value === '0' && chats.value[selectedChat.value]?.messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.message}
                  isSender={msg.isSender}
                />
              ))}
              {selectedChat.value !== '0' && memoByService.value.map((memo: Memo, index) => (
                <>
                  {/* Memo principal */}
                  <ChatMessage
                    key={`parent-${index}`}
                    message={`${memo.novelty?.description || ''}`}
                    isSender={true}
                  />
                  {/* Submemos */}
                  {memo.children?.map((childMemo: Memo, childIndex: number) => (
                    <ChatMessage
                      key={`child-${index}-${childIndex}`}
                      message={`${childMemo.description || ''}`}
                      isSender={false}
                    />
                  ))}
                </>
              ))}
            </div>
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </>
  );
};
