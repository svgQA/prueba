import { Button, Modal, Search } from '@/components/common';
import {
  CardSettingHeader,
  CardSettingMenu,
  CardSettingUser,
  IModalSidebarMenu,
} from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { Route, Router } from 'wouter';
import {
  AnalyticAdminSettingPage,
  DatabaseSettingPage,
  TenantSettingPage,
} from './admin';
import {
  CompanySettingPage,
  IntegrationSettingPage,
  ModulesSettingPage,
  SoloSettingPage,
  UserSettingPage,
  VoxlineSettingPage,
} from './general';
import {
  GroupSettingPage,
  KeysSettingPage,
  RolesSettingPage,
  UsersSettingPage,
} from './security';
import { PaymentHistorySettingPage, PaymentSettingPage } from './payment';
import {
  FormAnalyticSettingPage,
  FormCreateSettingPage,
  FormListsSettingPage,
  FormReportSettingPage,
  FormSettingPage,
} from './forms';
import { ChannelsSettingPage, DevicesSettingPage, IotSettingPage } from './iot';
import { IASettingPage } from './ia';
import { RoundsSettingPage } from './shifts';
import { SalesSettingPage } from './sales';
import { AsociateSettingPage, ResourcesSettingPage } from './asociate';

import { MODAL_SIDEBAR_MENUS } from '@/utils/menus';
import { memo } from 'preact/compat';
import {
  getStatusSettingModal,
  toggleSettingModal,
} from '@/store/signals/modals';
import { authModel } from '@/store/signals/access';

import { IMenu } from '@/components/common/interface';
import { useSignal } from '@preact/signals';

const RoutingContent = memo(() => {
  return (
    <Router base={PAGES_LIST_ROUTER.dashboard.setting.base}>
      {/* GENERAL ADMINISTRATOR */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.admin.analytic.to}
        component={AnalyticAdminSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.admin.database.to}
        component={DatabaseSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.admin.tenant.to}
        component={TenantSettingPage}
      />
      {/* GENERAL MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.user.to}
        component={UserSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.company.to}
        component={CompanySettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.modules.to}
        component={ModulesSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.integration.to}
        component={IntegrationSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.voxline.to}
        component={VoxlineSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.setting.solo.to}
        component={SoloSettingPage}
      />
      {/* SECURITY MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.security.keys.to}
        component={KeysSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.security.users.to}
        component={UsersSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.security.roles.to}
        component={RolesSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.security.groups.to}
        component={GroupSettingPage}
      />
      {/* PAYMENT MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.payment.history.to}
        component={PaymentHistorySettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.payment.payment.to}
        component={PaymentSettingPage}
      />
      {/* FORMS MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
        component={FormSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.create.to}
        component={FormCreateSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
        component={FormAnalyticSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
        component={FormListsSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
        component={FormReportSettingPage}
      />
      {/* IOT MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.iot.devices.to}
        component={DevicesSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.iot.iot.to}
        component={IotSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.iot.channels.to}
        component={ChannelsSettingPage}
      />
      {/* IA MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.ia.ia.to}
        component={IASettingPage}
      />
      {/* SHIFTS MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.to}
        component={RoundsSettingPage}
      />
      {/* SALES MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.sales.sales.to}
        component={SalesSettingPage}
      />
      {/* ASOCIATE MENU */}
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.asociate.list.to}
        component={ResourcesSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.asociate.resource.to}
        component={AsociateSettingPage}
      />
    </Router>
  );
});

export const SettingsModal = () => {
  const menuSettings = useSignal<IModalSidebarMenu[]>(MODAL_SIDEBAR_MENUS);
  const menuInformationSelected = useSignal<IMenu>({
    description: 'Description',
    label: 'Title',
    to: '',
    id: 'id-default-1',
  });

  const goBack = () => {};
  const goForward = () => {};

  const toggleTheme = (event: MouseEvent) => {
    event.stopPropagation();
    document.body.classList.toggle('dark');
  };

  const selectMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'A') {
      const to = target.getAttribute('data-to');
      const label = target.getAttribute('data-label');
      const description = target.getAttribute('data-description');
      const id = target.getAttribute('id');
      if (!to || !label || !description || !id) return;
      menuInformationSelected.value = { to, description, label, id };
    }
  };

  return (
    <Modal
      open={getStatusSettingModal.value}
      onClose={toggleSettingModal}
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
              icon='210'
            ></Button>
            <Button
              id='setting-go-forward'
              name='setting-go-forward'
              onClick={goForward}
              type='button'
              rounded
              icon='212'
            ></Button>
            <Button
              id='setting-min-menu'
              name='setting-min-menu'
              onClick={toggleTheme}
              type='button'
              rounded
              icon='301'
            ></Button>
          </div>
          <Search
            id='search-general'
            name='search-general'
            placeholder='Search'
            keys={['id_1', 'id_2', 'id_3', 'id_4']}
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
          {menuSettings.value.map((menu) => {
            const name = `${menu.label}-menus`;
            return (
              <CardSettingMenu
                key={name}
                id={name}
                name={name}
                base={menu.base}
                label={menu.label}
                menus={menu.menus}
                selected={menuInformationSelected.value}
              />
            );
          })}
        </div>
      </div>
      <div className='w-10/12 max-h-[86vh] min-h-96 px-2'>
        <CardSettingHeader
          id='setting-header'
          name='setting-header'
          title={menuInformationSelected.value.label}
          description={menuInformationSelected.value.description}
        />
        <section className='w-full h-[80vh]'>
          <RoutingContent />
        </section>
      </div>
    </Modal>
  );
};
