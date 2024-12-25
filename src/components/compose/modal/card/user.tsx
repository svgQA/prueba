import { type FunctionComponent } from 'preact';
import { type ICardSettingUserProps } from './interface';
import { Card } from '@/components/common/card/card';
import { Badge } from '@/components/common/badge/badge';

export const CardSettingUser: FunctionComponent<ICardSettingUserProps> = ({
  id,
  name,
  username,
  // image,
  company,
  rol,
}: ICardSettingUserProps) => {
  return (
    <Card id={id} name={name}>
      <div className='flex flex-row justify-center items-center h-12'>
        {/* <img
          src={image}
          alt={`sett-user-${id}`}
          className='w-12 h-12 mr-2 rounded-full'
        ></img> */}
        <div className='w-full mx-1'>
          <p className='text-sm h-5 font-thin max-w-40 overflow-hidden'>
            {username}
          </p>
          <div className='flex flex-row justify-between mt-2'>
            <p className='font-bold mr-1 text-xs'>{company}</p>
            <Badge
              label={rol}
              icon='users'
              color='poner color'
              bgColor='poner color'
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
