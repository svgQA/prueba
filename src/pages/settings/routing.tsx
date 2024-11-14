import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { memo } from 'preact/compat';
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

export const RoutingContent = memo(() => {
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
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.form.to}
        component={FormSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
        component={FormAnalyticSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.create.to}
        component={FormCreateSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.list.to}
        component={FormListsSettingPage}
      />
      <Route
        path={PAGES_LIST_ROUTER.dashboard.setting.forms.report.to}
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
