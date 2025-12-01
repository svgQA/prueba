import { type FunctionComponent } from 'preact';

import { type ISidebarProps } from './interface';
import { useEffect, useMemo } from 'preact/hooks';
import { useLocation } from 'wouter';
import { ButtonMenu } from '../button/menu/button';
import {
  getStatusSettingModal,
  getRedirectSettingModal,
} from '@/store/signals/modals';
import { useSignal } from '@preact/signals';
import { MenuItem } from './menu';
import { validateModuleState } from '@/store/signals/access/permission';

export const Sidebar: FunctionComponent<ISidebarProps> = ({
  id,
  menus,
  onSettingHandler,
  onHomeHandler,
  isNavigation = false,
  onHandlerClick,
  isOpen = false,
}: ISidebarProps) => {
  const [location, navigate] = useLocation();
  const menuSelected = useSignal<string | null>('');

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
        ? 'bg-primary-opacity dark:bg-blue-900/50'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
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
      className={`fixed left-0 top-0 transform px-1 py-3 flex flex-col justify-between h-screen dark:border-gray-700 z-20 bg-b-white dark:bg-b-dark-light max-w-16 min-w-16 transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {onHomeHandler && (
        <ul className='flex flex-col items-center'>
          <span onClick={onHomeHandler} className='cursor-pointer'>
            <ButtonMenu name='vx-home-button' label='home' icon='023' />
          </span>
        </ul>
      )}
      <ul
        className='flex flex-col justify-between capitalize'
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
