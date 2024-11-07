import { type FunctionComponent } from 'preact';
import { type ISidebarProps } from './interface';
import { useEffect, useState } from 'preact/hooks';
import { Link } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import { useUserStore } from '@/store/slices';
import { closeOnBoardingModal } from '@/store/signals/modals';

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
  const [menuSelected, setMenuSelected] = useState<string | null>('');
  const { companies, setSelected } = useUserStore();
  const setCompanySelected = (company: string) => {
    setSelected(company);
    closeOnBoardingModal();
  };

  useEffect(() => {
    setMenuSelected(menus[0].to);
  }, []);

  const isActive = (value: string) => {
    return value === menuSelected;
  };

  const selectMenu = (event: MouseEvent) => {
    if (!isNavigation) {
      event.preventDefault();
    }
    const target = event.target as HTMLElement;
    if (target instanceof HTMLSpanElement) {
      const menuClicked = target.getAttribute('name');
      setMenuSelected(menuClicked);
      if (
        onHandlerClick !== undefined &&
        !isNavigation &&
        menuClicked !== null
      ) {
        onHandlerClick(menuClicked);
      }
    }
  };

  return (
    <nav
      id={`${id}-nav`}
      name={name}
      className='fixed left-0 top-0 transform bg-neutral-100 px-1 flex flex-col justify-between h-screen'
    >
      {/* className={`bg-neutral-100 h-full px-1 flex flex-col justify-between ${position}`} */}
      {onHomeHandler && (
        <ul>
          <a
            onClick={onHomeHandler}
            className='cursor-pointer text-black hover:text-black'
          >
            <ButtonMenu name='vx-home-button' label='home' icon='logo' />
          </a>
        </ul>
      )}
      <ul
        className='flex flex-col justify-between capitalize'
        onClick={selectMenu}
      >
        {menus.map((menu) => {
          const id = `menu-${menu.label}`.toLowerCase();
          return isNavigation ? (
            <Link
              to={menu.to}
              key={id}
              className={`p-1 mt-1 hover:disabled rounded-sm ${isActive(menu.to) ? 'bg-cyan-500 text-white hover:text-white' : 'text-black hover:text-black'}`}
            >
              <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
            </Link>
          ) : (
            <a
              name={menu.to}
              className={`p-1 mt-1 bg-opacity-20 rounded-sm ${isActive(menu.to) ? 'bg-cyan-500 text-white hover:text-white' : 'text-black hover:text-black'}`}
            >
              <ButtonMenu name={menu.to} label={menu.label} icon={menu.icon} />
            </a>
          );
        })}
      </ul>
      <ul className=''>
        {onSettingHandler && (
          <a
            onClick={onSettingHandler}
            className='cursor-pointer text-black hover:text-black'
          >
            <ButtonMenu
              name='vx-setting-button'
              label='setting'
              icon='settings'
            />
          </a>
        )}
        {onLogout && (
          <a
            onClick={onLogout}
            className='cursor-pointer text-black hover:text-black'
          >
            <ButtonMenu name='vx-logout-button' label='logout' icon='users' />
          </a>
        )}
        <div className='relative group'>
          <a className='cursor-pointer text-black hover:text-black'>
            <ButtonMenu name='vx-company-button' label='company' icon='logo' />
          </a>
          <div className='absolute left-full bottom-0 hidden group-hover:block bg-white shadow-xl rounded p-2 w-52 border border-gray-200'>
            {companies.map((company) => (
              <div
                key={company.id}
                className={`flex cursor-pointer w-full px-4 py-2 mb-1 flex-row justify-between items-center ${company.selected ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => setCompanySelected(company.id)}
              >
                <div>
                  <h4>{company.name}</h4>
                  <span>{company.role}</span>
                </div>
                <span className='vx-icon vx-users' />
              </div>
            ))}
          </div>
        </div>
      </ul>
    </nav>
  );
};
