import { Button } from '@/components/common/button/button';
import { useSignal } from '@preact/signals';

interface ChatInputProps {
  onSend?: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
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
