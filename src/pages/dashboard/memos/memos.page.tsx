import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ChatHeader } from './components/chat.header';
import { ChatCard } from './components/chat.card';
import { ChatMessage } from './components/chat.message';
import { ChatInput } from './components/chat.input';
// import { UserService } from '@/services/user';
import { IUserResponse } from '@/types/auth';
import { useWebSocket } from '@/utils/socket';

interface FrequentQuestion {
  id: number;
  question: string;
}

interface ChatMessage {
  message: string;
  isSender: boolean;
}

type Chats = {
  [key: number]: ChatMessage[];
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
  const selectedChat = useSignal<number>(1);
  const users = useSignal<IUserResponse[]>([]);

  const chats = useSignal<Chats>({
    0: [
      { message: 'Hello AI Assistant', isSender: true },
      { message: 'Hi! I am here to help you with any task', isSender: false },
      { message: 'Can you help me with my project?', isSender: true },
    ],
    1: [
      { message: 'Hi there!', isSender: false },
      { message: 'Hello! How can I help?', isSender: true },
      { message: 'I need assistance with coding', isSender: false },
    ],
    2: [
      { message: 'Hey Jane!', isSender: true },
      { message: 'Hi! Are we meeting today?', isSender: false },
      { message: 'Yes, at 2pm', isSender: true },
    ],
    3: [
      { message: 'Hey Jane!', isSender: true },
      { message: 'Hi! Are we meeting today?', isSender: false },
      { message: 'Yes, at 2pm', isSender: true },
    ],
    4: [
      { message: 'Hello AI Assistant', isSender: true },
      { message: 'Hi! I am here to help you with any task', isSender: false },
      { message: 'Can you help me with my project?', isSender: true },
    ],
    5: [
      { message: 'Hello AI Assistant', isSender: true },
      { message: 'Hi! I am here to help you with any task', isSender: false },
      { message: 'Can you help me with my project?', isSender: true },
    ],
    6: [
      { message: 'Hey Jane!', isSender: true },
      { message: 'Hi! Are we meeting today?', isSender: false },
      { message: 'Yes, at 2pm', isSender: true },
    ],
  });

  useEffect(() => {
    document.title = 'VX - Chat';
    console.log('MEMO.page.tsx: ' + 3);
    wsManager.addListener('memos', handleMessage);
  }, []);

  const handleMessage = (message: string) => {
    console.log('Mensaje de alguien', message);
  };

  // const getUsersHandler = async () => {
  //   const response = await UserService.get_all();
  //   if (!response.getStatus()) return;
  //   users.value = response.getMany();
  // };

  const handleChatSelect = (chatId: number) => {
    selectedChat.value = chatId;
  };

  const handleSendMessage = (message: string) => {
    const currentChatId = selectedChat.value;
    chats.value = {
      ...chats.value,
      [currentChatId]: [
        ...chats.value[currentChatId],
        { message, isSender: true },
      ],
    };
  };

  return (
    <section className='flex flex-row h-[99.5vh]'>
      <div className='w-[30%] border-r dark:border-b-dark-light flex flex-col h-full'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto vox-scroll-design'>
          <ChatCard
            id={0}
            name='AI Assistant'
            lastMessage='I can help with that'
            time='10:15'
            isAI
            onClick={handleChatSelect}
            isSelected={selectedChat.value === 0}
          />
          {users.value.map((user) => (
            <ChatCard
              key={`chat-card-${user.cognitoId}`}
              id={user.id}
              name={`${user.name} ${user.surname}`}
              lastMessage='I can help with that'
              time='10:15'
              onClick={handleChatSelect}
              isSelected={selectedChat.value === user.id}
            />
          ))}
        </div>
      </div>

      <div className='w-[70%] flex flex-col'>
        <div className='flex-1 overflow-y-auto p-4'>
          {selectedChat.value === 3 && <FrequentQuestions />}
          {chats.value[selectedChat.value].map((msg, index) => (
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
