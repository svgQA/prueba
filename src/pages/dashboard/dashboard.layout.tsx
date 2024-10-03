import { Button, Input, Modal, Sidebar } from '@/components/common';
import { PAGES_LIST, PAGES_LIST_ROUTER, SIDEBAR_MENUS } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Route, Router, Switch } from 'wouter';

import { DevicesPage } from './devices/devices.page';
import { FormsPage } from './forms/forms.page';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { OnBordingPage } from '../onbording/onbording.page';

import { IMenu } from '@/components/common/interface';
import {
  CardSettingHeader,
  CardSettingMenu,
  CardSettingUser,
  IModalSidebarMenu,
} from '@/components/compose/modal';
import { authModel } from '@/store/signals/access';
import { MODAL_SIDEBAR_MENUS } from '@/utils/constants/modal/sidebar';

import {
  AnalyticAdminSettingPage,
  DatabaseSettingPage,
  TenantSettingPage,
} from '&/admin';
import { AsociateSettingPage, ResourcesSettingPage } from '&/asociate';
import { FormAnalyticSettingPage, FormCreateSettingPage } from '&/forms';
import {
  CompanySettingPage,
  IntegrationSettingPage,
  ModulesSettingPage,
  SoloSettingPage,
  UserSettingPage,
  VoxlineSettingPage,
} from '&/general';
import { RoundsSettingPage } from '&/shifts';
import { IASettingPage } from '&/ia';
import { ChannelsSettingPage, DevicesSettingPage, IotSettingPage } from '&/iot';
import { PaymentHistorySettingPage, PaymentSettingPage } from '&/payment';
import { SalesSettingPage } from '&/sales';
import {
  GroupSettingPage,
  KeysSettingPage,
  RolesSettingPage,
  UsersSettingPage,
} from '&/security';
import { AuthAmplifyProps } from './inteface';

import { IOnboardingModel } from '@/store/signals/interface';
import {
  getStatusOnBoardingModal,
  getStatusSettingModal,
  toggleSettingModal,
  openOnBoardingModal,
  closeOnBoardingModal,
} from '@/store/signals/modals';
import { TenantService } from '@/services';
import { hasUserTenant } from '@/store/slices';

// const GENERAL_GROUP_MENU = 0,
//   SETTING_USER_MENU = 0;

