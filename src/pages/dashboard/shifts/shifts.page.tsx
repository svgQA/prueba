/* ShiftsPage queda como composición de hooks + UI; lógica pesada sale a hooks para legibilidad y mejor performance. */
import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { Button } from '@/components/common/button/button';

import { getColumns } from './components/shift.columns';
import { ExpandableMultiple } from './components/expandable.multiple';
import { TaskForm } from './components/upsert.modal';
import { SendForm } from './components/send/send.modal';
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
import { BalanceIndicator } from '@/components/common/balance/balance';

import { VIEW_NAME } from './utils/view.name';
import { useShiftsData } from './utils/hooks/useShiftData';
import { useShiftSocket } from './utils/hooks/useShiftSocket';
import { useShiftModals } from './utils/hooks/useShiftModal';
import { useShiftActions } from './utils/hooks/useShiftAction';

export const ShiftsPage: FunctionalComponent = () => {
  const { t } = useTranslation();

  const showUpsertModal = useSignal(false);
  const showSendModal = useSignal(false);
  const notificationValidate = useSignal(false);
  const showShiftModal = useSignal(false);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const shifts = useSignal<IShiftResponse[]>([]);
  const loading = useSignal(false);

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();
  const [keywordsSelected, setKeywordsSelected] = useState<string[]>([]);
  const [timeBeforeSelected, setTimeBeforeSelected] = useState<number>(0);
  const [externalSelected, setExternalSelected] = useState<string>('');

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [dateRangeFilters, setDateRangeFilters] = useState<{
    [key: string]: [string, string];
  } | null>(null);

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
  }, [t]);

  const { services, users, hasValidPlayer, fetchInitialData } = useShiftsData({
    shifts,
    loading,
    notificationValidate,
  });

  useEffect(() => {
    if (!selectedCompany) return;
    fetchInitialData(dateRangeFilters);
  }, [dateRangeFilters, fetchInitialData, selectedCompany]);

  useShiftSocket({
    shifts,
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
    shifts,
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

  const buttonMenu = useMemo(() => {
    return (
      <div className='flex items-center gap-2 ml-1'>
        <Button
          name='button-change-table'
          onClick={() => handleViewChange(VIEW_NAME.TABLE)}
          selected={currentView.value === VIEW_NAME.TABLE}
          icon='443'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => handleViewChange(VIEW_NAME.SCHEDULER)}
          selected={currentView.value === VIEW_NAME.SCHEDULER}
          icon='412'
        />
        <Button
          name='button-change-map'
          onClick={() => handleViewChange(VIEW_NAME.MAP)}
          selected={currentView.value === VIEW_NAME.MAP}
          icon='103'
        />

        <div className='relative'>
          <Button
            name='button-action'
            rounded={false}
            icon='314'
            label='remote'
            onClick={toggleSendModal}
            selected={showSendModal.value}
            disabled={!hasValidPlayer}
          />
          {showSendModal.value && (
            <div className='my-3 absolute left-0 rounded-lg shadow-lg w-[600px]'>
              <SendForm
                onClose={handleCloseSendModal}
                hasplayers={hasValidPlayer}
                users={selectedUsers as []}
              />
            </div>
          )}
        </div>
      </div>
    );
  }, [
    currentView.value,
    handleCloseSendModal,
    handleViewChange,
    hasValidPlayer,
    selectedUsers,
    showSendModal.value,
    toggleSendModal,
  ]);

  return (
    <Section className='px-7 py-1'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-3'>
        <MetricCard
          title='m_active_user'
          subtitle='m_active_user_d'
          value={1280}
          unit=''
          icon='006'
          color='emerald'
        >
          <BalanceIndicator
            value={20}
            leftLabel='Temprano'
            centerLabel='Bien'
            rightLabel='Tarde'
            showLabel={false}
          />
        </MetricCard>

        <MetricCard
          title='m_active_shift'
          subtitle='m_active_shift_d'
          value={1280}
          unit=''
          icon='028'
          color='emerald'
          indicators={[
            {
              label: 'm_user_active',
              value: 742,
              unit: '',
              icon: '090',
              tone: 'success',
            },
            {
              label: 'm_user_churn',
              value: 2.1,
              unit: '%',
              icon: '112',
              tone: 'warning',
            },
            {
              label: 'm_user_latency',
              value: 180,
              unit: 'ms',
              icon: '031',
              tone: 'neutral',
            },
          ]}
        />

        <MetricCard
          title='m_churn_round'
          subtitle='m_churn_round_d'
          value={1280}
          unit=''
          icon='142'
          color='emerald'
          indicators={[
            {
              label: 'm_user_active',
              value: 742,
              unit: '',
              icon: '090',
              tone: 'success',
            },
            {
              label: 'm_user_churn',
              value: 2.1,
              unit: '%',
              icon: '112',
              tone: 'warning',
            },
            {
              label: 'm_user_latency',
              value: 180,
              unit: 'ms',
              icon: '031',
              tone: 'neutral',
            },
          ]}
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-wrap items-center justify-between gap-2 sm:gap-3 w-full'>
            {buttonMenu}
            <Button
              name='button-create-shift'
              label='create'
              onClick={handleCreacteNewShift}
              icon='044'
              iconSize='sm'
            />
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table<IShiftResponse>
            data={shifts.value}
            columns={getColumns(onClickAction)}
            pageSize={20}
            selectable
            onNotifications={onNotifications}
            hasNotifications={notificationValidate.value}
            loading={loading.value}
            onRangeChange={(range) => setDateRangeFilters(range)}
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
      </div>

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
    </Section>
  );
};
