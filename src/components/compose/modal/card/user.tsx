import { type FunctionComponent } from 'preact';
import { type ICardSettingUserProps } from './interface';
import { Card } from '@/components/common/card/card';
import { Badge } from '@/components/common/badge/badge';

export const CardSettingUser: FunctionComponent<ICardSettingUserProps> = ({
  id,
  name,
  username,
  image,
  company,
  rol,
}: ICardSettingUserProps) => {
  return (
    <Card id={id} name={name} borderless rounded={false}>
      <div className='flex gap-2 p-2 w-full'>
        <div className='flex flex-col items-center'>
          <div className='bg-primary-opacity rounded-full p-3'>
            <img
              src={image || '/placeholder.svg'}
              alt={`sett-user-${id}`}
              className='w-10 h-10 rounded-full'
            />
          </div>
          <Badge
            label={rol}
            icon='users'
            color='primary'
            bgColor='bg-primary-opacity mt-2'
            textColor='text-primary'
          />
        </div>

        <div className='flex flex-col justify-center mb-5'>
          <p className='text-sm font-medium'>{username}</p>
          <p className='text-xs'>{company}</p>
        </div>
      </div>
    </Card>
  );
};
