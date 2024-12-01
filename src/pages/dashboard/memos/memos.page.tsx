import { type FunctionComponent } from 'preact';
import { Button } from '@/components/common';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

interface ChatHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onMoreClick?: () => void;
}

interface ChatCardProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  isAI?: boolean;
  onClick: (id: number) => void;
  isSelected?: boolean;
}

interface ChatMessageProps {
  message: string;
  isSender: boolean;
}

interface ChatInputProps {
  onSend?: (message: string) => void;
}

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

// Components
const ChatHeader = ({
  onMenuClick,
  onSettingsClick,
  onMoreClick,
}: ChatHeaderProps) => (
  <div className='flex justify-between items-center p-4 bg-b-light-dark dark:bg-b-dark-light'>
    <div className='flex gap-2'>
      <Button
        icon='123'
        rounded
        id='menu-btn'
        name='menu'
        type='button'
        onClick={onMenuClick}
      />
      <Button
        icon='231'
        rounded
        id='settings-btn'
        name='settings'
        type='button'
        onClick={onSettingsClick}
      />
    </div>
    <Button
      icon='233'
      rounded
      id='more-btn'
      name='more'
      type='button'
      onClick={onMoreClick}
    />
  </div>
);

const ChatCard = ({
  id,
  name,
  lastMessage,
  time,
  isAI,
  onClick,
  isSelected,
}: ChatCardProps) => (
  <div
    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200 border-b dark:border-b-dark-light ${
      isSelected ? 'bg-primary text-white' : 'hover:bg-blue-50'
    }`}
    onClick={() => onClick(id)}
  >
    <div
      className={`w-10 h-10 rounded-full ${isAI ? 'bg-gradient-to-r from-primary to-blue-500 text-white flex items-center justify-center' : 'bg-gray-300'}`}
    >
      {isAI && <span className='left-0 px-1 vx-icon vx-icon-123' />}
    </div>
    <div className='flex-1'>
      <h3 className='font-semibold'>{name}</h3>
      <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
        {lastMessage}
      </p>
    </div>
    <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
      {time}
    </span>
  </div>
);

const ChatMessage = ({ message, isSender }: ChatMessageProps) => (
  <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${isSender ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
    >
      {message}
    </div>
  </div>
);

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

const ChatInput = ({ onSend }: ChatInputProps) => {
  const currentMessage = useSignal('');

  const handleSubmit = () => {
    if (currentMessage.value.trim()) {
      onSend?.(currentMessage.value);
      currentMessage.value = '';
    }
  };

  return (
    <div className='flex items-center gap-2 p-4 border-t dark:border-b-dark-light'>
      <Button icon='011' rounded id='attach-btn' name='attach' type='button' />
      <Button icon='156' rounded id='emoji-btn' name='emoji' type='button' />
      <input
        type='text'
        className='flex-1 py-2 px-4 border dark:border-b-dark-light rounded-full'
        placeholder='Type a message...'
        value={currentMessage.value}
        onInput={(e) => (currentMessage.value = e.currentTarget.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <Button
        icon='142'
        rounded
        id='send-btn'
        name='send'
        type='button'
        onClick={handleSubmit}
      />
      <Button icon='012' rounded id='voice-btn' name='voice' type='button' />
    </div>
  );
};

export const MemosPage: FunctionComponent = () => {
  const selectedChat = useSignal<number>(1);
  const chats = useSignal<Chats>({
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
      { message: 'Hello AI Assistant', isSender: true },
      { message: 'Hi! I am here to help you with any task', isSender: false },
      { message: 'Can you help me with my project?', isSender: true },
    ],
  });

  useEffect(() => {
    document.title = 'VX - Chat';
  }, []);

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
            id={3}
            name='AI Assistant'
            lastMessage='I can help with that'
            time='10:15'
            isAI
            onClick={handleChatSelect}
            isSelected={selectedChat.value === 3}
          />
          <ChatCard
            id={1}
            name='John Doe'
            lastMessage='Hello there!'
            time='12:30'
            onClick={handleChatSelect}
            isSelected={selectedChat.value === 1}
          />
          <ChatCard
            id={2}
            name='Jane Smith'
            lastMessage='How are you?'
            time='11:45'
            onClick={handleChatSelect}
            isSelected={selectedChat.value === 2}
          />
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