export const DashboardLayout: FunctionComponent<AuthAmplifyProps> = ({
  signOut,
}: AuthAmplifyProps) => {
  const [menuSettings, setMenuSettings] =
    useState<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);

  const [menuInformationSelected, setMenuInformationSelected] = useState<IMenu>(
    { description: 'Description', label: 'Title', to: '', id: 'id-default-1' }
  );

  useEffect(() => {
    validateUser();
  }, []);

  const validateUser = async () => {
    const existTenant = await hasUserTenant();
    if (!existTenant) openOnBoardingModal();
    else closeOnBoardingModal();
  };

  const onSettingHandler = () => {
    toggleSettingModal();
    // showSettingsModal.value = !showSettingsModal.value;
    // if (showSettingsModal.value) {
    //   navigate(PAGES_LIST.DASHBOARD + PAGES_LIST.SETTING);
    //   const menu = menuSettings[GENERAL_GROUP_MENU].menus[SETTING_USER_MENU];
    //   setMenuInformationSelected(menu);
    //   updateMenu(menu.to);
    // } else {
    //   navigate(PAGES_LIST.DASHBOARD);
    // }
  };

  const onHomeHandler = () => {
    toggleSettingModal();
  };

  const goBack = () => {};
  const goForward = () => {};
  const minMenu = () => {};

  const updateMenu = (name: string | null) => {
    if (!name) return;
    const menus: IModalSidebarMenu[] = menuSettings.map(
      (menu): IModalSidebarMenu => {
        menu.menus.forEach((xmenu) => {
          if (xmenu.to === name) {
            xmenu.status = true;
            setMenuInformationSelected(xmenu);
          } else {
            xmenu.status = false;
          }
        });
        return menu;
      }
    );
    setMenuSettings(menus);
  };

  const selectMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A') {
      const menuClicked = target.getAttribute('name');
      updateMenu(menuClicked);
    }
  };

  const onCreateTenant = async (model: IOnboardingModel) => {
    const response = await TenantService.create_tenant(model);
    if (response.getStatus()) {
      closeOnBoardingModal();
    }
  };

  const onSubmitOnBoarding = async (model: IOnboardingModel) => {
    await onCreateTenant(model);
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
        onLogout={signOut}
      />
      <div className='flex flex-col pl-20 w-full pr-2'>
        <Switch>
          <Route path={PAGES_LIST.HOME} component={MemosPage} />
          <Route path={PAGES_LIST.SHIFTS} component={ShiftsPage} />
          <Route path={PAGES_LIST.FORMS} component={FormsPage} />
          <Route path={PAGES_LIST.DEVICES} component={DevicesPage} />
        </Switch>
      </div>
      <Modal
        open={getStatusSettingModal.value}
        onClose={onSettingHandler}
        name='setting-modal'
        id='setting-modal'
        header={
          <>
            <div className='w-4/12 max-w-[30vh] flex items-center justify-center'>
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
      >
        <div
          onClick={selectMenu}
          className='w-3/12 max-w-72 min-w-64 p-1 max-h-[88vh]'
        >
          <CardSettingUser
            id='user-information'
            name='user-information'
            company={authModel.value.company}
            username={authModel.value.username}
            image={authModel.value.image}
            rol={authModel.value.rol}
          />
          <div className='vox-scroll-design max-h-[80vh] overflow-y-scroll'>
            {menuSettings.map((menu) => {
              const name = `${menu.label}-menus`;
              return (
                <CardSettingMenu
                  key={name}
                  id={name}
                  name={name}
                  label={menu.label}
                  menus={menu.menus}
                />
              );
            })}
          </div>
        </div>
        <div className='w-10/12 max-h-[86vh] min-h-96 px-2'>
          <CardSettingHeader
            id='setting-header'
            name='setting-header'
            title={menuInformationSelected?.label}
            description={menuInformationSelected?.description}
          />
          <section className='w-full h-[80vh]'>
            <Router base={PAGES_LIST.SETTING}>
              {/* GENERAL ADMINISTRATOR */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.admin.analytic.base}
                component={AnalyticAdminSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.admin.database.base}
                component={DatabaseSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.admin.tenant.base}
                component={TenantSettingPage}
              />
              {/* GENERAL MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.user.base}
                component={UserSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.company.base}
                component={CompanySettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.modules.base}
                component={ModulesSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.integration.base}
                component={IntegrationSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.voxline.base}
                component={VoxlineSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.setting.solo.base}
                component={SoloSettingPage}
              />
              {/* SECURITY MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.security.keys.base}
                component={KeysSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.security.users.base}
                component={UsersSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.security.roles.base}
                component={RolesSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.security.groups.base}
                component={GroupSettingPage}
              />
              {/* PAYMENT MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.payment.history.base}
                component={PaymentHistorySettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.payment.payment.base}
                component={PaymentSettingPage}
              />
              {/* FORMS MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.forms.create.base}
                component={FormCreateSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.forms.analytic.base}
                component={FormAnalyticSettingPage}
              />
              {/* IOT MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.iot.devices.base}
                component={DevicesSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.iot.iot.base}
                component={IotSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.iot.channels.base}
                component={ChannelsSettingPage}
              />
              {/* IA MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.ia.ia.base}
                component={IASettingPage}
              />
              {/* SHIFTS MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.shifts.rounds.base}
                component={RoundsSettingPage}
              />
              {/* SALES MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.sales.sales.base}
                component={SalesSettingPage}
              />
              {/* ASOCIATE MENU */}
              <Route
                path={PAGES_LIST_ROUTER.dashboard.asociate.list.base}
                component={ResourcesSettingPage}
              />
              <Route
                path={PAGES_LIST_ROUTER.dashboard.asociate.resource.base}
                component={AsociateSettingPage}
              />
            </Router>
          </section>
        </div>
      </Modal>
      <OnBordingPage
        closed={getStatusOnBoardingModal.value}
        onSubmit={onSubmitOnBoarding}
      />
    </section>
  );
};
