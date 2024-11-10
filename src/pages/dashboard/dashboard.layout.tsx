import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Route, Switch } from 'wouter';

/** ***********************************************************************
 * UTILS
 ** ***********************************************************************/
import { SIDEBAR_MENUS } from '@/utils/menus';
import { PAGES_LIST } from '@/utils/routing';

/** ***********************************************************************
 * COMPONENTS
 ** ***********************************************************************/
import { Sidebar, Loading } from '@/components/common';

/** ***********************************************************************
 * PAGES
 ** ***********************************************************************/
import { DevicesPage } from './devices/devices.page';
import { FormsPage } from './forms/forms.page';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';

/** ***********************************************************************
 * AMPLIFY AWS
 ** ***********************************************************************/
import { AuthAmplifyProps } from '../types';

/** ***********************************************************************
 * STORE SIGNALS
 ** ***********************************************************************/
import {
  getStatusOnBoardingModal,
  toggleSettingModal,
  closeOnBoardingModal,
  // openOnBoardingModal,
  getStatusLoading,
  openLoading,
  closeLoading,
} from '@/store/signals/modals';

/** ***********************************************************************
 * COMMENTS
 ** ***********************************************************************/
// import { hasUserTenant, useUserStore } from '@/store/slices';
import { BaseService } from '@/utils/network';
import { IconsModal, OnBordingModal } from '../globals';
import { SettingsModal } from '../settings/settings';

// const GENERAL_GROUP_MENU = 0,
//   SETTING_USER_MENU = 0;

/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = ({
  signOut,
}: AuthAmplifyProps) => {
  // const { setCompanies, setSelected } = useUserStore();

  useEffect(() => {
    BaseService.setLoading(openLoading, closeLoading);
    validateUser();
  }, []);

  const validateUser = async () => {
    /* [TODO]: Bad code */
    closeOnBoardingModal();

    /* [TODO]: Correct code */
    // const existTenant = await hasUserTenant(setCompanies, setSelected);
    // if (!existTenant) openOnBoardingModal();
    // else closeOnBoardingModal();
  };

  return (
    <section className='w-full h-full'>
      <Loading open={getStatusLoading.value} />
      <Sidebar
        id='sidebar'
        name='sidebar'
        onSettingHandler={toggleSettingModal}
        onHomeHandler={toggleSettingModal}
        menus={SIDEBAR_MENUS}
        isNavigation
        onLogout={signOut}
      />
      <div className='flex flex-col pl-20'>
        <Switch>
          <Route path={PAGES_LIST.HOME} component={MemosPage} />
          <Route path={PAGES_LIST.SHIFTS} component={ShiftsPage} />
          <Route path={PAGES_LIST.FORMS} component={FormsPage} />
          <Route path={PAGES_LIST.DEVICES} component={DevicesPage} />
        </Switch>
      </div>
      <SettingsModal />
      <OnBordingModal
        closed={getStatusOnBoardingModal.value}
        onLogout={signOut || (() => {})}
      />
      <IconsModal />
    </section>
  );
};
