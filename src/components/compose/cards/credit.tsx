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
        className={`${active ? 'text-white' : 'text-black'} ${onClick ? 'cursor-pointer' : ''} max-h-20 w-full justify-center flex`}
        onClick={() => (onClick ? onClick(true) : null)}
      >
        {onClick ? (
          <span className='vx-icon vx-plus text-3xl size-20 text-gray-700 flex items-center justify-center' />
        ) : (
          <div className='px-4 py-2'>
            <div className='flex items-center space-x-36'>
              <div className='flex-1'>
                <div className='bg-white rounded items-center px-2 min-w-32 flex justify-center'>
                  <span className='text-gray-400 text-sm'>
                    •••• •••• {number}
                  </span>
                </div>
              </div>
              <span className='vx-icon vx-credit-card text-sm size-base text-gray-700' />
            </div>
            <div className='flex flex-row justify-between'>
              <div className='rounded   flex justify-center my-6'>
                <span className='text-gray-700 text-sm font-medium'>
                  CVC: {number}
                </span>
              </div>
              <div className='rounded  flex justify-center my-6'>
                <span className='text-gray-700 text-sm font-medium'>
                  EXP: {number}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
