import { Card } from '@/components/common';
import { type FunctionComponent } from 'preact';
import { type ICardSettingMenuProps } from './interface';
import { type IMenu } from '@/components/common/interface';
import { Link } from 'wouter';

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
        <Link
          to={menu.to}
          name={menu.to}
          className={`${menu.status ? 'bg-blue-300' : 'bg-blue-100'} flex flex-row px-2 py-1 text-sm items-center my-0.5`}
        >
          <span className={`vx-icon size-sm mx-2 vx-${menu.icon}`} />
          {menu.label}
        </Link>
      ))}
    </Card>
  );
};
