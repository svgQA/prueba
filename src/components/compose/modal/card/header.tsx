import { Card } from '@/components/common';
import { type FunctionComponent } from 'preact';
import { type ICardSettingHeaderProps } from './interface';

export const CardSettingHeader: FunctionComponent<ICardSettingHeaderProps> = ({
  id,
  name,
  title,
  description,
}: ICardSettingHeaderProps) => {
  return (
    <Card id={id} name={name}>
      <div className='flex flex-row items-center'>
        <span className='vx-icon vx-apps mx-3' />
        <div className='w-full px-2'>
          <h3 className='text-xl font-bold text-pretty'>{title}</h3>
          <p className='font-thin'>{description}</p>
        </div>
      </div>
    </Card>
  );
};
