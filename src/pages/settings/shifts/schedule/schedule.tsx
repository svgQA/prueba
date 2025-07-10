// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { columns } from './components/schedule.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { DataSchedule } from './components/data.schedule';
import { ScheduleService } from '@/services';
import { useTranslation } from 'react-i18next';
import { IDay, IRowActionPlace, ISchedule } from '@/types/shift/shift.request';
import { useNavigation } from '@/utils/utilities/navigation';
import { useUserStore } from '@/store/slices';

export const ScheduleSettingPage: FunctionComponent = () => {
  const { redirectSettings } = useNavigation();
  const schedules: Signal<ISchedule[]> = useSignal([]);
  const loading = useSignal<boolean>(false);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_schedule');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getSchedules();
    }
  }, [selectedCompany, location]);

  const getSchedules = async () => {
    loading.value = true;
    const request: any = await ScheduleService.getSchedules();
    if (request.getStatus()) {
      schedules.value = request.getMany();
    }
    loading.value = false;
  };

  // const redirect = () => {
  //   redirectSettings(
  //     PAGES_LIST_ROUTER.dashboard.setting.base,
  //     '/rounds/schedule/create',
  //     'create',
  //     'schedule-create'
  //   );
  // };

  const update = (id: string) => {
    redirectSettings(
      PAGES_LIST_ROUTER.dashboard.setting.base,
      `/rounds/schedule/update/${id}`,
      'update',
      'schedule-update'
    );
  };

  const deleteSchedule = async (id: string) => {
    const request = await ScheduleService.deleteSchedule(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getSchedules();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteSchedule(action.id);
        break;
    }
  };

  return (
    <>
      <Table<ISchedule>
        data={schedules.value}
        columns={columns}
        expandable={(row: ISchedule) => {
          return (
            <ul className='flex flex-wrap justify-center gap-x-2'>
              {row.days.map((dayInfo: IDay) => (
                <DataSchedule daySelection={dayInfo} />
              ))}
            </ul>
          );
        }}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
