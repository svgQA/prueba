interface ChatMessageProps {
  message: string;
  isSender: boolean;
}

export const ChatMessage = ({ message, isSender }: ChatMessageProps) => (
  <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${isSender ? 'bg-primary text-white' : 'bg-b-light-dark dark:bg-b-dark-light'}`}
    >
      {message}
    </div>
  </div>
);
