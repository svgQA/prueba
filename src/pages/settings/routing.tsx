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
import { PlacesSettingPage } from './shifts/places/places';
import { PlaceCreateSettingPage } from './shifts/places/create/create';
import { ActivitySettingPage } from './shifts/activity/activity';
import { ActivityCreateSettingPage } from './shifts/activity/create/create';
import { ProjectsSettingPage } from './shifts/projects/projects';
import { ProjectCreateSettingPage } from './shifts/projects/create/create';
import { ResourceSettingPage } from './access/resource/resource';
import { SetsSettingPage } from './access/sets/sets';
import { InformationSettingPage } from './access/information/information';
import { PlaceSettingPage } from './access/places/places';
import { CreateResourceSettingPage } from './access/resource/create/createResource';
import { CreateSetsSettingPage } from './access/sets/createSets/createSets';
import { CreatePlacesSettingPage } from './access/places/createPlaces/createPlaces';
import { CreateInformationSettingPage } from './access/information/createInfo/createInfo';
import { NoveltySettingPage } from './memo/novelty/novelty';
import { NoveltyCreateSettingPage } from './memo/novelty/create/create';
import { ServiceSettingPage } from './shifts/service/service';
import { ServiceCreateSettingPage } from './shifts/service/create/service';
import { TaskSettingPage } from './shifts/task/task';
import { TaskCreateSettingPage } from './shifts/task/create/task';
import { ScheduleSettingPage } from './shifts/schedule/schedule';
import { ScheduleCreateSettingPage } from './shifts/schedule/create/schedule';
import { ShiftSettingPage } from './shifts/setting/setting';

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
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.settings}
          component={lazy(() => Promise.resolve({ default: ShiftSettingPage }))}
        />
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
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.update.to}
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
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.placesUpdate.to}
          component={lazy(() =>
            Promise.resolve({ default: PlaceCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.to}
          component={lazy(() =>
            Promise.resolve({ default: ActivitySettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.activityCreate.to}
          component={lazy(() =>
            Promise.resolve({ default: ActivityCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.activityUpdate.to}
          component={lazy(() =>
            Promise.resolve({ default: ActivityCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.projects.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.projectCreate.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.projectUpdate.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.to}
          component={lazy(() =>
            Promise.resolve({ default: NoveltySettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.create.to}
          component={lazy(() =>
            Promise.resolve({ default: NoveltyCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.update.to}
          component={lazy(() =>
            Promise.resolve({ default: NoveltyCreateSettingPage })
          )}
        />
        {/* SERVICES MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.service.to}
          component={lazy(() =>
            Promise.resolve({ default: ServiceSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.service.create.to}
          component={lazy(() =>
            Promise.resolve({ default: ServiceCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.service.update.to}
          component={lazy(() =>
            Promise.resolve({ default: ServiceCreateSettingPage })
          )}
        />
        {/* TASK MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.task.to}
          component={lazy(() => Promise.resolve({ default: TaskSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.task.create.to}
          component={lazy(() =>
            Promise.resolve({ default: TaskCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.task.update.to}
          component={lazy(() =>
            Promise.resolve({ default: TaskCreateSettingPage })
          )}
        />
        {/* TASK MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.to}
          component={lazy(() =>
            Promise.resolve({ default: ScheduleSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.create.to}
          component={lazy(() =>
            Promise.resolve({ default: ScheduleCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.update.to}
          component={lazy(() =>
            Promise.resolve({ default: ScheduleCreateSettingPage })
          )}
        />
        {/* SALES MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.sales.sales.to}
          component={lazy(() => Promise.resolve({ default: SalesSettingPage }))}
        />
        {/* ASOCIATE MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.asociate.resources.to}
          component={lazy(() =>
            Promise.resolve({ default: ResourcesSettingPage })
          )}
        />
        {/* ACCESS MENU */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.resource.to}
          component={lazy(() =>
            Promise.resolve({ default: ResourceSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.sets.to}
          component={lazy(() => Promise.resolve({ default: SetsSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.place.to}
          component={lazy(() => Promise.resolve({ default: PlaceSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.information.to}
          component={lazy(() =>
            Promise.resolve({ default: InformationSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.createResource.to}
          component={lazy(() =>
            Promise.resolve({ default: CreateResourceSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.createSets.to}
          component={lazy(() =>
            Promise.resolve({ default: CreateSetsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.createPlaces.to}
          component={lazy(() =>
            Promise.resolve({ default: CreatePlacesSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.createInformation.to}
          component={lazy(() =>
            Promise.resolve({ default: CreateInformationSettingPage })
          )}
        />
      </Suspense>
    </Router>
  );

  return content;
});
