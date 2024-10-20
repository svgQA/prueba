import { type FunctionComponent } from 'preact';
import { type ICreditCardProps } from './interface';
import { Card } from '@/components/common';

export const CreditCard: FunctionComponent<ICreditCardProps> = ({
  id,
  name,
  active = false,
  number,
  onClick,
}: ICreditCardProps) => {
  return (
    <Card id={id} name={name} color={active ? 'bg-blue-200' : 'bg-zinc-300'}>
      <div
        className={`${active ? 'text-white' : 'text-black'} max-h-20`}
        onClick={() => (onClick ? onClick(true) : null)}
      >
        {onClick ? (
          <svg
            className='h-8 w-8 text-gray-400 mt'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
        ) : (
          <div className='flex items-center space-x-4'>
            <svg
              className='h-8 w-8 text-gray-500 '
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
            <div className='flex-1'>
              <div className='bg-white h-6 w-full rounded flex items-center px-2 '>
                <span className='text-gray-400'>•••• •••• {number}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
