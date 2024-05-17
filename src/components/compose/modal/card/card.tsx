import { Card } from '@/components/common';
import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { type IMenu } from '@/components/common/interface';

export const CardSettingMenu: FunctionComponent<ICardSettingMenuProps> = ({
  id,
  name,
  menus,
  label,
}: ICardSettingMenuProps) => {
  return (
    <Card id={id} name={name}>
      <h2 className='font-semibold mb-2'>{label}</h2>
      {menus.map((menu: IMenu) => (
        <a
          href=''
          className='flex flex-row px-2 py-1 items-center my-0.5 bg-blue-100'
        >
          <span className={`vx-icon size-sm vx-${menu.icon}`}></span>
          <p className='px-3 text-sm'>{menu.label}</p>
        </a>
      ))}
    </Card>
  );
};
