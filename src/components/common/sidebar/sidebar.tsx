import { type FunctionComponent } from 'preact';

import { type ISidebarProps } from './interface';
import { useEffect, useMemo } from 'preact/hooks';
import { Link, useLocation } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import { useUserStore } from '@/store/slices';
import { closeOnBoardingModal } from '@/store/signals/modals';
import { memo } from 'preact/compat';
import { IMenu } from '../interface';
import { ICompany } from '@/store/slices/interface';
import { useSignal } from '@preact/signals';

interface IMenuItem {
  menu: IMenu;
  isNavigation: boolean;
  getSelected: (to: string) => string;
}

const MenuItem = memo<IMenuItem>(
  ({ menu, isNavigation, getSelected }: IMenuItem) => {
    const id = `menu-${menu.label}`.toLowerCase();
    return isNavigation ? (
      <Link
        to={menu.to}
        key={id}
        className={`p-1 mt-1 hover:disabled rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
      </Link>
    ) : (
      <a
        name={menu.to}
        className={`p-1 mt-1 bg-opacity-20 rounded-sm ${getSelected(menu.to)}`}
      >
        <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
      </a>
    );
  }
);

interface ICompanyItem {
  company: ICompany;
  setCompanySelected: (id: string) => void;
}

const CompanyItem = memo<ICompanyItem>(
  ({ company, setCompanySelected }: ICompanyItem) => (
    <div
      key={company.id}
      className={`flex cursor-pointer w-full px-4 py-2 mb-1 flex-row justify-between items-center ${company.selected ? 'bg-primary' : ''}`}
      onClick={() => setCompanySelected(company.id)}
    >
      <div>
        <h4>{company.name}</h4>
        <span>{company.role}</span>
      </div>
      <span className='vx-icon vx-users' />
    </div>
  )
);

export const Sidebar: FunctionComponent<ISidebarProps> = ({
  id,
  name,
  menus,
  onSettingHandler,
  onHomeHandler,
  isNavigation = false,
  onHandlerClick,
  onLogout,
}: ISidebarProps) => {
  const [location] = useLocation();
  const menuSelected = useSignal<string | null>('');
  const { companies, setSelected } = useUserStore();

  const setCompanySelected = useMemo(
    () => (company: string) => {
      setSelected(company);
      closeOnBoardingModal();
    },
    [setSelected]
  );

  useEffect(() => {
    menuSelected.value = location;
  }, [location]);

  const getSelected = useMemo(
    () => (to: string) => (to === location ? 'bg-primary' : ''),
    [location]
  );

  const selectMenu = useMemo(
    () => (event: MouseEvent) => {
      if (!isNavigation) {
        event.preventDefault();
      }
      const target = event.target as HTMLElement;
      if (target instanceof HTMLSpanElement) {
        const menuClicked = target.getAttribute('name');
        menuSelected.value = menuClicked;
        if (
          onHandlerClick !== undefined &&
          !isNavigation &&
          menuClicked !== null
        ) {
          onHandlerClick(menuClicked);
        }
      }
    },
    [isNavigation, onHandlerClick]
  );

  return (
    <nav
      id={`${id}-nav`}
      name={name}
      className='fixed left-0 top-0 transform px-1 flex flex-col justify-between h-screen border-2 border-b-light-dark dark:border-b-dark-light'
    >
      {onHomeHandler && (
        <ul>
          <a onClick={onHomeHandler} className='cursor-pointer'>
            <ButtonMenu name='vx-home-button' label='home' icon='023' />
          </a>
        </ul>
      )}
      <ul
        className='flex flex-col justify-between capitalize'
        onClick={selectMenu}
      >
        {menus.map((menu) => (
          <MenuItem
            key={menu.to}
            menu={menu}
            isNavigation={isNavigation}
            getSelected={getSelected}
          />
        ))}
      </ul>
      <ul className='flex flex-col justify-between capitalize'>
        <span
          onClick={onSettingHandler}
          className='cursor-pointer p-1 mt-1 hover:disabled rounded-sm'
        >
          <ButtonMenu name='vx-setting-button' label='setting' icon='169' />
        </span>
        <div className='relative group'>
          <a className='cursor-pointer'>
            <ButtonMenu name='vx-company-button' label='company' icon='281' />
          </a>
          <div className='absolute left-full bottom-0 hidden group-hover:block shadow-xl rounded p-2 w-52 min-h-20 border-2 bg-b-light dark:bg-b-dark border-b-light-dark dark:border-b-dark-light'>
            {companies.map((company) => (
              <CompanyItem
                key={company.id}
                company={company}
                setCompanySelected={setCompanySelected}
              />
            ))}
          </div>
        </div>
        {onLogout && (
          <a onClick={onLogout} className='cursor-pointer'>
            <ButtonMenu name='vx-logout-button' label='logout' icon='225' />
          </a>
        )}
      </ul>
    </nav>
  );
};
