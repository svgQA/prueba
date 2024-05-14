import { type FunctionComponent } from 'preact';
import { type IMenu, type ISidebarProps } from './interface';
import { useEffect, useState } from 'preact/hooks';
import { Link } from 'wouter';

export const Sidebar: FunctionComponent<ISidebarProps> = ({
  id,
  name,
  menus,
  onSettingHandler,
  onHomeHandler,
  isNavigation = false,
  onHandlerClick,
  position = 'fixed',
}: ISidebarProps) => {
  const [menuSelected, setMenuSelected] = useState<string | null>('');

  useEffect(() => {
    setMenuSelected(menus[0].to);
  }, []);

  const isActive = (value: string) => {
    return value === menuSelected;
  };

  const getMenu = (menu: IMenu) => (
    <div className='h-12 text-center relative cursor-pointer content-end px-1'>
      <span
        name={menu.to}
        className={'absolute w-full left-0 top-0 vx-icon vx-' + menu.icon}
      ></span>
      <h6 className='text-xs'>{menu.label}</h6>
    </div>
  );

  const selectMenu = (event: MouseEvent) => {
    if (!isNavigation) {
      event.preventDefault();
    }
    const target = event.target as HTMLElement;
    if (target.nodeName === 'SPAN') {
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
    <aside className='pr-16 h-1'>
      <nav
        id={`${id}-nav`}
        name={name}
        className={`bg-teal-400 h-full ${position} p-1 flex flex-col justify-between`}
      >
        {onHomeHandler && (
          <ul>
            <a onClick={onHomeHandler} className='cursor-pointer'>
              <div className='text-center'>
                <span className='vx-icon vx-logo'></span>
                <h6 className='text-xs'>Home</h6>
              </div>
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
                className={`p-1 mt-1 bg-opacity-20 rounded-sm ${isActive(menu.to) ? 'bg-red-800' : 'bg-blue-800'}`}
              >
                {getMenu(menu)}
              </Link>
            ) : (
              <a
                name={menu.to}
                className={`p-1 mt-1 bg-opacity-20 rounded-sm ${isActive(menu.to) ? 'bg-red-800' : 'bg-blue-800'}`}
              >
                {getMenu(menu)}
              </a>
            );
          })}
        </ul>
        {onSettingHandler && (
          <ul className=''>
            <a onClick={onSettingHandler} className='cursor-pointer'>
              <div className='text-center'>
                <span className='vx-icon vx-settings'></span>
                <h6 className='text-xs'>Settings</h6>
              </div>
            </a>
          </ul>
        )}
      </nav>
    </aside>
  );
};
