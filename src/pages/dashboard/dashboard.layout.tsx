import { type FunctionComponent } from 'preact';
import { Route, Router } from 'wouter';
import { lazy, Suspense, useEffect } from 'preact/compat';
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
import { UsersPage } from './users/users.page';

/** ***********************************************************************
 * STORE SIGNALS
 ** ***********************************************************************/
import { toggleSettingModal } from '@/store/signals/modals';

/** ***********************************************************************
 * COMMENTS
 ** ***********************************************************************/
import { SettingsModal } from '../settings/settings';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '@/components/common/sidebar/sidebar';
import { AuthAmplifyProps } from '@/utils/types/auth.interface';
import { HistoryNotificationsPage } from './history/history.page';
import { WebSocketProvider } from '@/utils/socket';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { CustomSwitcher } from '@/components/common/CustomSwitcher';
import { Loading } from '@/components/common/loading/loading';
import { hasUserTenant, useUserStore } from '@/store/slices';
import { localStorage } from '@/utils/storage';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ThemeButton } from '@/components/compose/button';
import { Button } from '@/components/common/button/button';
import { CompanyService } from '@/services';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { Avatar } from '@/components/common/Avatar';
// import { setUser } from '../settings/general/user/create/store/user';

// import { IconsModal } from '../globals/icons/icons';
// import { IconsModal } from '../globals/icons/icons';
// import { OnBordingModal } from '../globals/onbording/onboarding';

/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = memo(
  ({ signOut }: AuthAmplifyProps) => {
    const {
      setCompanies,
      companies,
      selectedCompany,
      setSelectedCompany,
      setToken,
      setCognito,
      setTenant,
      setUser,
      getLoaded,
      setLoaded,
      user,
    } = useUserStore();

    useEffect(() => {
      validateUser();
    }, []);

    const validateUser = async () => {
      const result = await hasUserTenant(
        setToken,
        setCognito,
        setTenant,
        setUser,
        getLoaded
      );
      setLoaded(result);

      if (result) {
        getCompanies();
      }
    };

    const getCompanies = async () => {
      const company = await CompanyService.getCompanyList();

      if (!company.getStatus()) return;
      const companies = company.getMany();

      if (companies.length === 0) return;
      setCompanies(companies);

      const selectedCompany = await localStorage.get('company');
      if (selectedCompany) {
        setSelectedCompany(Number(selectedCompany));
      } else {
        if (companies.length === 1) {
          const firstCompany = companies[0].value;
          setSelectedCompany(Number(firstCompany));
        }
      }
    };

    const handleCompanyChange = (value: string | number) => {
      localStorage.set('company', value);
      setSelectedCompany(Number(value));
    };

    const handleUserAction = (value: string | number) => {
      if (value === 1) {
        toggleSettingModal();
      } else if (value === 2) {
        signOut?.();
      }
    };

    return (
      <section className='bg-b-content dark:bg-b-dark w-full h-screen text-t-light dark:text-t-dark overflow-scroll vox-scroll-design'>
        <Loading />
        <Sidebar
          id='sidebar'
          name='sidebar'
          onSettingHandler={toggleSettingModal}
          onHomeHandler={toggleSettingModal}
          menus={SIDEBAR_MENUS}
          isNavigation
          // onLogout={signOut}
        />
        <div className='flex flex-col pl-[4.5rem]'>
          <header className='h-14 flex flex-row items-center justify-between sticky top-0 bg-b-content dark:bg-b-dark z-10'>
            <div className='flex flex-row gap-2 items-center ml-8'>
              <TextEllipsis text={user?.name || ''} maxWidth='100px' />
              <Avatar
                name={user?.name || ''}
                src={user?.image || ''}
                size='sm'
                square
              />
            </div>
            <div className='flex flex-row px-6 gap-4 justify-between items-center'>
              <LanguageSwitcher borderless />
              <CustomSwitcher
                options={companies}
                value={selectedCompany?.value}
                onChange={handleCompanyChange}
                icon='023'
                borderless
              />
              <div className='flex flex-row gap-4 items-center justify-center'>
                <ThemeButton unpadded borderless />
                <Button
                  name='user-action'
                  icon='317'
                  iconSize='sm'
                  borderless
                  unpadded
                />
                <Dropdown
                  options={[
                    { label: 'setting', value: 1, icon: '158' },
                    { label: 'logout', value: 2, icon: '099' },
                  ]}
                  name='user'
                  icon='318'
                  iconSize='xsm'
                  onChange={handleUserAction}
                />
              </div>
            </div>
          </header>
          <WebSocketProvider>
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Route
                  path={PAGES_LIST.HOME}
                  component={MemosPage}
                  key='memos-page'
                />
                <Route
                  path={PAGES_LIST.SHIFTS}
                  component={lazy(() =>
                    Promise.resolve({ default: ShiftsPage })
                  )}
                />
                <Route
                  path={PAGES_LIST.ACCESS}
                  component={lazy(() =>
                    Promise.resolve({ default: AccesPage })
                  )}
                />
                <Route
                  path={PAGES_LIST.CORRESPONDENCE}
                  component={lazy(() =>
                    Promise.resolve({ default: CorrespondencePage })
                  )}
                />
                <Route
                  path={PAGES_LIST.USERS}
                  component={lazy(() =>
                    Promise.resolve({ default: UsersPage })
                  )}
                />
                <Route
                  path={PAGES_LIST.FORMS}
                  component={lazy(() =>
                    Promise.resolve({ default: FormsPage })
                  )}
                />
                <Route
                  path={PAGES_LIST.DEVICES}
                  component={lazy(() =>
                    Promise.resolve({ default: DevicesPage })
                  )}
                />
                <Route
                  path={PAGES_LIST.HISTORY}
                  component={lazy(() =>
                    Promise.resolve({ default: HistoryNotificationsPage })
                  )}
                />
              </Suspense>
            </Router>
          </WebSocketProvider>
        </div>
        <SettingsModal />
        {/*
        <OnBordingModal
          closed={getStatusOnBoardingModal.value}
          onLogout={signOut || (() => {})}
        >
          {companies.map((company) => (
            <div
              key={`selector-company-${company.name}`}
              // name={company.id}
              className='w-5/12 float-left cursor-pointer py-3 rounded-lg flex flex-row justify-between items-center hover:bg-gray-100 dark:hover:bg-b-dark-dark transition-colors duration-200 border border-gray-200 dark:border-gray-700'
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
        */}
        <ToastContainer />
      </section>
    );
  }
);
