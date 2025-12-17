import { type FunctionComponent } from 'preact';
import { Route, Router, useLocation } from 'wouter';
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
import { Sidebar } from '@/components/common/sidebar/sidebar';
import { AuthAmplifyProps } from '@/utils/types/auth.interface';
import { HistoryNotificationsPage } from './history/history.page';
import { PqrsPage } from './pqrs/pqrs.page';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { CustomSwitcher } from '@/components/common/CustomSwitcher';
import { hasUserTenant, useUserStore } from '@/store/slices';
import { localStorage } from '@/utils/storage';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { ThemeButton } from '@/components/compose/button';
import { CompanyService, PlaceService } from '@/services';
import Notifications from '@/components/common/notifications/notifications';
import { RoleService } from '@/services/general/role';
import Panic from '@/components/common/panic/panic';
import { BaseService } from '@/utils/network';
import { setAllPermissions } from '@/store/signals/access/permission';
import { useSignal } from '@preact/signals';
import PanicModal from '@/components/common/panic/components/panic.modal';
import { IPanic } from '@/components/common/panic/utils/interface';
import { UserService } from '@/services/general/user';

import { WebSocketManager } from '@/utils/socket/manager/manager';
import { TenantsModal } from './tenants/tenants';
// import { FaroManager } from '@/utils/telemetry';
import { IClientResponse } from '@/types/user/user.response';
import { USER_TYPE } from '@/types/user/user.enum';
import { IDropdownOptions } from '@/components/common/dropdown/interface';
import { INITIAL_DROPDOWN_OPTIONS } from './constant';
import { IconsModal } from '../globals/icons/icons';
import { rawDataManager } from '@/utils/statistics/data.manager';
import { metricsEngine } from '@/utils/statistics/metric.engine';

type Props = {
  location: string;
};

/** ***********************************************************************
 * COMPONENT
 ** ***********************************************************************/
export const DashboardLayout: FunctionComponent<AuthAmplifyProps & Props> =
  memo(({ signOut, location }: AuthAmplifyProps & Props) => {
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
      getUser,
      getCognito,
      places,
      selectedPlace,
      setSelectedPlace,
      setPlaces,
      getPlaceId,
    } = useUserStore();
    const [, navigate] = useLocation();
    const clients = useSignal<IClientResponse[]>([]);
    const options = useSignal<IDropdownOptions[]>(INITIAL_DROPDOWN_OPTIONS);
    const isModalOpen = useSignal<boolean>(false);
    const modalPanic = useSignal<IPanic | undefined>(undefined);
    const [modalKey, setModalKey] = useState(0);
    const openModalTenant = useSignal<boolean>(false);

    useEffect(() => {
      BaseService.setLoading(openLoading, closeLoading);
      BaseService.setUser(getTenant, getToken, getCompanyId, getPlaceId);
      validateUser();
      if (location.includes('signin')) return;
      navigate(location);
    }, []);

    useEffect(() => {
      if (selectedCompany) {
        WebSocketManager.connect(getTenant, getCompanyId, getToken, getCognito);
        // FaroManager.connect(getTenant, getCompanyId, getToken, getCognito);
        rawDataManager.connect(getCompanyId);
        metricsEngine.connect();
        metricsEngine.recalculate();
      }
      return () => {
        WebSocketManager.disconnect();
        metricsEngine.disconnect();
      };
    }, [selectedCompany, selectedPlace]);

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
        Promise.all([getCompanies(), setTenantOption(), getPermissions()]);
      }
    };

    const setTenantOption = () => {
      const user = getUser();
      if (user?.email === 'juanpablorodriguezfernandez93@gmail.com') {
        options.value.push({
          label: 'tenant',
          value: 3,
          icon: '159',
        });
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
      getPlaces();
      getClients();
    };

    const getPlaces = async () => {
      const places = await PlaceService.get_simple_list_admin_client();

      if (!places.getStatus()) return;
      const placesData = places.getMany();

      if (placesData.length === 0) return;
      setPlaces(placesData);

      const selectedPlace = await localStorage.get('place');
      if (selectedPlace) {
        setSelectedPlace(Number(selectedPlace));
      } else {
        if (placesData.length > 0) {
          const firstPlace = placesData[0].value;
          setSelectedPlace(Number(firstPlace));
        }
      }
    };

    const getClients = async () => {
      const user = getUser();
      if (user?.userType !== USER_TYPE.EXTERNAL_ACCESS) return;
      const request = await UserService.getAssociatedClients();

      if (!request.getStatus()) return;
      clients.value = request.getMany();
    };

    const handleCompanyChange = (value: string | number) => {
      localStorage.set('company', value);
      setSelectedCompany(Number(value));
    };

    const handlePlaceChange = (value: string | number) => {
      localStorage.set('place', value);
      setSelectedPlace(Number(value));
    };

    const handleUserAction = (value: string | number) => {
      if (value === 1) {
        toggleSettingModal();
      } else if (value === 2) {
        cleanUserStore();
        cleanUserStore();
        signOut?.();
      } else if (value === 3) {
        openModalTenant.value = true;
      }
    };

    const getPermissions = async () => {
      const request = await RoleService.getPermissions();
      if (!request.getStatus()) return;

      const permissions = request.getOne();
      if (!permissions.model || Object.keys(permissions.model).length === 0)
        return;
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
        <div className='flex flex-col lg:pl-[4.5rem]'>
          <header className='h-12 sticky top-0 bg-b-content dark:bg-b-dark z-10'>
            <div className='flex items-center w-full justify-end h-13'>
              <div className='flex items-center gap-2 px-2'>
                <LanguageSwitcher borderless />
                <CustomSwitcher
                  options={companies}
                  value={selectedCompany?.value}
                  onChange={handleCompanyChange}
                  icon='023'
                  borderless
                />
                <CustomSwitcher
                  options={places}
                  value={selectedPlace?.value}
                  onChange={handlePlaceChange}
                  icon='103'
                  borderless
                />
                <CustomSwitcher
                  options={clients.value.map((client) => ({
                    label: client.name,
                    value: client.id,
                  }))}
                  value={clients.value[0]?.id}
                  onChange={() => {}}
                  icon='023'
                  borderless
                />
              </div>

              <div className='flex items-center gap-2 px-3'>
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
                <ThemeButton unpadded />
                <Notifications icon='317' iconSize='xsm' />
                <Dropdown
                  options={options.value}
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
          <Router>
            <Suspense fallback={<div></div>}>
              <Route
                path={PAGES_LIST.HOME}
                component={lazy(() =>
                  Promise.resolve({
                    default: MemosPage,
                  })
                )}
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
                component={lazy(() => Promise.resolve({ default: AccessPage }))}
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
                component={lazy(() => Promise.resolve({ default: UsersPage }))}
              />
              <Route
                path={PAGES_LIST.FORMS}
                component={lazy(() => Promise.resolve({ default: FormsPage }))}
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
              <Route
                path={PAGES_LIST.PQRS}
                component={lazy(() =>
                  Promise.resolve({
                    default: PqrsPage,
                  })
                )}
              />
            </Suspense>
          </Router>
        </div>

        <SettingsModal />
        <TenantsModal open={openModalTenant} />
        <IconsModal />
      </section>
    );
  });
