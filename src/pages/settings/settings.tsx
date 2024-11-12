import { Button, Modal, Search } from '@/components/common';
import {
  CardSettingHeader,
  CardSettingMenu,
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
import { useEffect } from 'preact/hooks';
import { useLocation } from 'wouter';
import { RoutingContent } from './routing';

export const SettingsModal = () => {
  const menuSettings = useSignal<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);
  const menuInformationSelected = useSignal<IMenu>({
    description: '',
    label: '',
    to: '',
    id: '',
  });
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (getStatusSettingModal.value) {
      if (!menuInformationSelected.value.to) {
        const adminMenu = menuSettings.value[0]?.menus[0];
        if (adminMenu) {
          const to = `/setting${adminMenu.base}/`;
          console.log('MI OTRO MENU: ', to);
          menuInformationSelected.value = {
            ...adminMenu,
            to,
          };
          navigate(to);
        }
      }
    }
  }, [getStatusSettingModal.value]);

  const goBack = () => {};
  const goForward = () => {};

  const toggleTheme = (event: MouseEvent) => {
    event.stopPropagation();
    document.body.classList.toggle('dark');
  };

  const selectMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A') {
      const to = target.getAttribute('data-to');
      const label = target.getAttribute('data-label');
      const description = target.getAttribute('data-description');
      const id = target.getAttribute('id');
      if (!to || !label || !description || !id) return;
      menuInformationSelected.value = { to, description, label, id };
    }
  };

  return (
    <Modal
      open={getStatusSettingModal.value}
      onClose={toggleSettingModal}
      name='setting-modal'
      id='setting-modal'
      header={
        <>
          <div className='w-4/12 max-w-[30vh] flex items-center justify-center'>
            <Button
              id='setting-go-back'
              name='setting-go-back'
              onClick={goBack}
              type='button'
              rounded
              icon='210'
            ></Button>
            <Button
              id='setting-go-forward'
              name='setting-go-forward'
              onClick={goForward}
              type='button'
              rounded
              icon='212'
            ></Button>
            <Button
              id='setting-min-menu'
              name='setting-min-menu'
              onClick={toggleTheme}
              type='button'
              rounded
              icon='301'
            ></Button>
          </div>
          <Search
            id='search-general'
            name='search-general'
            placeholder='Search'
            keys={['id_1', 'id_2', 'id_3', 'id_4']}
          />
        </>
      }
    >
      <div
        onClick={selectMenu}
        className='w-3/12 max-w-72 min-w-64 p-1 max-h-[88vh]'
      >
        <CardSettingUser
          id='user-information'
          name='user-information'
          company={authModel.value.company}
          username={authModel.value.username}
          image={authModel.value.image}
          rol={authModel.value.rol}
        />
        <div className='vox-scroll-design max-h-[80vh] overflow-y-scroll'>
          {menuSettings.value.map((menu) => {
            const name = `${menu.label}-menus`;
            return (
              <CardSettingMenu
                key={name}
                id={name}
                name={name}
                base={menu.base}
                label={menu.label}
                menus={menu.menus}
                selected={menuInformationSelected.value}
              />
            );
          })}
        </div>
      </div>
      <div className='w-10/12 max-h-[86vh] min-h-96 px-2'>
        <CardSettingHeader
          id='setting-header'
          name='setting-header'
          title={menuInformationSelected.value.label}
          description={menuInformationSelected.value.description}
        />
        <section className='w-full h-[80vh]'>
          <RoutingContent />
        </section>
      </div>
    </Modal>
  );
};
