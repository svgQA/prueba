import { type FunctionComponent } from 'preact';
import { type ICardSettingHeaderProps } from './interface';
import { Card } from '@/components/common/card/card';

export const CardSettingHeader: FunctionComponent<ICardSettingHeaderProps> = ({
  id,
  name,
  title,
  description,
}: ICardSettingHeaderProps) => {
  return (
    <Card id={id} name={name} color='bg-b-white border-b-2 dark:bg-b-dark-light'>
      <div className='flex flex-row items-center h-12'>
        {/* <span className='vox-icon vx-icon-091 size-xl' /> */}
        <div className='w-full pl-4'>
          <h3 className='text-xl font-bold text-pretty'>{title}</h3>
          <p className='font-thin'>{description}</p>
        </div>
      </div>
    </Card>
  );
};
