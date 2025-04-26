import {
  CardSettingHeader,
  CardSettingUser,
  IModalSidebarMenu,
} from '@/components/compose/modal';
import { MODAL_SIDEBAR_MENUS } from '@/utils/menus';

import {
  getStatusSettingModal,
  toggleSettingModal,
} from '@/store/signals/modals';

import { useSignal } from '@preact/signals';
import { useCallback } from 'preact/hooks';
import { useLocation } from 'wouter';
import { RoutingContent } from './routing';
import { IMenu } from '@/components/common/utils/interface';
import { Modal } from '@/components/common/modal/modal';
import { MenuButtons } from './components/header';
import { Search } from '@/components/common/search/search';
import { MenuList } from './components/menu';
import {
  appendHistory,
  currentPosition,
  historyLocation,
  menuInformationSelected,
  setMenu,
} from './store/settings';
import { useUserStore } from '@/store/slices';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
export const SettingsModal = () => {
  const { user } = useUserStore();
  const menuSettings = useSignal<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);
  const [_, navigate] = useLocation();

  // TODO: Revisar esta parte para cuando se abre y ya existia un menu seleccionado.
  // useEffect(() => {
  //   if (getStatusSettingModal.value) {
  //     if (!menuInformationSelected.value.to) {
  //       const adminMenu = menuSettings.value[0]?.menus[0];
  //       if (adminMenu) {
  //         const menuSelected = {
  //           ...adminMenu,
  //           to: `/setting${adminMenu.base}/`,
  //         };
  //         appendHistory(menuSelected, setMenuSelected);
  //         navigate(menuSelected.to);
  //       }
  //     }
  //   }
  // }, [getStatusSettingModal.value]);

  const setMenuSelected = (menu: IMenu) => {
    setMenu(menu);
    navigate(menu.to);
  };

  const goBack = useCallback(() => {
    if (currentPosition.value === 0) return;
    --currentPosition.value;
    setMenuSelected(historyLocation.value[currentPosition.value]);
  }, []);

  const goForward = useCallback(() => {
    if (currentPosition.value === historyLocation.value.length - 1) return;
    ++currentPosition.value;
    setMenuSelected(historyLocation.value[currentPosition.value]);
  }, []);

  const selectMenu = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A' || target.nodeName === 'SPAN') {
      const to = target.getAttribute('data-to');
      const label = target.getAttribute('data-label');
      const description = target.getAttribute('data-description');

      const id = target.getAttribute('id');
      if (!to || !label || !description || !id) return;
      const menuSelected = { to, description, label, id };
      appendHistory(menuSelected, setMenuSelected);
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
      header={
        <div className='flex flex-row w-full items-center justify-between'>
          <MenuButtons goBack={goBack} goForward={goForward} />
          <LanguageSwitcher />
          <div className='ml-5 flex flex-row w-9/12'>
            <Search
              id='search-general'
              name='search-general'
              placeholder='Search'
            />
          </div>
        </div>
      }
    >
      <div
        onClick={selectMenu}
        className='max-w-80 min-w-44 max-h-[90vh] border-r-2 border-gray-50 dark:border-b-dark-light'
      >
        <div className='border-b-2 border-b-gray-50 dark:border-b-dark-light'>
          <CardSettingUser
            id='user-information'
            name='user-information'
            company={'Inndico'}
            username={user?.name + ' ' + user?.surname}
            image={user?.image || ''}
            rol={user?.userType || ''}
          />
        </div>
        <MenuList
          menuSettings={menuSettings}
          menuInformationSelected={menuInformationSelected.value}
        />
      </div>
      <div className='w-full'>
        <CardSettingHeader
          id='setting-header'
          name='setting-header'
          title={menuInformationSelected.value.label}
          description={menuInformationSelected.value.description}
        />
        <div className='relative max-h-[72vh] min-h-[71.5vh] overflow-y-auto overflow-x-hidden vox-scroll-design w-full p-2'>
          <RoutingContent />
        </div>
      </div>
    </Modal>
  );
};
