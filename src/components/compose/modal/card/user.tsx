import { type FunctionComponent } from 'preact';
import { type ICardSettingUserProps } from './interface';
import { Card } from '@/components/common/card/card';
import { Badge } from '@/components/common/badge/badge';
import { Avatar } from '@/components/common/Avatar';

export const CardSettingUser: FunctionComponent<ICardSettingUserProps> = ({
  id,
  name,
  username,
  image,
  company,
  rol,
}: ICardSettingUserProps) => {
  return (
    <Card id={id} name={name} borderless rounded={false} transparent>
      <div className='px-2'>
        <div className='flex gap-2 w-full pb-2 justify-between px-3 py-1'>
          <Avatar name={username} src={image} size='lg' />
          <div className='flex flex-col justify-center'>
            <p className='text-sm font-medium max-w-52 overflow-hidden'>
              {username}
            </p>
            <p className='text-xs pt-2'>{rol}</p>
          </div>
        </div>
        <Badge
          outline
          label={company}
          icon='012'
          size='sm'
          full
          status='info'
        />
      </div>
    </Card>
  );
};
