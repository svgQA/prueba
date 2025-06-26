import { Button } from '@/components/common/button/button';
import { Signal, useSignal } from '@preact/signals';
import { FormattedDate } from '@/components/compose/forms';
import { Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { lengthSize_10, required } from '@/utils/utilities';

interface ChatInputProps {
  onSend?: (message: string, replyId?: number) => void;
  onCancelReply?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  replyId?: number;
  replyTo?: {
    message: string;
    title?: string;
    date?: string | Date;
  };
  form?: string;
  input: Signal<string>;
}

export const ChatInput = ({
  onCancelReply,
  input,
  disabled = false,
  children,
  replyId,
  replyTo,
  // form,
}: ChatInputProps) => {
  const showChildren = useSignal(false);

  // const handleSubmit = () => {
  //   if (input.value.trim()) {
  //     onSend?.(input.value, replyId);
  //     input.value = '';
  //   }
  // };

  const handleCancelReply = () => {
    onCancelReply?.();
    input.value = '';
    showChildren.value = false;
  };

  const showReply = () => {
    if (!replyTo) return;

    return (
      <div className='flex items-center gap-2 px-4 py-2 bg-b-light-light dark:bg-b-dark-light border-t border-b-light-dark dark:border-b-dark-light'>
        <div className='w-1 h-12 bg-primary rounded-full' />
        <div className='flex-1 min-w-0'>
          {replyTo.title && (
            <div className='text-sm font-medium text-primary truncate'>
              {replyTo.title}
            </div>
          )}
          <div className='text-sm text-t-light dark:text-t-dark truncate'>
            {replyTo.message}
          </div>
        </div>
        {replyTo.date && (
          <div className='text-xs text-gray-text-light dark:text-t-dark-light whitespace-nowrap'>
            <FormattedDate date={replyTo.date} format='time' />
          </div>
        )}
        <Button
          icon='053'
          rounded
          id='cancel-reply-btn'
          name='cancel-reply'
          type='button'
          onClick={handleCancelReply}
        />
      </div>
    );
  };

  return (
    <div className='flex flex-col'>
      {replyId && replyTo && showReply()}
      {showChildren.value && children && replyId && (
        <div className='flex items-center gap-2 px-4 py-2 bg-b-light-light dark:bg-b-dark-light border-t border-b-light-dark dark:border-b-dark-light bg-blue-200'>
          {children}
          <div className='flex-1 flex justify-end'>
            <Button
              icon='053'
              rounded
              id='cancel-reply-btn'
              name='cancel-reply'
              type='button'
              onClick={() => (showChildren.value = false)}
            />
          </div>
        </div>
      )}

      <div className='flex items-center gap-2 mx-5 px-3 py-2 mb-2 bg-white dark:bg-b-dark-dark rounded-full mt-1'>
        {/* <Button
            icon='011'
            rounded
            id='attach-btn'
            name='attach'
            type='button'
            disabled={disabled || !replyId}
          />
          <Button
            icon='142'
            rounded
            id='emoji-btn'
            name='emoji'
            type='button'
            disabled={disabled || !replyId}
          /> */}
        {children ? (
          <>
            <Button
              icon='311'
              rounded
              id='modal-btn'
              name='modal'
              type='button'
              borderless
              onClick={() => (showChildren.value = !showChildren.value)}
            />

            {/*
              <input
                type='text'
                className='flex-1 py-2 px-4 border dark:border-b-dark-light rounded-full'
                placeholder={
                  replyId ? 'Type a reply...' : 'Select a message to reply...'
                }
                value={input.value}
                onInput={(e) => (input.value = e.currentTarget.value)}
                disabled={disabled || !replyId}
              />
              */}
            <Field<string> name='description' validate={lengthSize_10}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  meta={meta}
                  type='text'
                  placeholder='p_memo_description'
                  disabled={disabled || !replyId}
                  borderless
                  float
                  // options={predefined.value}
                  // menuPortalTarget={document.body}
                  // end={false}
                  // onChange={(value?: IOption) => {
                  //   input.onChange(value);
                  // }}
                />
              )}
            </Field>

            <Button
              icon='156'
              rounded
              id='send-btn'
              name='send'
              type='submit'
              borderless
              // form={form}
              // onClick={handleSubmit}
              // disabled={disabled || !replyId}
            />
          </>
        ) : (
          <>
            {/*
              <input
                type='text'
                className='flex-1 py-2 px-4 border dark:border-b-dark-light rounded-full'
                placeholder='Type a message'
                value={input.value}
                onInput={(e) => (input.value = e.currentTarget.value)}
                disabled={disabled}
              />
            */}
            <Field<string> name='message' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  meta={meta}
                  type='text'
                  placeholder='i_chat_message'
                  disabled={disabled}
                  // options={predefined.value}
                  // menuPortalTarget={document.body}
                  // end={false}
                  // onChange={(value?: IOption) => {
                  //   input.onChange(value);
                  // }}
                />
              )}
            </Field>

            <Button
              icon='156'
              rounded
              id='send-btn'
              name='send'
              type='submit'
              // form={form}
              // onClick={handleSubmit}
              disabled={disabled}
            />
          </>
        )}
        {/* <Button
            icon='012'
            rounded
            id='voice-btn'
            name='voice'
            type='button'
            disabled={disabled || !replyId}
            onClick={handleCancelReply}
          /> */}
      </div>
    </div>
  );
};
