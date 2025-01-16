import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Route, Router } from 'wouter';
import { Suspense, lazy } from 'preact/compat';
import { memo } from 'preact/compat';
import 'react-toastify/dist/ReactToastify.css';

/** ***********************************************************************
 * UTILS
 ** ***********************************************************************/
import { SIDEBAR_MENUS } from '@/utils/menus';
import { PAGES_LIST } from '@/utils/routing';

/** ***********************************************************************
 * PAGES
 ** ***********************************************************************/
import { DevicesPage } from './devices/devices.page';
import { FormsPage } from './forms/forms.page';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { AccesPage } from './access/access.page';
import { CorrespondencePage } from './correspondence/correspondence.page';

/** ***********************************************************************
 * STORE SIGNALS
 ** ***********************************************************************/
import {
  getStatusOnBoardingModal,
  toggleSettingModal,
  closeOnBoardingModal,
  openOnBoardingModal,
  openLoading,
  closeLoading,
} from '@/store/signals/modals';

/** ***********************************************************************
 * COMMENTS
 ** ***********************************************************************/
import { hasUserTenant, useUserStore } from '@/store/slices';
import { BaseService } from '@/utils/network';
import { SettingsModal } from '../settings/settings';
import { ToastContainer } from 'react-toastify';
import { Loading } from '@/components/common/loading/loading';
import { Sidebar } from '@/components/common/sidebar/sidebar';
import { OnBordingModal } from '../globals/onbording/onboarding';
import { IconsModal } from '../globals/icons/icons';
import { AuthAmplifyProps } from '../interface';
import { useWebSocket } from '@/utils/socket';

// const GENERAL_GROUP_MENU = 0,
//   SETTING_USER_MENU = 0;

/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = memo(
  ({ signOut }: AuthAmplifyProps) => {
    const wsManager = useWebSocket();

    const {
      setSelected,
      companies,
      setCompanies,
      getSelected,
      setToken,
      getToken,
      getUrlSocket,
      setCognito,
    } = useUserStore();

    const setCompanySelected = (company: string) => {
      setSelected(company);
      closeOnBoardingModal();
      // getProfile();
      initSocket();
    };

    useEffect(() => {
      BaseService.setLoading(openLoading, closeLoading);
      BaseService.setUser(getSelected, getToken);
      validateUser();
    }, []);

    const validateUser = async () => {
      /* [TODO]: Bad code */
      // closeOnBoardingModal();
      /* [TODO]: Correct code */
      const existTenant = await hasUserTenant(
        setCompanies,
        setSelected,
        setToken,
        setCognito
      );
      if (!existTenant) openOnBoardingModal();
      else closeOnBoardingModal();
    };

    // const getProfile = async () => {
    //   const response = await UserService.profile();
    //   if (!response.getStatus()) return;
    //   const user = response.getOne();
    //   setUser({
    //     id: user.id,
    //     name: user.name,
    //     phone: user.phone,
    //     address: user.email,
    //     cognito: user.cognitoId,
    //   });
    // };

    const initSocket = () => {
      wsManager.connect(getUrlSocket());
    };

    return (
      <section className='w-full h-screen text-t-light dark:text-t-dark overflow-scroll vox-scroll-design'>
        <Loading />
        <Sidebar
          id='sidebar'
          name='sidebar'
          onSettingHandler={toggleSettingModal}
          onHomeHandler={toggleSettingModal}
          menus={SIDEBAR_MENUS}
          isNavigation
          onLogout={signOut}
        />
        <div className='flex flex-col pl-[4.5rem]'>
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
                path={PAGES_LIST.ACCESS}
                component={lazy(() => Promise.resolve({ default: AccesPage }))}
              />
              <Route
                path={PAGES_LIST.CORRESPONDENCE}
                component={lazy(() =>
                  Promise.resolve({ default: CorrespondencePage })
                )}
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
                    {company.tenant_id}
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
        <ToastContainer />
      </section>
    );
  }
);
