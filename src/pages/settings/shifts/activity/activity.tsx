// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { columns } from './components/activity.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { ShiftService } from '@/services/shift/shift';
import { ToastManager } from '@/utils/toast/toast-manager';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/utils/utilities/navigation';
import { useUserStore } from '@/store/slices';

export interface IActivity {
  id: number;
  start: number;
  end: number;
  roundId: number;
  projectId: number;
  status: string;
  type: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ActivitySettingPage: FunctionComponent = () => {
  const { redirectSettings } = useNavigation();
  const activity: Signal<IActivity[]> = useSignal([]);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_service');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getActivities();
    }
  }, [selectedCompany, location]);

  const getActivities = async () => {
    const request: any = await ShiftService.getActivities();
    activity.value = request.data;
  };

  // const redirect = () => {
  //   redirectSettings(
  //     PAGES_LIST_ROUTER.dashboard.setting.base,
  //     '/rounds/activity/create',
  //     'create',
  //     'activity-create'
  //   );
  // };

  const updateActivity = (id: string) => {
    redirectSettings(
      PAGES_LIST_ROUTER.dashboard.setting.base,
      `/rounds/activity/update/${id}`,
      'edit',
      'activity-update'
    );
  };

  const deleteActivity = async (id: string) => {
    const request = await ShiftService.deleteActivity(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getActivities();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        updateActivity(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteActivity(action.id);
        break;
    }
  };

  return (
    <>
      <Table<IActivity>
        data={activity.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        absolute
      />
    </>
  );
};
