import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ChatHeader } from './components/chat.header';
import { ChatCard } from './components/chat.card';
import { ChatMessage } from './components/chat.message';
import { ChatInput } from './components/chat.input';
import { UserService } from '@/services/user';
import { IUserResponse } from '@/types/auth';
import { useWebSocket } from '@/utils/socket';
import { useUserStore } from '@/store/slices';
import { IMessage } from '@/utils/socket/interface';
import { toast } from 'react-toastify';

interface FrequentQuestion {
  id: number;
  question: string;
}

interface ChatMessage {
  message: string;
  isSender: boolean;
  from: string;
  to: string;
}

type Chats = {
  [key: string]: {
    new: number;
    messages: ChatMessage[];
  };
};

const FrequentQuestions = () => {
  const questions: FrequentQuestion[] = [
    { id: 1, question: '¿Cómo puedo empezar un nuevo proyecto?' },
    { id: 2, question: '¿Cuáles son las mejores prácticas de código?' },
    { id: 3, question: '¿Cómo puedo optimizar mi aplicación?' },
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

export const MemosPage: FunctionComponent = () => {
  const wsManager = useWebSocket();
  const selectedChat = useSignal<string>('0');
  const users = useSignal<IUserResponse[]>([]);
  const userSelected = useSignal<IUserResponse | undefined>();
  const iam = useSignal<string | undefined>();
  const { getCognito } = useUserStore();

  const chats = useSignal<Chats>({});

  useEffect(() => {
    document.title = 'VX - Chat';
    getUsersHandler();
    wsManager.addListener('memos', handleReceiveMessage);
  }, []);

  const handleSendMessage = (message: string) => {
    if (!iam.value || !userSelected.value?.cognitoId) {
      toast.error('El mensaje tiene mala estructura');
      return;
    }
    const objMessage: IMessage = {
      from: iam.value,
      to: userSelected.value?.cognitoId,
      message,
    };
    wsManager.sendMessage(objMessage);

    chats.value = addMessageArray(objMessage.to, objMessage, true);
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

  const handleReceiveMessage = (message: IMessage) => {
    chats.value = addMessageArray(message.from, message);
  };

  const getUsersHandler = async () => {
    const response = await UserService.get_all();
    if (!response.getStatus()) return;
    users.value = response.getMany();
    iam.value = getCognito();
  };

  const handleChatSelect = (chatId: string) => {
    selectedChat.value = chatId;
    userSelected.value = users.value.find((user) => user.cognitoId === chatId);
  };

  return (
    <section className='flex flex-row h-[99.5vh]'>
      <div className='w-[30%] border-r dark:border-b-dark-light flex flex-col h-full'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto vox-scroll-design'>
          <ChatCard
            id={'0'}
            name='AI Assistant'
            lastMessage='I can help with that'
            time='10:15'
            isAI
            onClick={handleChatSelect}
            isSelected={selectedChat.value === '0'}
          />
          {users.value.map((user) => (
            <ChatCard
              key={`chat-card-${user.cognitoId}`}
              id={user.cognitoId}
              name={`${user.name} ${user.surname}`}
              lastMessage={`${iam.value === user.cognitoId ? 'SOY YO' : 'OTRO'}`}
              time='10:15'
              amount={chats.value[user.cognitoId]?.new}
              onClick={handleChatSelect}
              isSelected={selectedChat.value === user.cognitoId}
            />
          ))}
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
    </section>
  );
};
