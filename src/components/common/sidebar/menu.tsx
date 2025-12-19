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

    return isNavigation ? (
      <Link
        to={menu.to}
        key={id}
        className={`border-r-4 border-r-transparent rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
      </Link>
    ) : (
      <a
        className={`border-r-4 border-r-transparent rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
      </a>
    );
  }
);
