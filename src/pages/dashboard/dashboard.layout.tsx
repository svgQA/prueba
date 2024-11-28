import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Route, Router } from 'wouter';
import { Suspense, lazy } from 'preact/compat';
import { memo } from 'preact/compat';

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
  openOnBoardingModal,
  getStatusLoading,
  openLoading,
  closeLoading,
} from '@/store/signals/modals';

/** ***********************************************************************
 * COMMENTS
 ** ***********************************************************************/
import { hasUserTenant, useUserStore } from '@/store/slices';
import { BaseService } from '@/utils/network';
import { IconsModal, OnBordingModal } from '../globals';
import { SettingsModal } from '../settings/settings';

// const GENERAL_GROUP_MENU = 0,
//   SETTING_USER_MENU = 0;

/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = memo(
  ({ signOut }: AuthAmplifyProps) => {
    const { setSelected, companies, setCompanies, getSelected, getUser } =
      useUserStore();

    const setCompanySelected = (company: string) => {
      setSelected(company);
      closeOnBoardingModal();
    };

    useEffect(() => {
      BaseService.setLoading(openLoading, closeLoading);
      BaseService.setUser(getSelected, getUser);
      validateUser();
    }, []);

    const validateUser = async () => {
      /* [TODO]: Bad code */
      // closeOnBoardingModal();

      /* [TODO]: Correct code */

      const existTenant = await hasUserTenant(setCompanies, setSelected);
      if (!existTenant) openOnBoardingModal();
      else closeOnBoardingModal();
    };

    return (
      <section className='w-full h-screen text-t-light dark:text-t-dark overflow-scroll vox-scroll-design'>
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
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Route
                path={PAGES_LIST.HOME}
                component={lazy(() => Promise.resolve({ default: MemosPage }))}
              />
              <Route
                path={PAGES_LIST.SHIFTS}
                component={lazy(() => Promise.resolve({ default: ShiftsPage }))}
              />
              <Route
                path={PAGES_LIST.FORMS}
                component={lazy(() => Promise.resolve({ default: FormsPage }))}
              />
              <Route
                path={PAGES_LIST.DEVICES}
                component={lazy(() =>
                  Promise.resolve({ default: DevicesPage })
                )}
              />
            </Suspense>
          </Router>
        </div>
        <SettingsModal />
        <OnBordingModal
          closed={getStatusOnBoardingModal.value}
          onLogout={signOut || (() => {})}
        >
          {companies.map((company) => (
            <div
              key={`selector-company-${company.name}`}
              name={company.id}
              className='w-5/12 float-left cursor-pointer py-3 rounded-lg flex flex-row justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-200 dark:border-gray-700'
              onClick={() => setCompanySelected(company.id)}
              tabIndex={0}
            >
              <div className='flex flex-row items-center space-x-4 px-2'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold'>
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex flex-col'>
                  <h4 className='font-medium text-lg'>{company.name}</h4>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {company.id}
                  </span>
                </div>
                <span className='bg-gradient-to-r from-teal-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                  {company.role}
                </span>
              </div>
              <span className='vx-icon vx-arrow-right text-gray-400' />
            </div>
          ))}
        </OnBordingModal>
        <IconsModal />
      </section>
    );
  }
);
