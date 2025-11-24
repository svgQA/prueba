import { useCallback, useEffect, useState } from 'preact/hooks';
import { Modal } from '@/components/common/modal/modal';
import { CardSettingHeader, CardSettingUser } from '@/components/compose/modal';
import { MODAL_SIDEBAR_MENUS } from '@/utils/menus';
import { MenuButtons } from './components/header';
import { MenuList } from './components/menu';
import { RoutingContent } from './routing';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import {
  getMenuSelectedStorage,
  getModalStatusStorage,
  getStatusSettingModal,
  toggleSettingModal,
} from '@/store/signals/modals';
import { IMenu } from '@/components/common/utils/interface';
import { validateSettingModuleState } from '@/store/signals/access/permission';

export const SettingsModal = () => {
  const { user } = useUserStore();
  const [expand, setExpand] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const { go, goBack, goForward, current, created, settings } = useNavigation();

  useEffect(() => {
    if (settings) {
      if (!current.to) {
        // let adminMenu;
        // for (const menus of MODAL_SIDEBAR_MENUS) {
        //   adminMenu = menus.menus.find((menu) => menu.show);
        //   if (adminMenu) break;
        // }
        // if (adminMenu) {
        //   go({
        //     ...adminMenu,
        //     to: `/setting${adminMenu.base}${adminMenu.to || '/'}`,
        //   });
        // }

        // Find the first menu that has permissions
        let firstAvailableMenu;

        for (const menuGroup of MODAL_SIDEBAR_MENUS) {
          if (menuGroup.show && validateSettingModuleState(menuGroup.id)) {
            firstAvailableMenu = menuGroup.menus.find(
              (menu) => menu.show && validateSettingModuleState(menu.id)
            );
            if (firstAvailableMenu) break;
          }
        }

        if (firstAvailableMenu) {
          go({
            ...firstAvailableMenu,
            to: `/setting${firstAvailableMenu.base}${firstAvailableMenu.to || '/'}`,
          });
        }
      } else {
        go(current);
      }
    } else {
      const stage = getModalStatusStorage();
      if (stage) {
        const menuSelected = getMenuSelectedStorage();
        go(menuSelected as IMenu, true);
      }
    }
  }, [settings]);

  // Al seleccionar un item del menú lateral
  const selectMenu = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A' || target.nodeName === 'SPAN') {
      const to = target.getAttribute('data-to');
      const label = target.getAttribute('data-label');
      const description = target.getAttribute('data-description');
      const id = target.getAttribute('id');
      if (!to || !label || !description || !id) return;
      if (id === created.id) return;

      go({ to, label, description, id });
    }
  }, []);

  return (
    <Modal
      open={getStatusSettingModal.value}
      onClose={toggleSettingModal}
      name='setting-modal'
      id='setting-modal'
      expandable
      theme
      setExpandable={setExpand}
      header={
        <div className='flex flex-row w-full items-center justify-between px-3'>
          <MenuButtons goBack={goBack} goForward={goForward} />
          <LanguageSwitcher />
        </div>
      }
    >
      <div className='flex flex-col w-full h-full gap-3 md:gap-6'>
        <div className='flex items-center justify-between md:hidden px-3'>
          <button
            type='button'
            className='px-3 py-2 text-sm font-semibold border-2 rounded-lg border-b-light-light dark:border-b-dark-light bg-white dark:bg-dark-bg'
            onClick={() => setShowMobileMenu((state) => !state)}
          >
            {showMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
          </button>
        </div>

        <div className='flex flex-col w-full h-full gap-4 md:gap-6 md:flex-row relative'>
          <div
            onClick={(event) => {
              selectMenu(event);
              setShowMobileMenu(false);
            }}
            className={`${showMobileMenu ? 'flex fixed inset-0 z-30 p-4 shadow-2xl' : 'hidden md:flex'} w-full max-w-80 md:max-w-80 md:min-w-60 border-b-2 md:border-b-0 md:border-r-2 border-b-light-light md:border-r-b-light-light dark:border-b-dark-light flex-col gap-1 bg-white dark:bg-dark-bg md:static md:p-0 md:shadow-none rounded-lg md:rounded-none mx-auto md:mx-0`}
          >
            <CardSettingUser
              id='user-information'
              name='user-information'
              company='Inndico'
              username={`${user?.name} ${user?.surname}`}
              image={user?.image || ''}
              rol={user?.userType || ''}
            />
            <MenuList menuSettings={MODAL_SIDEBAR_MENUS} expand={expand} />
          </div>
          <div
            className={`w-full relative ${expand ? 'max-h-[88vh] min-h-[88vh]' : 'max-h-[73vh] min-h-[73vh]'} ${showMobileMenu ? 'opacity-20 pointer-events-none md:opacity-100 md:pointer-events-auto' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <CardSettingHeader id='setting-header' name='setting-header' />
            <div className='w-full p-2 border-t-2 py-4 dark:border-b-dark-light border-b-light-light'>
              <RoutingContent />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
