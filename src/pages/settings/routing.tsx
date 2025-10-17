import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { memo } from 'preact/compat';
import { Route, Router } from 'wouter';
import { Suspense, lazy } from 'preact/compat';

// import { FormInspectSettingPage } from './forms/inspect/inspect';
// import { FormResponseSettingPage } from './forms/response/response';
// import { FormAnalyticSettingPage } from './forms/analytic/analytic';
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
import { FormCreateSettingPage } from './forms/create/create';
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
import { CreateResourceSettingPage } from './access/resource/create/create';
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
import { GeneralSettingPage } from './general/setting/setting';
import { UserAreasPage } from '../dashboard/users/areas/user.areas';
import { UserGroupsPage } from '../dashboard/users/groups/user.groups';
import { UserRolesPage } from '../dashboard/users/roles/roles';
import { UserPasswordPage } from '../dashboard/users/password/user.password';
import { UserSettingsPage } from '../dashboard/users/setting/user.setting';
import { ScheduledNotificationsPage } from './notifications/scheduleNotifications/scheduledNotifications';
import { TemplateNotificationPage } from './notifications/templateNotifications/templateNotifications';
import { TemplateCreateForm } from './notifications/templateNotifications/create/create';
import { AreaCreatePage } from '../dashboard/users/areas/area.create';
import { ScheduledNotificationForm } from './notifications/scheduleNotifications/create/create';
import { TemplateNotificationEditPage } from './notifications/templateNotifications/update/update';
import { ScheduledNotificationEditPage } from './notifications/scheduleNotifications/update/update';
import { PredefinedSettingPage } from './memo/predefined/predefined';
import { PredefinedCreateSettingPage } from './memo/predefined/create/create';
import { GroupCreateSettingPage } from './security/groups/create/create';
import { RolesUpsertPage } from '../dashboard/users/roles/roles.upsert';
import { ResourceMemoSettingPage } from './memo/resource/resource';
import { FormReportSettingPage } from './forms/report/report';
import { ReportUpsertForm } from './forms/report/components/report.upsert.form';
import { SiteCreatePage } from './trybook/residences/residence.create';
import { TrybookResidencesPage } from './trybook/residences/trybook.residences';
import { TrybookCommonZonesPage } from './trybook/commonzone/trybook.comonzone';
import { CommonZoneCreatePage } from './trybook/commonzone/comonzone.create';
import { CommonSlotCreatetPage } from './trybook/commonslot/commonslot.create';
import { TrybookCommonSlotsPage } from './trybook/commonslot/trybook.commonslot';
import { WebHookSettingPage } from './general/webhook/webhook';
import { TrybookResourceZonesPage } from './trybook/resourcezone/trybook.resourcezone';
import { ResourceZoneCreatePage } from './trybook/resourcezone/resourcezone.create';
import { NewsPage } from './trybook/news/news.page';
import { NewsForm } from './trybook/news/components/news.upsert';
import { AccessBansPage } from './trybook/acessesban/trybook.accessesban';
import { AccessBanForm } from './trybook/acessesban/accessesban.create';
import { ClientsSettingPage } from '../dashboard/users/clients/clients';
import { ClientsCreateSettingPage } from '../dashboard/users/clients/create/create';

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
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.settings}
          component={lazy(() =>
            Promise.resolve({ default: GeneralSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.user.to}
          component={lazy(() => Promise.resolve({ default: UserSettingPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.webhook.to}
          component={lazy(() =>
            Promise.resolve({ default: WebHookSettingPage })
          )}
        />
        <Route
          // userCreate
          path={PAGES_LIST_ROUTER.dashboard.setting.setting.create.to}
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
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.groups.create.to}
          component={lazy(() =>
            Promise.resolve({ default: GroupCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.security.groups.update.to}
          component={lazy(() =>
            Promise.resolve({ default: GroupCreateSettingPage })
          )}
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
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.form.create.to}
          component={lazy(() =>
            Promise.resolve({ default: FormCreateSettingPage })
          )}
        />
        {/*
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.to}
          component={lazy(() =>
            Promise.resolve({ default: FormAnalyticSettingPage })
          )}
        />
        */}
        {/*
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.to}
          component={lazy(() =>
            Promise.resolve({ default: FormInspectSettingPage })
          )}
        />
        */}
        {/*
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.response.to}
          component={lazy(() =>
            Promise.resolve({ default: FormResponseSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.list.to}
          component={lazy(() =>
            Promise.resolve({ default: FormListsSettingPage })
          )}
        />
        */}
        {/**
         *
         * this is the reports MCP
         *
         * */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.report.to}
          component={lazy(() =>
            Promise.resolve({ default: FormReportSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.report.update.to}
          component={lazy(() => Promise.resolve({ default: ReportUpsertForm }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.forms.report.create.to}
          component={lazy(() => Promise.resolve({ default: ReportUpsertForm }))}
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
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.create.to}
          component={lazy(() =>
            Promise.resolve({ default: RoundCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.update.to}
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
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.places.create.to}
          component={lazy(() =>
            Promise.resolve({ default: PlaceCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.places.update.to}
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
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.create.to}
          component={lazy(() =>
            Promise.resolve({ default: ActivityCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.update.to}
          component={lazy(() =>
            Promise.resolve({ default: ActivityCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.project.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.project.create.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.shifts.project.update.to}
          component={lazy(() =>
            Promise.resolve({ default: ProjectCreateSettingPage })
          )}
        />
        {/* MEMO */}
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
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.predefined.to}
          component={lazy(() =>
            Promise.resolve({ default: PredefinedSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.resource.to}
          component={lazy(() =>
            Promise.resolve({ default: ResourceMemoSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.predefined.create.to}
          component={lazy(() =>
            Promise.resolve({ default: PredefinedCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.memo.predefined.update.to}
          component={lazy(() =>
            Promise.resolve({ default: PredefinedCreateSettingPage })
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
        {/* OPCIONES DE USUARIOS */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.areas.to}
          component={lazy(() => Promise.resolve({ default: UserAreasPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.groups.to}
          component={lazy(() => Promise.resolve({ default: UserGroupsPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.roles.to}
          component={lazy(() => Promise.resolve({ default: UserRolesPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.roles.create.to}
          component={lazy(() => Promise.resolve({ default: RolesUpsertPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.roles.update.to}
          component={lazy(() => Promise.resolve({ default: RolesUpsertPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.clients.to}
          component={lazy(() =>
            Promise.resolve({ default: ClientsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.clients.create.to}
          component={lazy(() =>
            Promise.resolve({ default: ClientsCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.clients.update.to}
          component={lazy(() =>
            Promise.resolve({ default: ClientsCreateSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.areas.create.to}
          component={lazy(() => Promise.resolve({ default: AreaCreatePage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.areas.update.to}
          component={lazy(() => Promise.resolve({ default: AreaCreatePage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.password.to}
          component={lazy(() => Promise.resolve({ default: UserPasswordPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.users.settings.to}
          component={lazy(() => Promise.resolve({ default: UserSettingsPage }))}
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
          path={PAGES_LIST_ROUTER.dashboard.setting.access.resource.create.to}
          component={lazy(() =>
            Promise.resolve({ default: CreateResourceSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.sets.create.to}
          component={lazy(() =>
            Promise.resolve({ default: CreateSetsSettingPage })
          )}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.access.place.create.to}
          component={lazy(() =>
            Promise.resolve({ default: CreatePlacesSettingPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.access.information.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: CreateInformationSettingPage })
          )}
        />
        {/* NOTIFICATIONS MENU */}
        {/* SCHEDULED OPTIONS */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.notification.scheduled.to}
          component={lazy(() =>
            Promise.resolve({ default: ScheduledNotificationsPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.notification.scheduled.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: ScheduledNotificationForm })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.notification.scheduled.update.to
          }
          component={lazy(() =>
            Promise.resolve({ default: ScheduledNotificationEditPage })
          )}
        />
        {/* TEMPLATE OPTIONS */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.notification.template.to}
          component={lazy(() =>
            Promise.resolve({ default: TemplateNotificationPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.notification.template.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: TemplateCreateForm })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.notification.template.update.to
          }
          component={lazy(() =>
            Promise.resolve({ default: TemplateNotificationEditPage })
          )}
        />

        {/* OPCIONES RECIDENCE */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.residences.to}
          component={lazy(() =>
            Promise.resolve({ default: TrybookResidencesPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.residences.create.to
          }
          component={lazy(() => Promise.resolve({ default: SiteCreatePage }))}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.residences.update.to
          }
          component={lazy(() => Promise.resolve({ default: SiteCreatePage }))}
        />

        {/* OPCIONES COMMON ZONE */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.commonZones.to}
          component={lazy(() =>
            Promise.resolve({ default: TrybookCommonZonesPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.commonZones.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: CommonZoneCreatePage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.commonZones.update.to
          }
          component={lazy(() =>
            Promise.resolve({ default: CommonZoneCreatePage })
          )}
        />

        {/* OPCIONES COMMON SLOT */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.commonSlots.to}
          component={lazy(() =>
            Promise.resolve({ default: TrybookCommonSlotsPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.commonSlots.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: CommonSlotCreatetPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.commonSlots.update.to
          }
          component={lazy(() =>
            Promise.resolve({ default: CommonSlotCreatetPage })
          )}
        />

        {/* OPCIONES RESOURCE ZONE */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.resourceZones.to}
          component={lazy(() =>
            Promise.resolve({ default: TrybookResourceZonesPage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.resourceZones.create.to
          }
          component={lazy(() =>
            Promise.resolve({ default: ResourceZoneCreatePage })
          )}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.resourceZones.update.to
          }
          component={lazy(() =>
            Promise.resolve({ default: ResourceZoneCreatePage })
          )}
        />

        {/* OPTIONS NEWS */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.news.to}
          component={lazy(() => Promise.resolve({ default: NewsPage }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.news.create.to}
          component={lazy(() => Promise.resolve({ default: NewsForm }))}
        />
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.news.update.to}
          component={lazy(() => Promise.resolve({ default: NewsForm }))}
        />

        {/* OPCIONES ACCESS BANS */}
        <Route
          path={PAGES_LIST_ROUTER.dashboard.setting.trybook.accessBans.to}
          component={lazy(() => Promise.resolve({ default: AccessBansPage }))}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.accessBans.create.to
          }
          component={lazy(() => Promise.resolve({ default: AccessBanForm }))}
        />
        <Route
          path={
            PAGES_LIST_ROUTER.dashboard.setting.trybook.accessBans.update.to
          }
          component={lazy(() => Promise.resolve({ default: AccessBanForm }))}
        />
      </Suspense>
    </Router>
  );

  return content;
});
