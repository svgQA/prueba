import { useRef } from 'preact/hooks';
import Markdown from 'preact-markdown';

export const Messages = ({ messages }: any) => {
  const messagesContainerRef = useRef(null);

  // useEffect(() => {
  //   if (messagesContainerRef.current) {
  //     messagesContainerRef.current.scrollTop =
  //       messagesContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  if (!messages.length) {
    return (
      <div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
        Ask me anything! I'm here to help.
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className='flex-1 overflow-y-auto text-white'
    >
      {messages.map(({ id, role, content }: any) => (
        <div
          key={id}
          className={`py-3 ${
            role === 'assistant'
              ? 'bg-gradient-to-r from-orange-500/5 to-red-600/5'
              : 'bg-transparent'
          }`}
        >
          {content.length > 0 && (
            <div className='flex items-start gap-2 px-4'>
              {role === 'assistant' ? (
                <div className='w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0'>
                  AI
                </div>
              ) : (
                <div className='w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-medium text-white flex-shrink-0'>
                  Y
                </div>
              )}
              <div className='flex-1 min-w-0'>
                {/* @ts-ignore */}
                <Markdown
                  markdown={content}
                  className='prose dark:prose-invert max-w-none prose-sm'
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
