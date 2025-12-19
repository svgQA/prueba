import { type FunctionComponent } from 'preact';

import { type ISidebarProps } from './interface';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useLocation } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import {
  getStatusSettingModal,
  getRedirectSettingModal,
} from '@/store/signals/modals';
import { useSignal } from '@preact/signals';
import { MenuItem } from './menu';
import { validateModuleState } from '@/store/signals/access/permission';
import { Button } from '../button/button';

export const Sidebar: FunctionComponent<ISidebarProps> = ({
  id,
  menus,
  onSettingHandler,
  onHomeHandler,
  isNavigation = false,
  onHandlerClick,
}: ISidebarProps) => {
  const [location, navigate] = useLocation();
  const menuSelected = useSignal<string | null>('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!getStatusSettingModal.value) {
      if (!menuSelected.value || menuSelected.value.includes('setting')) {
        const firstMenu = menus[0];
        if (firstMenu)
          if (firstMenu) {
            menuSelected.value = firstMenu.to;
            if (getRedirectSettingModal.value) {
              return navigate(getRedirectSettingModal.value);
            }
            navigate(firstMenu.to);
          }
      }
    }
  }, [getStatusSettingModal.value]);

  useEffect(() => {
    menuSelected.value = location;
  }, [location]);

  const getSelected = useMemo(
    () => (to: string) =>
      to === location
        ? 'bg-ternary/10 !border-r-teal-600 text-ternary dark:text-white dark:bg-ternary/40'
        : 'text-gray-700 border-tranparent dark:text-gray-200 hover:bg-ternary/20',
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

  const toggleSidebar = (e: any) => {
    e.preventDefault();
    setSidebarOpen((prev) => !prev);
  };

  return (
    <nav
      id={`${id}-nav`}
      className={`fixed left-0 top-0 transform pb-3 flex flex-col justify-between h-screen dark:border-gray-700 z-20 bg-b-white dark:bg-b-dark-light max-w-16 min-w-16 transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className='w-full flex flex-row items-start px-10 absolute -right-11 top-2 lg:hidden border-r-ternary'>
        <Button
          id='btn-toggle-menu'
          name='btn-toggle-menu'
          onClick={toggleSidebar}
          square
          borderless
          icon='011'
          aria-label='Toggle sidebar'
          aria-expanded={isSidebarOpen}
        />
      </div>
      {onHomeHandler && (
        <ul className='flex flex-col items-center'>
          <span onClick={onHomeHandler} className='cursor-pointer'>
            <ButtonMenu name='vx-home-button' label='home' icon='023' />
          </span>
        </ul>
      )}
      <div>
        {/*
        <div className='flex relative flex-col items-center justify-center h-14 bg-ternary mb-2'>
          <span className='vx-icon vx-icon-420'></span>
        </div>
        */}
        <ul
          className='flex flex-col justify-between capitalize gap-y-3'
          onClick={selectMenu}
        >
          {menus.map(
            (menu) =>
              validateModuleState(menu.id) && (
                <MenuItem
                  key={menu.to}
                  menu={menu}
                  isNavigation={isNavigation}
                  getSelected={getSelected}
                />
              )
          )}
        </ul>
      </div>
      <ul className='flex flex-col justify-between capitalize'>
        {validateModuleState('setting') && (
          <span
            onClick={onSettingHandler}
            className='cursor-pointer p-1 mt-1 hover:disabled rounded-sm text-gray-700 dark:text-gray-200'
          >
            <ButtonMenu name='vx-setting-button' label='t_setting' icon='159' />
          </span>
        )}
      </ul>
    </nav>
  );
};
