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
      <div className='flex gap-2 p-2 w-full'>
        <div className='flex flex-col items-center'>
          <Avatar name={username} src={image} size='lg' />
          <Badge
            label={rol}
            icon='users'
            color='primary'
            bgColor='bg-primary-opacity mt-2'
            textColor='text-primary'
          />
        </div>

        <div className='flex flex-col justify-center mb-5'>
          <p className='text-sm font-medium max-w-52 overflow-hidden'>
            {username}
          </p>
          <p className='text-xs pt-2'>{company}</p>
        </div>
      </div>
    </Card>
  );
};
