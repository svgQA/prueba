import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { memo } from 'preact/compat';
import { Route, Router } from 'wouter';
import { Suspense, lazy } from 'preact/compat';

import { FormInspectSettingPage } from './forms/inspect/inspect';
import { FormResponseSettingPage } from './forms/response/response';
import { UserCreateSettingPage } from './general/user/create/create';
import { AnalyticAdminSettingPage } from './admin/analytic/analytic';
import { DatabaseSettingPage } from './admin/database/database';
import { TenantSettingPage } from './admin/tenant/tenant';
import { UserSettingPage } from './general/user/user';
import { CompanySettingPage } from './general/company/company';
import { ModulesSettingPage } from './general/modules/modules';
import { IntegrationSettingPage } from './general/integration/integration';
import { VoxlineSettingPage } from './general/voxline/voxline';
import { SoloSettingPage } from './general/solo/solo';
import { KeysSettingPage } from './security/keys/keys';
import { UsersSettingPage } from './security/users/users';
import { RolesSettingPage } from './security/roles/roles';
import { GroupSettingPage } from './security/groups/groups';
import { PaymentHistorySettingPage } from './payment/history/history';
import { PaymentSettingPage } from './payment/payment/payment';
import { FormSettingPage } from './forms/form/form';
import { FormAnalyticSettingPage } from './forms/analytic/analytic';
import { FormCreateSettingPage } from './forms/create/create';
import { FormReportSettingPage } from './forms/report/report';
import { DevicesSettingPage } from './iot/devices/devices';
import { IotSettingPage } from './iot/iot/iot';
import { ChannelsSettingPage } from './iot/channels/channels';
import { IASettingPage } from './ia/ia/ia';
import { RoundsSettingPage } from './shifts/rounds/rounds';
import { RoundCreateSettingPage } from './shifts/rounds/create/create';
import { SalesSettingPage } from './sales/sales/sales';
import { ResourcesSettingPage } from './asociate/resource/resource';
import { AsociateSettingPage } from './asociate/asociate/asociate';
import { PlacesSettingPage } from './shifts/places/places';
import { PlaceCreateSettingPage } from './shifts/places/create/create';

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
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.places.to}
          component={lazy(() =>
            Promise.resolve({ default: PlacesSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.placesCreate.to}
          component={lazy(() =>
            Promise.resolve({ default: PlaceCreateSettingPage })
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
