/* ShiftsPage queda como composición de hooks + UI; lógica pesada sale a hooks para legibilidad y mejor performance. */
import { FunctionalComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  // useRef,
  useState,
} from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Table } from '@/components/common/table/table';
import { Button } from '@/components/common/button/button';

import { getColumns } from './components/shift.columns';
import { ExpandableMultiple } from './components/expandable.multiple';
import { TaskForm } from './components/upsert.modal';
// import { SendForm } from './components/send/send.modal';
import { ShiftForm } from './components/shift.modal';
import LiveUserMap from './components/shift.map';
import { PlannerView } from './components/planner.view';

import { Gantt } from '@/components/compose/gantt';
import { Group } from '@/components/compose/gantt/components/gantt/group';
import {
  ViewMode,
  GeneralTask,
  Task,
  User,
} from '@/components/compose/gantt/types/public-types';

import { useUserStore } from '@/store/slices';
import { modulesReport } from '@/types/form';
import { IShiftResponse } from '@/types/shift/activity';

import { MetricCard } from '@/components/compose/cards/company/metric';

import { VIEW_NAME } from './utils/view.name';
import { useShiftsData } from './utils/hooks/useShiftData';
import { useShiftSocket } from './utils/hooks/useShiftSocket';
import { useShiftModals } from './utils/hooks/useShiftModal';
import { useShiftActions } from './utils/hooks/useShiftAction';
import { ButtonsPage, CardsPage, SectionPage } from '@/pages/component';
import {
  useMetricRound,
  useMetricShift,
  useMetricUser,
} from '@/store/signals/metric';
import { signalShifts } from '@/store/signals/shift';
import { Modal } from '@/components/common/modal/modal';
import { ManualNotificationForm } from './components/send/tabs/manual-notification-form';
import ModeSwitch from './components/mode';
import { isMonitoring, setSignalShiftMode, SHIFT_MODE } from './store/shift';
import { IRangeValues } from '@/components/common/table/components/range';

