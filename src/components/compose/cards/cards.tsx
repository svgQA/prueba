import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Cards: FunctionComponent<ICardProps> = ({
  id,
  name,
  color,
  colorText,
  qrIcon,
  currencyIcon,
  timeIcon,
  // alarmIcon,
  //   children,
}: ICardProps) => {
  return (
    <div id={id} name={name} className={`${color} rounded-lg shadow-md`}>
      <div className='p-6 relative'>
        <div className='flex justify-between items-start pb-16'>
          <h2 style={{ color: colorText }} className={`text-2xl font-bold`}>
            {id} {name}
          </h2>
          {qrIcon && (
            <span
              style={{ color: colorText }}
              className={`left-0 px-1 vx-icon vx-${qrIcon}`}
            />
          )}
        </div>
        <div className='absolute bottom-2 left-5'>
          <h2 style={{ color: colorText }} className=''>
            {currencyIcon && (
              <span className={`left-0 px-1 vx-icon vx-${currencyIcon}`} />
            )}{' '}
            Price: <strong>200 USD</strong>
          </h2>
        </div>
        <div className='absolute bottom-4 right-6 text-sm'>
          <div className='flex items-center'>
            {timeIcon && (
              <span
                style={{ color: colorText }}
                className={`left-0 px-1 vx-icon vx-${timeIcon}`}
              />
            )}
            <span style={{ color: colorText }} className=''>
              20 marzo de 2004
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
