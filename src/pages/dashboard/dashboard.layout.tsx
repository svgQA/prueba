import { type FunctionComponent } from 'preact';
import { Route, Router } from 'wouter';
import { lazy, Suspense, useEffect, useState } from 'preact/compat';
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
import { AccessPage } from './access/access.page';
import { CorrespondencePage } from './correspondence/correspondence.page';
import { UsersPage } from './users/users.page';

/** ***********************************************************************
 * STORE SIGNALS
 ** ***********************************************************************/
import {
  closeLoading,
  openLoading,
  toggleSettingModal,
} from '@/store/signals/modals';

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
import { hasUserTenant, useUserStore } from '@/store/slices';
import { localStorage } from '@/utils/storage';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ThemeButton } from '@/components/compose/button';
import { CompanyService } from '@/services';
import Notifications from '@/components/common/notifications/notifications';
import { RoleService } from '@/services/general/role';
import Panic from '@/components/common/panic/panic';
import { BaseService } from '@/utils/network';
import { setAllPermissions } from '@/store/signals/access/permission';
import { useSignal } from '@preact/signals';
import PanicModal from '@/components/common/panic/panic.modal';
import { IPanic } from '@/components/common/panic/interface';

import { IconsModal } from '../globals/icons/icons';
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
      cleanUserStore,
      getTenant,
      getToken,
      getCompanyId,
    } = useUserStore();

    const isModalOpen = useSignal<boolean>(false);
    const modalPanic = useSignal<IPanic | undefined>(undefined);
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
      BaseService.setLoading(openLoading, closeLoading);
      BaseService.setUser(getTenant, getToken, getCompanyId);
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
        Promise.all([getCompanies(), getPermissions()]);
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

    const getPermissions = async () => {
      const request = await RoleService.getPermissions();
      if (!request.getStatus()) return;

      const permissions = request.getOne();
      setAllPermissions(permissions.model);
    };

    return (
      <section>
        <Sidebar
          id='sidebar'
          name='sidebar'
          onSettingHandler={toggleSettingModal}
          menus={SIDEBAR_MENUS}
          isNavigation
        />
        <div className='flex flex-col pl-[4.5rem]'>
          <header className='h-14 flex flex-row items-center justify-end sticky top-0 bg-b-content dark:bg-b-dark z-10'>
            <div className='flex flex-row px-6 gap-4 justify-between items-center'>
              <Panic
                icon='001'
                emitPanic={(panic: IPanic) => {
                  setTimeout(() => {
                    setModalKey((prev) => prev + 1);
                    modalPanic.value = panic;
                    isModalOpen.value = true;
                  }, 300);
                }}
              />
              <LanguageSwitcher borderless />
              <CustomSwitcher
                options={companies}
                value={selectedCompany?.value}
                onChange={handleCompanyChange}
                icon='023'
                borderless
              />
              <div className='flex flex-row gap-4 items-center justify-center'>
                <ThemeButton unpadded />
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
          {isModalOpen && (
            <PanicModal
              key={modalKey}
              open={isModalOpen.value}
              onClose={() => {
                isModalOpen.value = false;
                modalPanic.value = undefined;
              }}
              panic={modalPanic.value}
            />
          )}
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
                    Promise.resolve({ default: AccessPage })
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
        <IconsModal />
      </section>
    );
  }
);
