import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/schedule.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store/settings';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { DataSchedule } from './components/data.schedule';
import { ScheduleService } from '@/services';
import { useTranslation } from 'react-i18next';
import { IDay, IRowActionPlace, ISchedule } from '@/types/shift/shift.request';

export const ScheduleSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const schedules: Signal<ISchedule[]> = useSignal([]);
  const loading = useSignal<boolean>(false);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_schedule');
    getSchedules();
  }, []);

  const getSchedules = async () => {
    loading.value = true;
    const request: any = await ScheduleService.getSchedules();
    if (request.getStatus()) {
      schedules.value = request.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.create.to,
      label: 'create',
      id: 'schedule-create',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: t('schedule.createSchedule') });
    navigate('/rounds/schedule/create');
  };

  const update = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.update.to,
      label: 'update',
      id: 'schedule-update',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: t('schedule.editSchedule') });
    navigate(`/rounds/schedule/update/${id}`);
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
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='new'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
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
          name: true,
          daysAllowed: true,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
