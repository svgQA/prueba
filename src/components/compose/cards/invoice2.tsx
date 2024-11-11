import { type FunctionComponent } from 'preact';
import { type IInvoiceCardProps } from './interface';
import { Card } from '@/components/common';

export const InvoiceCard2: FunctionComponent<IInvoiceCardProps> = ({
  id,
  name,
  active = false,
}: IInvoiceCardProps) => {
  return (
    <Card
      id={id}
      name={name}
      color={active ? 'poner bg color' : 'poner bg color'}
    >
      <div
        className={`${active ? 'poner color text' : 'poner color text'} max-h-20`}
      >
        <div className='flex justify-between w-full items-center'>
          <h2 className='text-xl font-bold'>{name}</h2>
          <span className='vx-icon vx-qr' />
        </div>
        <div className='flex flex-row justify-between items-center pt-3'>
          <div className='min-w-36'>
            <span className='vx-icon vx-asterik text-sm size-sm mr-4' />
            Main
          </div>
          <div className='flex items-center max-w-24'>
            <span className='vx-icon vx-time size-sm mr-2' />
            <span className='text-xs'>20/03/2024</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
