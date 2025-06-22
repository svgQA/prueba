import { memo } from 'preact/compat';
import { Link } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import { IMenu } from '../utils/interface';

interface IMenuItem {
  menu: IMenu;
  isNavigation: boolean;
  getSelected: (to: string) => string;
}

export const MenuItem = memo<IMenuItem>(
  ({ menu, isNavigation, getSelected }: IMenuItem) => {
    const id = `menu-${menu.label}`.toLowerCase();
    const label = String('t_' + menu.label);
    return isNavigation ? (
      <Link
        to={menu.to}
        key={id}
        className={`p-1 mt-1 hover:disabled rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={label} icon={menu.icon} />
      </Link>
    ) : (
      <a
        className={`p-1 mt-1 bg-opacity-20 rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={label} icon={menu.icon} />
      </a>
    );
  }
);
