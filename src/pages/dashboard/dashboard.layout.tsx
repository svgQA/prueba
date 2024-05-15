import { Input, Modal, Sidebar, Button } from '@/components/common';
import { PAGES_LIST, SIDEBAR_MENUS } from '@/utils';
import { signal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { Route } from 'wouter';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { FormsPage } from './forms/forms.page';
import { DevicesPage } from './devices/devices.page';
import { SSidebar } from '@/components/compose/settings';

const showSettingsModal = signal<boolean>(false);
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
        sidebar={<SSidebar id='' name='' />}
        header={
          <>
            <div className='w-48 flex items-center'>
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
      />
    </section>
  );
};
