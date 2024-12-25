import { type FunctionComponent } from 'preact';
import { ICreditCardProps } from '../interface';
import { Card } from '@/components/common/card/card';

export const CreditCard: FunctionComponent<ICreditCardProps> = ({
  id,
  name,
  active = false,
  number,
  onClick,
}: ICreditCardProps) => {
  return (
    <Card id={id} name={name} color={active ? 'bg-gray-300' : 'bg-gray-300'}>
      <div
        className={`${active ? 'poner text color' : 'poner text color'} ${onClick ? 'cursor-pointer' : ''} max-h-20 w-full justify-center flex`}
        onClick={() => (onClick ? onClick(true) : null)}
      >
        {onClick ? (
          <span className='vx-icon vx-icon-055 text-3xl size-20 flex items-center justify-center' />
        ) : (
          <div className='px-4 py-2'>
            <div className='flex items-center space-x-36'>
              <div className='flex-1'>
                <div className='rounded items-center px-2 min-w-32 flex justify-center'>
                  <span className='text-sm '>•••• •••• {number}</span>
                </div>
              </div>
              <span className='vx-icon vx-icon-015 text-sm size-base' />
            </div>
            <div className='flex flex-row justify-between'>
              <div className='rounded flex justify-center my-6'>
                <span className='text-sm font-medium'>CVC: {number}</span>
              </div>
              <div className='rounded flex justify-center my-6'>
                <span className='text-sm font-medium'>EXP: {number}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