export const ShiftsPage: FunctionalComponent = () => {
  const { t } = useTranslation();

  const showUpsertModal = useSignal(false);
  const showSendModal = useSignal(false);
  const notificationValidate = useSignal(false);
  const showShiftModal = useSignal(false);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  // const shifts = useSignal<IShiftResponse[]>([]);
  const loading = useSignal(false);

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();
  const [keywordsSelected, setKeywordsSelected] = useState<string[]>([]);
  const [timeBeforeSelected, setTimeBeforeSelected] = useState<number>(0);
  const [externalSelected, setExternalSelected] = useState<string>('');

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [dateRangeFilters, setDateRangeFilters] = useState<IRangeValues | null>(
    null
  );

  const startDate = useMemo(() => dayjs().subtract(1, 'day').toDate(), []);
  const endDate = useMemo(
    () => dayjs(startDate).add(1, 'week').toDate(),
    [startDate]
  );

  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });

  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_shift');
  }, []);

  const { services, users, hasValidPlayer, fetchInitialData } = useShiftsData({
    loading,
    notificationValidate,
  });

  const reloadData = () => {
    if (!selectedCompany) return;
    fetchInitialData(dateRangeFilters);
  };

  useEffect(() => {
    reloadData();
  }, [dateRangeFilters, fetchInitialData, selectedCompany]);

  useShiftSocket({
    dateRangeFilters,
    onCreate: fetchInitialData,
  });

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined);
    setTaskSelected(undefined);
  }, []);

  const {
    onNotifications,
    handleViewChange,
    toggleSendModal,
    toggleUpsertModal,
    toggleShiftModal,
    handleCloseSendModal,
  } = useShiftModals({
    currentView,
    showUpsertModal,
    showSendModal,
    showShiftModal,
    hasValidPlayer,
    selectedUsers,
  });

  const { onClickAction, checkItem, handleTaskDelete } = useShiftActions({
    openUpsert: () => {
      toggleUpsertModal();
    },
    setTaskSelected,
    setKeywordsSelected,
    setTimeBeforeSelected,
    setExternalSelected,
    refetch: () => fetchInitialData(dateRangeFilters),
  });

  const handleViewMode = useCallback(
    async (viewMode: ViewMode = ViewMode.QuarterDay) => {
      if (currentView.value === VIEW_NAME.SCHEDULER) {
        setView(viewMode);
        setGanttShifts({ startDate, endDate, users: [] });

        const { GanttService } = await import('@/services');
        const response = await GanttService.get_gantt({
          page: 1,
          items: 100,
          mode: viewMode,
        });
        if (!response.getStatus()) return;
        setGanttShifts((prev) => ({ ...prev, users: response.getMany() }));
      }

      if (currentView.value === VIEW_NAME.TABLE) {
        fetchInitialData(dateRangeFilters);
      }
    },
    [currentView, dateRangeFilters, endDate, fetchInitialData, startDate]
  );

  useEffect(() => {
    if (currentView.value !== VIEW_NAME.SCHEDULER) return;

    (async () => {
      const { GanttService } = await import('@/services');
      const response = await GanttService.get_gantt({
        page: 1,
        items: 100,
        mode: view,
      });
      if (!response.getStatus()) return;
      setGanttShifts((prev) => ({ ...prev, users: response.getMany() }));
    })();
  }, [currentView.value, view]);

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300;
    if (view === ViewMode.Week) return 250;
    return 60;
  }, [view]);

  const handleDblClick = useCallback(
    (task: Task) => {
      setTaskSelected(task);
      toggleShiftModal();
    },
    [toggleShiftModal]
  );

  const handleUserDoubleClick = useCallback((_id: string | number) => {}, []);
  const handleUserClick = useCallback((_id: string | number) => {}, []);
  const handleClick = useCallback(() => {}, []);

  const handleReloadSignal = useCallback(() => {
    handleViewMode(view);
  }, [handleViewMode, view]);

  const handleCreacteNewShift = useCallback(() => {
    cleanSelectedData();
    toggleUpsertModal();
  }, [cleanSelectedData, toggleUpsertModal]);

  return (
    <SectionPage
      padding
      cards={
        <CardsPage className='xl:grid-cols-7'>
          <MetricCard
            title='m_active_user'
            subtitle='m_active_user_d'
            values={useMetricUser.value}
            unit=''
            icon='006'
            color='emerald'
            indicator='gauge'
            className='col-span-2'
            indicators={[
              {
                label: 'm_user_v',
                value: 0,
                unit: 'und',
                icon: '090',
                tone: 'success',
                action: 'user-active',
              },
              {
                label: 'm_user_churn_v',
                value: 0,
                unit: 'und',
                icon: '030',
                tone: 'neutral',
              },
              {
                label: 'm_user_missing_v',
                value: 0,
                unit: 'und',
                icon: '010',
                tone: 'warning',
              },
            ]}
          />

          <MetricCard
            title='m_active_shift'
            subtitle='m_active_shift_d'
            values={useMetricShift.value}
            unit=''
            icon='028'
            color='emerald'
            indicator='gauge'
            className='col-span-2'
            indicators={[
              {
                label: 'm_shift_v',
                value: 0,
                unit: 'und',
                icon: '090',
                tone: 'success',
                action: 'shift-expected',
              },
              {
                label: 'm_shift_churn_v',
                value: 0,
                unit: 'und',
                icon: '030',
                tone: 'neutral',
                action: 'shift-active',
              },
              {
                label: 'm_shift_risk_v',
                value: 0,
                unit: 'und',
                icon: '010',
                tone: 'warning',
              },
            ]}
          />

          <MetricCard
            title='m_churn_round'
            subtitle='m_churn_round_d'
            values={useMetricRound.value}
            unit=''
            icon='142'
            color='emerald'
            indicator='balance'
            className='col-span-2'
            indicators={[
              {
                label: 'm_round_pct_v',
                value: 742,
                unit: '%',
                icon: '090',
                tone: 'success',
                // hide: true,
              },
              {
                label: 'm_round_tim_v',
                value: 0,
                unit: '%',
                icon: '030',
                tone: 'warning',
              },
              /*
              {
                label: 'm_round_v',
                value: 0,
                unit: 'und',
                icon: '029',
                tone: 'neutral',
              },
              */
            ]}
          />
          <MetricCard
            title='m_filter_title'
            subtitle='m_filter_description'
            values={[0, 0, 0, 0]}
            unit=''
            icon='118'
            color='emerald'
            indicator='button'
            indicators={[
              {
                label: 'm_round_tim_v',
                value: 0,
                unit: '%',
                icon: '030',
                tone: 'warning',
                action: 'user-active',
              },
              {
                label: 'm_round_tim_v',
                value: 0,
                unit: '%',
                icon: '030',
                tone: 'warning',
                action: 'user-active',
              },
              /*
              {
                label: 'm_round_tim_v',
                value: 0,
                unit: '%',
                icon: '030',
                tone: 'warning',
                action: 'user-active',
              },
              */
            ]}
          />
        </CardsPage>
      }
      buttons={
        <ButtonsPage>
          <div className='flex items-center gap-2 ml-1'>
            <Button
              name='button-change-table'
              onClick={() => handleViewChange(VIEW_NAME.TABLE)}
              selected={currentView.value === VIEW_NAME.TABLE}
              icon='443'
            />
            {!isMonitoring.value && (
              <Button
                name='button-change-scheduler'
                onClick={() => handleViewChange(VIEW_NAME.SCHEDULER)}
                selected={currentView.value === VIEW_NAME.SCHEDULER}
                icon='412'
              />
            )}
            {isMonitoring.value && (
              <Button
                name='button-change-map'
                onClick={() => handleViewChange(VIEW_NAME.MAP)}
                selected={currentView.value === VIEW_NAME.MAP}
                icon='103'
              />
            )}
            <Button
              name='button-reload-data'
              onClick={() => reloadData()}
              transparent
              borderless
              icon='138'
            />

            {currentView.value === VIEW_NAME.TABLE && (
              <ModeSwitch
                value={SHIFT_MODE.MONITOR}
                onChange={setSignalShiftMode}
              />
            )}
          </div>
          {isMonitoring.value && (
            <Button
              name='button-action'
              rounded={false}
              icon='314'
              label='remote'
              onClick={toggleSendModal}
              selected={showSendModal.value}
              disabled={!hasValidPlayer}
            />
          )}
          {!isMonitoring.value && (
            <Button
              name='button-create-shift'
              label='create'
              onClick={handleCreacteNewShift}
              icon='044'
              iconSize='sm'
            />
          )}
        </ButtonsPage>
      }
      modals={
        <>
          <Modal
            open={showSendModal.value}
            name='modal-send-notification'
            onClose={() => {
              showSendModal.value = !showSendModal;
            }}
            width='w-[800px]'
            position='fixed'
            header={<h3>{t('d_send_notification')}</h3>}
          >
            <ManualNotificationForm
              users={selectedUsers as []}
              hasplayers={hasValidPlayer}
              onClose={handleCloseSendModal}
              unreport={false}
            />
          </Modal>

          <TaskForm
            closed={showUpsertModal.value}
            onClose={() => {
              cleanSelectedData();
              toggleUpsertModal();
            }}
            posSave={handleViewMode}
            shiftId={userSelected?.id || taskSelected?.id}
            users={users}
            keywordsSelected={keywordsSelected}
            timeBeforeSelected={timeBeforeSelected}
            externalSelected={externalSelected}
          />

          <ShiftForm
            closed={showShiftModal.value}
            onClose={toggleShiftModal}
            taskSelected={taskSelected}
            posAction={handleViewMode}
            onSupervision={() => {
              handleViewChange(VIEW_NAME.SUPERVISOR);
              toggleShiftModal();
            }}
          />
        </>
      }
    >
      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IShiftResponse>
          data={signalShifts.value}
          columns={getColumns(onClickAction)}
          selectable
          onNotifications={onNotifications}
          hasNotifications={notificationValidate.value}
          loading={loading.value}
          onRangeChange={setDateRangeFilters}
          className='!h-[calc(100vh-27.5vh)]'
          onSelectionChange={(rows) => {
            const validUsers = rows.map((row: any) => ({
              id: row.employee.id,
              name: row.employee.name,
              email: row.employee.email,
              playerId: row.employee.playerId,
            }));
            setSelectedUsers(validUsers as any);
          }}
          expandable={(row: IShiftResponse, column?: string) => (
            <ExpandableMultiple
              onCheck={(check) => checkItem(check, row)}
              type={column}
              data={row}
            />
          )}
          visibility={{
            servicePlaceAddress: false,
            city: false,
            employeeId: false,
            client: false,
            duration: false,
            userEmail: false,
            userPhone: false,
            serviceRound: false,
          }}
          searchable={{
            report: false,
            date: false,
            shift: false,
            staus: !isMonitoring.value,
            start: !isMonitoring.value,
            end: !isMonitoring.value,
            round: false,
            task: false,
            duration: false,
          }}
          modules={modulesReport.Shift}
          fileName='shift'
        />
      )}

      {currentView.value === VIEW_NAME.SCHEDULER && (
        <Gantt
          tasks={ganttShifts}
          viewMode={view}
          onDateChange={() => {}}
          onDelete={handleTaskDelete}
          onDoubleClick={handleDblClick}
          onUserDoubleClick={handleUserDoubleClick}
          onUserClick={handleUserClick}
          onClick={handleClick}
          listCellWidth={isChecked ? '155px' : ''}
          columnWidth={columnWidth}
          users={users}
          onReloadSignal={handleReloadSignal}
          group={
            <Group
              onViewModeChange={handleViewMode}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
              status={view}
            />
          }
        />
      )}

      {currentView.value === VIEW_NAME.PLANNER && (
        <PlannerView services={services} users={users} />
      )}

      {currentView.value === VIEW_NAME.MAP && <LiveUserMap unsearch />}
    </SectionPage>
  );
};
