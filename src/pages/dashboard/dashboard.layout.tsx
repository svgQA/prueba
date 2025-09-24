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
import { toast, ToastContainer } from 'react-toastify';
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
import { CompanyService, PlaceService, TenantService } from '@/services';
import Notifications from '@/components/common/notifications/notifications';
import { RoleService } from '@/services/general/role';
import Panic from '@/components/common/panic/panic';
import { BaseService } from '@/utils/network';
import { setAllPermissions } from '@/store/signals/access/permission';
import { useSignal } from '@preact/signals';
import PanicModal from '@/components/common/panic/components/panic.modal';
import { IPanic } from '@/components/common/panic/utils/interface';

// import { IconsModal } from '../globals/icons/icons';
// import { SseManager } from '@/utils/network/sse/base';
import { WebSocketManager } from '@/utils/socket/manager/manager';
import { Modal } from '@/components/common/modal/modal';
import { Field, Form } from 'react-final-form';
import { Input } from '@/components/common/input/input';

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
      getUser,
      places,
      selectedPlace,
      setSelectedPlace,
      setPlaces,
      getPlaceId,
    } = useUserStore();

    const isModalOpen = useSignal<boolean>(false);
    const modalPanic = useSignal<IPanic | undefined>(undefined);
    const [modalKey, setModalKey] = useState(0);
    const [activeTab, setActiveTab] = useState<
      'tenant' | 'instance' | 'companies' | 'databases'
    >('tenant');
    const openModalTenant = useSignal<boolean>(false);
    const tenants = useSignal<any[]>([]);
    const instances = useSignal<any[]>([]);
    useEffect(() => {
      BaseService.setLoading(openLoading, closeLoading);
      BaseService.setUser(getTenant, getToken, getCompanyId, getPlaceId);
      validateUser();
    }, []);

    useEffect(() => {
      if (selectedCompany) {
        WebSocketManager.connect(getTenant, getCompanyId, getToken);
      }
      return () => {
        WebSocketManager.disconnect();
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
        Promise.all([
          getCompanies(),
          getPermissions(),
          getTenants(),
          getInstances(),
          // getPlaces(),
        ]);
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
      }

      const user = getUser();

      if (
        value === 3 &&
        user?.email === 'juanpablorodriguezfernandez93@gmail.com'
      ) {
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
    const onTenantSubmit = async (values: any) => {
      const request = await TenantService.create_tenant(values);
      if (!request.getStatus()) return;
      toast.success('Tenant creado correctamente');
      getTenants();
    };

    const onInstanceSubmit = async (values: any) => {
      const request = await TenantService.create_instance(values);
      if (!request.getStatus()) return;
      toast.success('Instancia creada correctamente');
      getInstances();
    };

    const getTenants = async () => {
      const user = getUser();

      if (user?.email != 'juanpablorodriguezfernandez93@gmail.com') {
        return;
      }
      const request = await TenantService.get_tenants();
      console.log(request);
      if (!request.getStatus()) return;
      tenants.value = request.getMany();
    };

    const getInstances = async () => {
      const user = getUser();

      if (user?.email != 'juanpablorodriguezfernandez93@gmail.com') {
        return;
      }
      const request = await TenantService.get_instances();
      if (!request.getStatus()) return;
      instances.value = request.getMany();
    };

    const modalTenant = (
      <Modal
        open={openModalTenant.value}
        onClose={() => {
          openModalTenant.value = false;
        }}
        name='tenant-modal'
        id='tenant-modal'
        expandable
        theme
        setExpandable={openModalTenant.value}
        header={
          <div className='flex flex-row w-full items-center justify-between px-3'></div>
        }
      >
        <div className='w-full p-4'>
          <div className='flex border-b mb-4'>
            <button
              className={`px-4 py-2 ${activeTab === 'tenant' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('tenant')}
            >
              Crear tenant
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'companies' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Empresas
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'instance' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('instance')}
            >
              Crear instancia
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'databases' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('databases')}
            >
              Base de datos
            </button>
          </div>

          {activeTab === 'tenant' ? (
            <div>
              <Form
                onSubmit={onTenantSubmit}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className='mb-8'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='col-span-1'>
                        <h1>[TENANT] Información del Tenant</h1>
                        <Field name='name'>
                          {({ input }) => (
                            <Input
                              {...input}
                              type='text'
                              label='nombre*'
                              placeholder='Empresa 7'
                            />
                          )}
                        </Field>
                        <Field name='description'>
                          {({ input }) => (
                            <Input
                              {...input}
                              placeholder='Servicios de software'
                              label='description*'
                              type='text'
                            />
                          )}
                        </Field>
                        <Field name='manager_name'>
                          {({ input }) => (
                            <Input
                              {...input}
                              placeholder='Usuario Test'
                              label='manager_name'
                              type='text'
                            />
                          )}
                        </Field>
                        <Field name='manager_email'>
                          {({ input }) => (
                            <Input
                              {...input}
                              type='email'
                              placeholder='usuariotest@gmail.com'
                              label='manager_email'
                            />
                          )}
                        </Field>
                        <Field name='manager_phone'>
                          {({ input }) => (
                            <Input
                              {...input}
                              placeholder='+573168410294'
                              label='manager_phone'
                              type='tel'
                            />
                          )}
                        </Field>
                      </div>

                      <div className='col-span-1'>
                        <h1>[OWNER] Información del Usuario</h1>
                        <Field name='email'>
                          {({ input }) => (
                            <Input
                              {...input}
                              type='email'
                              placeholder='jhvargas563@gmail.com'
                              label='Correo*'
                            />
                          )}
                        </Field>
                        <Field name='phone'>
                          {({ input }) => (
                            <Input
                              {...input}
                              placeholder='+57316841294'
                              label='Teléfono*'
                              type='tel'
                            />
                          )}
                        </Field>
                        <Field name='password'>
                          {({ input }) => (
                            <Input
                              {...input}
                              type='text'
                              placeholder='Tryvoo*1113697580'
                              label='Contraseña*'
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <button
                      type='submit'
                      className='mt-4 px-4 py-2 bg-primary text-white rounded'
                    >
                      Create Tenant
                    </button>
                  </form>
                )}
              />
            </div>
          ) : activeTab === 'instance' ? (
            <div>
              <Form
                onSubmit={onInstanceSubmit}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className='mb-8'>
                    <div className='grid grid-cols-2 gap-4'>
                      <Field name='name'>
                        {({ input }) => (
                          <Input
                            {...input}
                            placeholder='Instance'
                            type='text'
                            label='Nombre*'
                          />
                        )}
                      </Field>
                      <Field name='url'>
                        {({ input }) => (
                          <Input
                            {...input}
                            placeholder='postgresql://child1:child1pass@localhost:5434/child1db'
                            type='text'
                            label='URL*'
                          />
                        )}
                      </Field>
                    </div>
                    <button
                      type='submit'
                      className='mt-4 px-4 py-2 bg-primary text-white rounded'
                    >
                      Create Instance
                    </button>
                  </form>
                )}
              />
            </div>
          ) : activeTab === 'databases' ? (
            <div>
              <h1>Instancias</h1>
              <table className='w-full border-collapse'>
                <thead>
                  <tr>
                    <th className='border p-2'>ID</th>
                    <th className='border p-2'>Name</th>
                    <th className='border p-2'>URL</th>
                    <th className='border p-2'>Count</th>
                    <th className='border p-2'>Created At</th>
                    <th className='border p-2'>Updated At</th>
                    <th className='border p-2'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {instances.value.map((instance) => (
                    <tr key={instance.id}>
                      <td className='border p-2'>{instance.id}</td>
                      <td className='border p-2'>{instance.name}</td>
                      <td className='border p-2'>{instance.url}</td>
                      <td className='border p-2'>{instance.count}</td>
                      <td className='border p-2'>{instance.created_at}</td>
                      <td className='border p-2'>{instance.updated_at}</td>
                      <td className='border p-2'>
                        {instance.status ? 'Active' : 'Inactive'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'companies' ? (
            <div>
              <h1>Empresas</h1>
              <table className='w-full border-collapse'>
                <thead>
                  <tr>
                    <th className='border p-2'>ID</th>
                    <th className='border p-2'>Name</th>
                    <th className='border p-2'>Description</th>
                    <th className='border p-2'>Manager Name</th>
                    <th className='border p-2'>Manager Email</th>
                    <th className='border p-2'>Manager Phone</th>
                    <th className='border p-2'>External ID</th>
                    <th className='border p-2'>Platform External ID</th>
                    <th className='border p-2'>Instance ID</th>
                    <th className='border p-2'>Status</th>
                    <th className='border p-2'>Message</th>
                    <th className='border p-2'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.value.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className='border p-2'>{tenant.id}</td>
                      <td className='border p-2'>{tenant.name}</td>
                      <td className='border p-2'>{tenant.description}</td>
                      <td className='border p-2'>{tenant.manager_name}</td>
                      <td className='border p-2'>{tenant.manager_email}</td>
                      <td className='border p-2'>{tenant.manager_phone}</td>
                      <td className='border p-2'>{tenant.external_id}</td>
                      <td className='border p-2'>
                        {tenant.platform_external_id}
                      </td>
                      <td className='border p-2'>{tenant.instance_id}</td>
                      <td className='border p-2'>{tenant.status}</td>
                      <td className='border p-2'>{tenant.message}</td>
                      <td className='border p-2'>{tenant.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h1>Base de datos</h1>
            </div>
          )}
        </div>
      </Modal>
    );

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
              <CustomSwitcher
                options={places}
                value={selectedPlace?.value}
                onChange={handlePlaceChange}
                icon='103'
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
                      label: 'tenant',
                      value: 3,
                      icon: '159',
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
        {/*<IconsModal />*/}
        {openModalTenant.value && modalTenant}
      </section>
    );
  }
);
