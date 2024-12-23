import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { memo } from 'preact/compat';
import { Route, Router } from 'wouter';
import { Suspense, lazy } from 'preact/compat';

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
  // FormListsSettingPage,
  FormReportSettingPage,
  FormSettingPage,
} from './forms';
import { ChannelsSettingPage, DevicesSettingPage, IotSettingPage } from './iot';
import { IASettingPage } from './ia';
import { 
  RoundsSettingPage,
  RoundCreateSettingPage 
} from './shifts';
import { SalesSettingPage } from './sales';
import { AsociateSettingPage, ResourcesSettingPage } from './asociate';
import { FormInspectSettingPage } from './forms/inspect/inspect';
import { FormResponseSettingPage } from './forms/response/response';
import { UserCreateSettingPage } from './general/user/create/create';

export const RoutingContent = memo(() => {
  const content = (
    <Router base={PAGES_LIST_ROUTER.dashboard.setting.base}>
      {/* GENERAL ADMINISTRATOR */}
      <Suspense fallback={<div>Loading...</div>}>
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.admin.analytic.to}
          component={lazy(() =>
            Promise.resolve({ default: AnalyticAdminSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.admin.database.to}
          component={lazy(() =>
            Promise.resolve({ default: DatabaseSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.admin.tenant.to}
          component={lazy(() =>
            Promise.resolve({ default: TenantSettingPage })
          )}
        />
        {/* GENERAL MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.user.to}
          component={lazy(() => Promise.resolve({ default: UserSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.userCreate.to}
          component={lazy(() =>
            Promise.resolve({ default: UserCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.company.to}
          component={lazy(() =>
            Promise.resolve({ default: CompanySettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.modules.to}
          component={lazy(() =>
            Promise.resolve({ default: ModulesSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.integration.to}
          component={lazy(() =>
            Promise.resolve({ default: IntegrationSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.voxline.to}
          component={lazy(() =>
            Promise.resolve({ default: VoxlineSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.solo.to}
          component={lazy(() => Promise.resolve({ default: SoloSettingPage }))}
        />
        {/* SECURITY MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.keys.to}
          component={lazy(() => Promise.resolve({ default: KeysSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.users.to}
          component={lazy(() => Promise.resolve({ default: UsersSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.roles.to}
          component={lazy(() => Promise.resolve({ default: RolesSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.groups.to}
          component={lazy(() => Promise.resolve({ default: GroupSettingPage }))}
        />
        {/* PAYMENT MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.payment.history.to}
          component={lazy(() =>
            Promise.resolve({ default: PaymentHistorySettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.payment.payment.to}
          component={lazy(() =>
            Promise.resolve({ default: PaymentSettingPage })
          )}
        />
        {/* FORMS MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.form.to}
          component={lazy(() => Promise.resolve({ default: FormSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
          component={lazy(() =>
            Promise.resolve({ default: FormAnalyticSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.create.to}
          component={lazy(() =>
            Promise.resolve({ default: FormCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.to}
          component={lazy(() =>
            Promise.resolve({ default: FormInspectSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.response.to}
          component={lazy(() =>
            Promise.resolve({ default: FormResponseSettingPage })
          )}
        />
        {/*
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.list.to}
          component={lazy(() =>
            Promise.resolve({ default: FormListsSettingPage })
          )}
        />
        */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.report.to}
          component={lazy(() =>
            Promise.resolve({ default: FormReportSettingPage })
          )}
        />
        {/* IOT MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.iot.devices.to}
          component={lazy(() =>
            Promise.resolve({ default: DevicesSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.iot.iot.to}
          component={lazy(() => Promise.resolve({ default: IotSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.iot.channels.to}
          component={lazy(() =>
            Promise.resolve({ default: ChannelsSettingPage })
          )}
        />
        {/* IA MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.ia.ia.to}
          component={lazy(() => Promise.resolve({ default: IASettingPage }))}
        />
        {/* SHIFTS MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.to}
          component={lazy(() =>
            Promise.resolve({ default: RoundsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.create.to}
          component={lazy(() =>
            Promise.resolve({ default: RoundCreateSettingPage })
          )}
        />
        {/* SALES MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.sales.sales.to}
          component={lazy(() => Promise.resolve({ default: SalesSettingPage }))}
        />
        {/* ASOCIATE MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.asociate.list.to}
          component={lazy(() =>
            Promise.resolve({ default: ResourcesSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.asociate.resource.to}
          component={lazy(() =>
            Promise.resolve({ default: AsociateSettingPage })
          )}
        />
      </Suspense>
    </Router>
  );

  return content;
});
