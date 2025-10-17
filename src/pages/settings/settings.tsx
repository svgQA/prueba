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
      <div
        onClick={selectMenu}
        className='max-w-80 min-w-60 border-r-2 border-r-b-light-light dark:border-b-dark-light flex flex-col gap-1'
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
        className={`w-full relative ${expand ? 'max-h-[88vh] min-h-[88vh]' : 'max-h-[73vh] min-h-[73vh]'}`}
        onClick={selectMenu}
      >
        <CardSettingHeader id='setting-header' name='setting-header' />
        <div className='w-full p-2 border-t-2 py-4 dark:border-b-dark-light border-b-light-light'>
          <RoutingContent />
        </div>
      </div>
    </Modal>
  );
};
