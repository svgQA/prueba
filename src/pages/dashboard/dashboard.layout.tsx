import { type FunctionComponent } from 'preact';
import { Route, Router } from 'wouter';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'preact/compat';
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
// import { Loading } from '@/components/common/loading/loading';
import { hasUserTenant, useUserStore } from '@/store/slices';
import { localStorage } from '@/utils/storage';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ThemeButton } from '@/components/compose/button';
import { CompanyService } from '@/services';
// import { INotification } from '@/components/common/notifications/interface';
import Notifications from '@/components/common/notifications/notifications';
import {
  IBaseSSE,
  SSE_EVENTS,
  SSE_TYPE,
  SseManager,
} from '@/utils/network/sse/base';
import { EventBus } from '@/utils/network/event.bus';
import { RoleService } from '@/services/general/role';
import { IMenu } from '@/components/common/utils/interface';
/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = memo(
  ({ signOut }: AuthAmplifyProps) => {
    // const [notifications, setNotifications] = useState<INotification[]>([]);
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
      cleanUserStore,
      // user,
    } = useUserStore();

    const [sidebarMenus, setSidebarMenus] = useState<IMenu[]>([]);
    const [hasSettings, setHasSettings] = useState<boolean>(true);

    const [panicMessage, setPanicMessage] = useState<string | null>(null);
    const [panicSubTitle, setPanicSubTitle] = useState<string | null>(null);
    const [isPanicVisible, setIsPanicVisible] = useState(false);

    useEffect(() => {
      validateUser();
      fetchSSE();
      getPermissions();
      EventBus.on(SSE_TYPE.PANIC, handlePanicSSE);
    }, []);

    const fetchSSE = useCallback(async () => {
      await SseManager.getQuery(['memo', 'panic']);
    }, []);

    const handlePanicSSE = (event: IBaseSSE) => {
      const { name, message } = event;
      if (name === SSE_EVENTS.PANIC) {
        setIsPanicVisible(false);
        setTimeout(() => {
          setPanicMessage(message.message);
          setPanicSubTitle(message.user.name + ' ' + message.user.surname);
          setIsPanicVisible(true);
          setTimeout(() => {
            setIsPanicVisible(false);
            setPanicMessage(null);
            setPanicSubTitle(null);
          }, 3000);
        }, 100);
      }
    };

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
        if (companies.length > 0) {
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
        cleanUserStore();
        cleanUserStore();
        signOut?.();
      }
    };

    const showPanicNotification = () => (
      <>
        {isPanicVisible && panicMessage && (
          <div className='fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100'>
            <div className='bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-xl shadow-xl flex flex-col gap-1 border border-red-400/20 backdrop-blur-sm'>
              <div className='flex items-center gap-3'>
                <span className='vx-icon vx-icon-317 text-white text-xl animate-pulse' />
                <span className='font-medium'>{panicMessage}</span>
              </div>
              {panicSubTitle && (
                <div className='flex items-center pl-8'>
                  <span className='text-sm text-red-100'>{panicSubTitle}</span>
                </div>
              )}
            </div>
          </div>
        )}
        {!isPanicVisible && panicMessage && (
          <div className='fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform -translate-y-4 opacity-0'>
            <div className='bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-xl shadow-xl flex flex-col gap-1 border border-red-400/20 backdrop-blur-sm'>
              <div className='flex items-center gap-3'>
                <span className='vx-icon vx-icon-317 text-white text-xl animate-pulse' />
                <span className='font-medium'>{panicMessage}</span>
              </div>
              {panicSubTitle && (
                <div className='flex items-center pl-8'>
                  <span className='text-sm text-red-100'>{panicSubTitle}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );

    const getPermissions = async () => {
      const request = await RoleService.getPermissions();
      if (!request.getStatus()) return;

      const permissions = request.getMany();

      if (permissions.length === 0) {
        setSidebarMenus(SIDEBAR_MENUS);
        return;
      }
      console.log('permissions', permissions);

      const filteredMenu = SIDEBAR_MENUS.filter((option) => {
        const match = permissions.find(
          (perm) =>
            perm.name.trim() === option.key && perm.permissions.state === true
        );
        console.log(
          `🔍 Checking ${option.key}: ${match ? '✅ Match' : '❌ No match'}`
        );
        return match;
      });

      const permissionsSettings = permissions.find(
        (perm) =>
          perm.name.trim() === 'settings' && perm.permissions.state === true
      );
      setHasSettings(permissionsSettings ? true : false);
      setSidebarMenus(filteredMenu);
      console.log('hasSettings', hasSettings);
      console.log('filteredMenu', filteredMenu);
    };

    return (
      <section>
        {showPanicNotification()}
        {/* <Loading /> */}
        <Sidebar
          id='sidebar'
          name='sidebar'
          onSettingHandler={toggleSettingModal}
          onHomeHandler={toggleSettingModal}
          menus={sidebarMenus}
          isNavigation
          hasSettings={hasSettings}
          // onLogout={signOut}
        />
        <div className='flex flex-col pl-[4.5rem]'>
          <header className='h-14 flex flex-row items-center justify-end sticky top-0 bg-b-content dark:bg-b-dark z-10'>
            {/*
            <div className='flex flex-row gap-2 items-center ml-56 justify-between'>
              <Avatar
                name={user?.name || ''}
                src={user?.image || ''}
                size='sm'
                square
              />
              <TextEllipsis text={user?.name || ''} maxWidth='100px' />
            </div>
            */}
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
                {/* <Button
                  name='user-action'
                  icon='317'
                  iconSize='sm'
                  borderless
                  unpadded
                /> */}
                <Notifications icon='317' iconSize='xsm' />
                <Dropdown
                  options={[
                    {
                      label: 'setting',
                      value: 1,
                      icon: '158',
                    },
                    {
                      label: 'logout',
                      value: 2,
                      icon: '099',
                    },
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
              <Suspense fallback={<div></div>}>
                <Route
                  path={PAGES_LIST.HOME}
                  component={MemosPage}
                  key='memos-page'
                />
                <Route
                  path={PAGES_LIST.SHIFTS}
                  component={lazy(() =>
                    Promise.resolve({
                      default: ShiftsPage,
                    })
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
                    Promise.resolve({
                      default: CorrespondencePage,
                    })
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
                    Promise.resolve({
                      default: DevicesPage,
                    })
                  )}
                />
                <Route
                  path={PAGES_LIST.HISTORY}
                  component={lazy(() =>
                    Promise.resolve({
                      default: HistoryNotificationsPage,
                    })
                  )}
                />
              </Suspense>
            </Router>
          </WebSocketProvider>
        </div>

        <SettingsModal />
        <ToastContainer />
      </section>
    );
  }
);
