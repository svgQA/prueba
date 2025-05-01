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
import { toast } from 'react-toastify';
import { useSignal } from '@preact/signals';
import { IMessage } from '@/utils/socket/interface';
import { useEffect } from 'preact/hooks';

interface ChatMessage {
  message: string;
  isSender: boolean;
  from: string;
  to: string;
}

interface ChatViewProps {
  users: IUserResponse[];
  getUsersHandler: (page: number) => void;
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
          className='bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200'
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
}) => {
  const { t } = useTranslation();
  const { cognito } = useUserStore();
  const wsManager = useWebSocket();
  const userSelected = useSignal<IUserResponse | undefined>();
  const currentPage = useSignal<number>(1);
  const totalPages = useSignal<number>(3);
  const selectedChat = useSignal<string>('0');
  const chats = useSignal<Chats>({});

  useEffect(() => {
    wsManager.addListener('memos', handleReceiveMessage);
    return () => {
      wsManager.removeListener('memos');
    };
  }, []);

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
      toast.error('El mensaje tiene mala estructura');
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

  const handleChatSelect = (chatId: string) => {
    selectedChat.value = chatId;
    userSelected.value = users.find((user) => user.cognitoId === chatId);
  };

  return (
    <>
      <div className='w-full flex flex-col h-full'>
        {/*
          <div className='w-full p-1 border-b dark:border-b-dark-light'>
            {buttonMenu}
          </div>
        */}

        <div className='flex flex-1 overflow-y-auto border-t'>
          <div className='w-[30%] border-r dark:border-b-dark-light flex flex-col h-full'>
            {/*
            <ChatHeader />
            */}
            <ChatCard
              id={'0'}
              name={t('memos.chat.aiAssistant')}
              lastMessage={t('memos.chat.aiDefaultMessage')}
              time={t('memos.chat.time')}
              isAI
              onClick={handleChatSelect}
              isSelected={selectedChat.value === '0'}
            />
            <div className='flex-1 overflow-y-auto vox-scroll-design border-t dark:border-t-dark-light'>
              {users.map((user: IUserResponse) => (
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
            </div>
            <div className='flex justify-between items-center p-4 border-t dark:border-t-dark-light'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage.value === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage.value === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {t('memos.pagination.previous')}
              </button>
              <span className='text-sm text-gray-500'>
                {t('memos.pagination.page')} {currentPage.value}{' '}
                {t('memos.pagination.of')} {totalPages.value}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage.value >= totalPages.value}
                className={`px-4 py-2 rounded-md ${
                  currentPage.value >= totalPages.value
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {t('memos.pagination.next')}
              </button>
            </div>
          </div>

          <div className='w-[70%] flex flex-col'>
            <div className='flex-1 overflow-y-auto p-4 vox-scroll-design'>
              {selectedChat.value === '0' && <FrequentQuestions />}
              {chats.value[selectedChat.value]?.messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.message}
                  isSender={msg.isSender}
                />
              ))}
            </div>
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </>
  );
};
