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
      <div className='text-gray-600 hover:text-gray-800'>
        <h2 className='text-xs font-semibold mb-2'>{label}</h2>
        {menus.map((menu: IMenu) => (
          <Link
            to={menu.to}
            name={menu.to}
            className={`${menu.status ? 'bg-blue-300 text-gray-800' : 'bg-blue-100'} flex flex-row px-2 py-1 text-sm items-center my-0.5`}
          >
            <span className={`vx-icon size-sm mx-2 vx-${menu.icon}`} />
            {menu.label}
          </Link>
        ))}
      </div>
    </Card>
  );
};
