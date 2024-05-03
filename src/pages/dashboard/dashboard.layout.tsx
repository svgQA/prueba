import { Sidebar } from '@/components/common';
import { PAGES_LIST, SIDEBAR_MENUS } from '@/utils';
import { signal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { Route } from 'wouter';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { FormsPage } from './forms/forms.page';
import { DevicesPage } from './devices/devices.page';

const showSettingsModal = signal<boolean>(false);
export const DashboardLayout: FunctionComponent = () => {
  const onSettingHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };
  const onHomeHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };
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
    </section>
  );
};
