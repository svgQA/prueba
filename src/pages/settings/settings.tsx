import { Modal, Search } from '@/components/common';
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
import { authModel } from '@/store/signals/access';

import { IMenu } from '@/components/common/interface';
import { useSignal } from '@preact/signals';
import { useEffect, useCallback } from 'preact/hooks';
import { useLocation } from 'wouter';
import { MenuButtons, MenuList } from './components';
import { RoutingContent } from './routing';

export const SettingsModal = () => {
  const menuSettings = useSignal<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);
  const historyLocation = useSignal<IMenu[]>([]);
  const currentPosition = useSignal<number>(0);
  const menuInformationSelected = useSignal<IMenu>({
    description: '',
    label: '',
    to: '',
    id: '',
  });
  const [_, navigate] = useLocation();

  // TODO: Revisar esta parte para cuando se abre y ya existia un menu seleccionado.
  useEffect(() => {
    if (getStatusSettingModal.value) {
      if (!menuInformationSelected.value.to) {
        const adminMenu = menuSettings.value[0]?.menus[0];
        if (adminMenu) {
          const menuSelected = {
            ...adminMenu,
            to: `/setting${adminMenu.base}/`,
          };
          appendHistory(menuSelected);
          navigate(menuSelected.to);
        }
      }
    }
  }, [getStatusSettingModal.value]);

  const setMenuSelected = (menu: IMenu) => {
    menuInformationSelected.value = menu;
    navigate(menu.to);
  };

  const appendHistory = (menu: IMenu) => {
    const position = currentPosition.value;
    const cleanHistory = historyLocation.value.slice(0, position + 1);
    currentPosition.value = cleanHistory.length;
    historyLocation.value = [...cleanHistory, menu];
    setMenuSelected(menu);
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

  const toggleTheme = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    document.body.classList.toggle('dark');
  }, []);

  const selectMenu = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A') {
      const to = target.getAttribute('data-to');
      const label = target.getAttribute('data-label');
      const description = target.getAttribute('data-description');
      const id = target.getAttribute('id');
      if (!to || !label || !description || !id) return;
      const menuSelected = { to, description, label, id };
      appendHistory(menuSelected);
    }
  }, []);

  return (
    <Modal
      open={getStatusSettingModal.value}
      onClose={toggleSettingModal}
      name='setting-modal'
      id='setting-modal'
      header={
        <>
          <MenuButtons
            goBack={goBack}
            goForward={goForward}
            toggleTheme={toggleTheme}
          />
          <div className='min-w-40 flex flex-row'>
            <Search
              id='search-general'
              name='search-general'
              placeholder='Search'
            />
          </div>
        </>
      }
    >
      <div
        onClick={selectMenu}
        className='max-w-48 min-w-44 p-0.5 max-h-[88vh]'
      >
        <div className='mr-0.5'>
          <CardSettingUser
            id='user-information'
            name='user-information'
            company={authModel.value.company}
            username={authModel.value.username}
            image={authModel.value.image}
            rol={authModel.value.rol}
          />
        </div>
        <MenuList
          menuSettings={menuSettings}
          menuInformationSelected={menuInformationSelected.value}
        />
      </div>
      <div className='w-full mt-0.5'>
        <CardSettingHeader
          id='setting-header'
          name='setting-header'
          title={menuInformationSelected.value.label}
          description={menuInformationSelected.value.description}
        />

        <div className='relative max-h-[79vh] overflow-y-auto overflow-x-hidden vox-scroll-design w-full px-1'>
          <RoutingContent />
        </div>
      </div>
    </Modal>
  );
};
