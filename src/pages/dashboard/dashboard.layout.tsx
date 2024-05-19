import { Input, Modal, Sidebar, Button } from '@/components/common';
import { PAGES_LIST, PAGES_LIST_ROUTER, SIDEBAR_MENUS } from '@/utils';
import { signal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { MemosPage } from './memos/memos.page';
import { ShiftsPage } from './shifts/shifts.page';
import { FormsPage } from './forms/forms.page';
import { DevicesPage } from './devices/devices.page';
import {
  CardSettingHeader,
  CardSettingMenu,
  CardSettingUser,
  IModalSidebarMenu,
} from '@/components/compose/modal';
import { MODAL_SIDEBAR_MENUS } from '@/utils/constants/modal/sidebar';
import {
  CompanySettingPage,
  IntegrationSettingPage,
  ModulesSettingPage,
  SoloSettingPage,
  UserSettingPage,
  VoxlineSettingPage,
} from '../settings/general';
import { useState } from 'preact/hooks';
import {
  GroupSettingPage,
  KeysSettingPage,
  RolesSettingPage,
  UsersSettingPage,
} from '../settings/security';
import {
  PaymentHistorySettingPage,
  PaymentSettingPage,
} from '../settings/payment';
import {
  ChannelsSettingPage,
  DevicesSettingPage,
  IotSettingPage,
} from '../settings/iot';

const showSettingsModal = signal<boolean>(true);
export const DashboardLayout: FunctionComponent = () => {
  const [menuSettings, setMenuSettings] =
    useState<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);

  const onSettingHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };

  const onHomeHandler = () => {
    showSettingsModal.value = !showSettingsModal.value;
  };

  const goBack = () => {};
  const goForward = () => {};
  const minMenu = () => {};

  const selectMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A') {
      const menuClicked = target.getAttribute('name');
      const menus: IModalSidebarMenu[] = menuSettings.map(
        (menu): IModalSidebarMenu => {
          menu.menus.forEach((xmenu) => {
            if (xmenu.to === menuClicked) {
              xmenu.status = true;
            } else {
              xmenu.status = false;
            }
          });
          return menu;
        }
      );
      setMenuSettings(menus);
    }
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
        <Switch>
          <Route path={PAGES_LIST.HOME} component={MemosPage} />
          <Route path={PAGES_LIST.SHIFTS} component={ShiftsPage} />
          <Route path={PAGES_LIST.FORMS} component={FormsPage} />
          <Route path={PAGES_LIST.DEVICES} component={DevicesPage} />
        </Switch>
      </div>
      <Modal
        open={showSettingsModal.value}
        onClose={onSettingHandler}
        name='setting-modal'
        id='setting-modal'
        header={
          <>
            <div className='w-4/12 flex items-center justify-center'>
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
        body={
          <>
            <div
              onClick={selectMenu}
              className='w-3/12 max-w-72 min-w-64 p-1 max-h-[88vh] overflow-y-scroll'
            >
              <CardSettingUser
                id='user-information'
                name='user-information'
                company='voxline'
                username='juan pablo rodriguez fernandez'
                image='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'
                rol='administrador'
              />
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
            <div className='w-10/12 max-h-[86vh] min-h-96 px-2'>
              <CardSettingHeader
                id='setting-header'
                name='setting-header'
                title='Title'
                description='Description'
              />
              <section className='w-full h-20 bg-red-200'>
                <Router base={PAGES_LIST.SETTING}>
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
                  {/* SALES MENU */}
                  {/* ASOCIATE MENU */}
                </Router>
              </section>
            </div>
          </>
        }
      />
    </section>
  );
};
