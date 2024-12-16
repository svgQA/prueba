import { type FunctionComponent } from 'preact';
import { type IInvoiceCardProps } from './interface';
import { Card } from '@/components/common';

export const InvoiceCard: FunctionComponent<IInvoiceCardProps> = ({
  id,
  name,
  total,
  currency,
  active = false,
}: IInvoiceCardProps) => {
  return (
    <Card id={id} name={name} color={active ? 'bg-gray-300' : 'bg-gray-300'}>
      <div
        className={`${active ? 'poner color text' : 'poner color text'} max-h-20`}
      >
        <div className='flex justify-between w-full items-center'>
          <h2 className='text-xl font-bold'>{name}</h2>
          <span className='vx-icon vx-icon-132' />
        </div>
        <div className='flex flex-row justify-between items-center pt-3'>
          <div className='min-w-36'>
            <span className='vx-icon vx-icon-056 text-sm size-sm' />
            Price:
            <strong className='px-2'>
              {total} {currency}
            </strong>
          </div>
          <div className='flex items-center max-w-24'>
            <span className='vx-icon vx-icon-141 size-sm mr-2' />
            <span className='text-xs'>20/03/2024</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
