import { type FunctionComponent } from 'preact';

import { type ISidebarProps } from './interface';
import { useEffect, useMemo } from 'preact/hooks';
import { useLocation } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import { useUserStore } from '@/store/slices';
import {
  closeOnBoardingModal,
  getStatusSettingModal,
} from '@/store/signals/modals';
import { useSignal } from '@preact/signals';
import { CompanyItem } from './company';
import { MenuItem } from './menu';

export const Sidebar: FunctionComponent<ISidebarProps> = ({
  id,
  menus,
  onSettingHandler,
  onHomeHandler,
  isNavigation = false,
  onHandlerClick,
  onLogout,
}: ISidebarProps) => {
  const [location, navigate] = useLocation();
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
    if (!getStatusSettingModal.value) {
      if (!menuSelected.value || menuSelected.value.includes('setting')) {
        const firstMenu = menus[0];
        if (firstMenu)
          if (firstMenu) {
            menuSelected.value = firstMenu.to;
            navigate(firstMenu.to);
          }
      }
    }
  }, [getStatusSettingModal.value]);

  useEffect(() => {
    menuSelected.value = location;
  }, [location]);

  const getSelected = useMemo(
    () => (to: string) => (to === location ? 'text-primary' : ''),
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
      className='fixed left-0 top-0 transform px-1 flex flex-col justify-between h-screen border-r border-b-light-dark dark:border-b-dark-light z-20 bg-b-light dark:bg-b-dark-light'
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
        <div className='relative group'>
          <a className='cursor-pointer'>
            <ButtonMenu name='vx-company-button' label='company' icon='281' />
          </a>
          {companies && companies.length > 1 && (
            <div className='absolute z-50 left-16 p-3 bottom-0 hidden group-hover:block w-52'>
              <div className='border-2 rounded-md dark:border-b-dark-light'>
                {companies.map((company) => (
                  <CompanyItem
                    key={company.id}
                    company={company}
                    setCompanySelected={setCompanySelected}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <span
          onClick={onSettingHandler}
          className='cursor-pointer p-1 mt-1 hover:disabled rounded-sm'
        >
          <ButtonMenu name='vx-setting-button' label='setting' icon='169' />
        </span>

        {onLogout && (
          <a onClick={onLogout} className='cursor-pointer'>
            <ButtonMenu name='vx-logout-button' label='logout' icon='225' />
          </a>
        )}
      </ul>
    </nav>
  );
};
