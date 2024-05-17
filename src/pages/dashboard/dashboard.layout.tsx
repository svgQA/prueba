import { Input, Modal, Sidebar, Button, Card } from '@/components/common';
import { PAGES_LIST, SIDEBAR_MENUS } from '@/utils';
import { signal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { Route } from 'wouter';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { FormsPage } from './forms/forms.page';
import { DevicesPage } from './devices/devices.page';
import { CardSettingMenu } from '@/components/compose/modal';
import { MODAL_SIDEBAR_MENUS } from '@/utils/constants/modal/sidebar';

const showSettingsModal = signal<boolean>(true);
export const DashboardLayout: FunctionComponent = () => {
  const onSettingHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };
  const onHomeHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };

  const goBack = () => {};
  const goForward = () => {};
  const minMenu = () => {};

  return (
    <section className='w-screen h-screen'>
      <Sidebar
        id='sidebar'
        name='sidebar'
        onSettingHandler={onSettingHandler}
        onHomeHandler={onHomeHandler}
        menus={SIDEBAR_MENUS}
        isNavigation
      />
      <div className='flex flex-col pl-20 w-full bg-green-100 pr-2'>
        <Route path={PAGES_LIST.HOME} component={MemosPage} />
        <Route path={PAGES_LIST.SHIFTS} component={ShiftsPage} />
        <Route path={PAGES_LIST.FORMS} component={FormsPage} />
        <Route path={PAGES_LIST.DEVICES} component={DevicesPage} />
      </div>
      <Modal
        open={showSettingsModal.value}
        onClose={onSettingHandler}
        name='setting-modal'
        id='setting-modal'
        header={
          <>
            <div className='w-4/12 flex items-center justify-center'>
              <Button
                id='setting-go-back'
                name='setting-go-back'
                onClick={goBack}
                type='button'
                rounded
                icon='users'
              ></Button>
              <Button
                id='setting-go-forward'
                name='setting-go-forward'
                onClick={goForward}
                type='button'
                rounded
                icon='apps'
              ></Button>
              <Button
                id='setting-min-menu'
                name='setting-min-menu'
                onClick={minMenu}
                type='button'
                rounded
                icon='graph'
              ></Button>
            </div>
            <Input
              id='setting-search'
              name='setting-search'
              placeholder='search'
              icon='search'
              type='text'
            />
          </>
        }
        body={
          <>
            <div className='w-3/12 bg-teal-200 p-1 max-h-[88vh] overflow-y-scroll'>
              <Card id='user-information' name='user-information'>
                <div className='flex flex-row'>
                  <span className='w-3/12 px-2 mr-1 bg-pink-200'>Image</span>
                  <div className='w-full px-2 bg-purple-200'>
                    <span className='pr-1'>name</span>
                    <span className='pr-1'>surname</span>
                    <p className='font-bold'>company</p>
                  </div>
                </div>
              </Card>
              {MODAL_SIDEBAR_MENUS.map((menu) => {
                const name = `${menu.label}-menus`;
                return (
                  <CardSettingMenu
                    key={name}
                    id={name}
                    name={name}
                    label={menu.label}
                    menus={menu.menus}
                  />
                );
              })}
            </div>
            <div className='w-10/12 max-h-[86vh] min-h-96 bg-green-500'></div>
          </>
        }
      />
    </section>
  );
};
