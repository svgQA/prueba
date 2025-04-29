import { FunctionalComponent } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { useSignal } from '@preact/signals';
import {
  NotificationServiceFront,
  ShiftService,
  ShiftSummary,
} from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { columns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';
import { useTranslation } from 'react-i18next';

import {
  GeneralTask,
  Task,
  User,
  ViewMode,
} from '@/components/compose/gantt/types/public-types';
import dayjs from 'dayjs';
import { Gantt } from '@/components/compose/gantt';
import { TaskForm } from './components/upsert.modal';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { SendForm } from './components/send/send.modal';
import { ExpandableMultiple } from './components/expandable.multiple';
import { ShiftForm } from './components/shift.modal';
import LiveUserMap from './components/shift.map';
import { Group } from '@/components/compose/gantt/components/gantt/group';
import { PlannerView } from './components/planner.view';
import { UserService } from '@/services/user';
import { MentionOption } from '@/components/common/mention-editor';
import { toast } from 'react-toastify';
import i18n from '@/i18n';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
  SUPERVISOR,
  MAP,
  PLANNER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const showUpsertModal = useSignal<boolean>(false);
  const showSendModal = useSignal<boolean>(false);
  const showShiftModal = useSignal<boolean>(false);
  const shiftSummary = useSignal<ShiftSummary>({
    total: 0,
    in_progress: 0,
    completed: 0,
  });

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const shifts = useSignal<IShiftResponse[]>([]);
  const defaultColumn = useSignal<string>('default');

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();

  const [services, setServices] = useState<MentionOption[]>([]);
  const [users, setUsers] = useState<MentionOption[]>([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [onNotifications, setOnNotifications] = useState(false);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  // Memoizar los servicios y usuarios para evitar re-renders innecesarios
  const memoizedServices = useMemo(() => services, [services]);
  const memoizedUsers = useMemo(() => users, [users]);

  const startDate = dayjs().subtract(1, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });

  const handleViewMode = (viewMode: ViewMode = ViewMode.QuarterDay) => {
    setGanttShifts({ startDate, endDate, users: [] });
    setView(viewMode);
    getGanttHandler(viewMode);
  };

  const getGanttHandler = async (viewMode?: ViewMode) => {
    const response = await ShiftService.get_gantt({
      page: 1,
      items: 100,
      mode: viewMode,
    });
    if (!response.getStatus()) return;
    setGanttShifts((prev) => ({ ...prev, users: response.getMany() }));
  };

  // Efecto que observa shifts.value
  // Ineficiente a morir.
  useEffect(() => {
    const result = shifts.value.some(
      (shift: any) =>
        typeof shift?.employee?.playerId === 'string' &&
        shift.employee.playerId.trim() !== ''
    );
    setHasValidPlayer(result);
  }, [shifts.value]);

  /**
   * Handle the useEffect hook for the document title and shift retrieval.
   */
  useEffect(() => {
    document.title = t('shifts.pageTitle');
    handleGetShiftSummary();
    fetchInitialData();
  }, []);

  // const fetchShifts = async () => {
  //   const response = await ShiftService.get_all({ page: 1, items: 1000 });
  //   if (!response.getStatus()) return;
  //   hifts.value(response.getMany());
  // };

  const fetchInitialData = async () => {
    try {
      const [
        shiftsResponse,
        servicesResponse,
        usersResponse,
        hasValidResponse,
      ] = await Promise.all([
        ShiftService.get_all({ page: 1, items: 1000 }),
        ShiftService.getListService(),
        UserService.getListUsers(),
        NotificationServiceFront.hasUsersWithPlayerId(),
      ]);

      if (shiftsResponse && shiftsResponse.getStatus()) {
        shifts.value = shiftsResponse.getMany();
      }

      if (servicesResponse.getStatus()) {
        setServices(servicesResponse.getMany());
      }

      if (usersResponse.getStatus()) {
        setUsers(usersResponse.getMany());
      }

      const { hasUsers } = hasValidResponse.getOne();
      setHasValidPlayer(hasUsers);
      hasValidPlayerRef.current = hasUsers;
    } catch (error) {
      toast.error('notification.error_fetching_initial_data');
    }
  };

  useEffect(() => {
    if (currentView.value === VIEW_NAME.SCHEDULER) {
      getGanttHandler(view);
    }
  }, [currentView.value]);

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300;
    if (view === ViewMode.Week) return 250;
    return 60;
  }, [view]);

  const hasValidPlayerRef = useRef(false);
  const onNotificationsRef = useRef(false);

  // sincroniza ambos:
  useEffect(() => {
    hasValidPlayerRef.current = hasValidPlayer;
    setHasValidPlayer(hasValidPlayerRef.current);
  }, [hasValidPlayer]);

  useEffect(() => {
    onNotificationsRef.current = onNotifications;
    setOnNotifications(onNotificationsRef.current);
  }, [onNotifications]);

  /**
   * Eventos de toggle para los modales
   */
  const toggleSendModal = () => {
    if (!hasValidPlayerRef.current) {
      toast.warn(i18n.t('notification.nobody_have_player_id'));
      return;
    }

    if (!onNotificationsRef.current) {
      // 🟡 Primera vez: solo activa notificaciones
      setOnNotifications(true);
      onNotificationsRef.current = true;
      return;
    }

    // ✅ Siguientes veces: solo abre el modal (sin toggle)
    if (selectedUsers.length === 0) {
      toast.warn(i18n.t('notification.select_at_least_one_employee'));
      setOnNotifications(false);
      onNotificationsRef.current = false;
      return;
    } else {
      showSendModal.value = true;
    }
  };

  const toggleUpsertModal = () => {
    showUpsertModal.value = !showUpsertModal.value;
  };

  const toggleShiftModal = () => {
    showShiftModal.value = !showShiftModal.value;
  };

  /**
   * Eventos para cerrar los modales
   */
  const handleCloseUpsertModal = useCallback(() => {
    cleanSelectedData();
    toggleUpsertModal();
  }, []);

  const handleCloseSendModal = useCallback(() => {
    showSendModal.value = false;
    setOnNotifications(false);
    onNotificationsRef.current = false;
  }, []);

  const handleCloseShiftModal = useCallback(() => {
    toggleShiftModal();
  }, []);

  /**
   * Eventos del gantt
   */
  const handleDblClick = useCallback((task: Task) => {
    setTaskSelected(task);
    toggleShiftModal();
  }, []);

  const handleClick = useCallback((/* task: Task */) => {}, []);

  const handleUserDoubleClick = useCallback(
    (id: string | number) => {
      const selectedUser = ganttShifts.users.find((user) => user.id === id);
      setUserSelected(selectedUser);
      toggleUpsertModal();
    },
    [ganttShifts.users]
  );

  const handleUserClick = useCallback(
    (_: string | number) => {
      // const selectedUser = ganttShifts.users.find((user) => user.id === id);
      // if (selectedUser) {
      //   setUserSelected(selectedUser);
      // }
    },
    [ganttShifts.users]
  );

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm(t('shifts.confirmDelete', { name: task.name }));
  }, []);

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined);
    setTaskSelected(undefined);
  }, []);

  /**
   * Eventos de los botones superiores
   */
  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

  const handleTaskChange = useCallback(
    (_: Task) => {
      if (taskSelected) {
      }
    },
    [shifts]
  );

  const handleGetShiftSummary = async () => {
    const summary = await ShiftService.getShiftSummary();
    if (!summary.getStatus()) return;
    shiftSummary.value = summary.getOne();
  };

  const calculatePercentage = (value: number): string => {
    if (shiftSummary.value.total === 0) return '0%';
    return `${Math.round((value / shiftSummary.value.total) * 100)}%`;
  };

  const handleCreacteNewShift = () => {
    cleanSelectedData();
    toggleUpsertModal();
  };

  const buttonMenu = useMemo(
    () => (
      <div className='flex items-center gap-2'>
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.TABLE
              ? 'bg-primary-opacity p-2'
              : ''
          }
          icon='320'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.SCHEDULER);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.SCHEDULER
              ? 'bg-primary-opacity p-2'
              : ''
          }
          icon='330'
        />
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.MAP);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.MAP ? 'bg-primary-opacity p-2' : ''
          }
          icon='321'
        />
        <div className='relative'>
          <Button
            name='button-action'
            rounded={false}
            icon='314'
            onClick={toggleSendModal}
            className={`border-2 p-2 ${
              !hasValidPlayer
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : onNotifications
                  ? 'bg-primary-opacity'
                  : 'border-primary'
            }`}
          />
          {showSendModal.value && (
            <div className='absolute mt-4 mr-12 z-50 rounded p-4'>
              <SendForm
                onClose={handleCloseSendModal}
                hasplayers={hasValidPlayer}
                users={selectedUsers as []}
              />
            </div>
          )}
        </div>

        <Button
          name='button-supervision'
          label={t('shifts.remoteSupervision')}
          className='bg-primary text-white py-1 rounded px-4'
          onClick={() => {
            handleViewChange(VIEW_NAME.SUPERVISOR);
          }}
        />
        <Button
          name='button-change-planner'
          onClick={() => {
            handleViewChange(VIEW_NAME.PLANNER);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.PLANNER
              ? 'bg-primary-opacity p-2'
              : ''
          }
          icon='331'
        />
      </div>
    ),
    [
      currentView.value,
      hasValidPlayer,
      onNotifications,
      showSendModal.value,
      selectedUsers,
    ]
  );

  const handleReloadSignal = () => {
    getGanttHandler(view);
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('shifts.cards.totalToday')}
          count={shiftSummary.value.total}
          subtitle=''
          color='t-dark'
          icon='054'
        />

        <CardData
          title='Turnos En Curso'
          count={calculatePercentage(shiftSummary.value.in_progress)}
          subtitle=''
          color='t-dark'
          icon='052'
        />

        <CardData
          title={t('shifts.cards.completed')}
          count={calculatePercentage(shiftSummary.value.completed)}
          subtitle=''
          color='t-dark'
          icon='015'
        />
      </div>

      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
            <Button
              name='button-create-shift'
              label={t('shifts.buttons.create')}
              className='mx-3 px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={handleCreacteNewShift}
            />
          </div>
        </div>

        {currentView.value === VIEW_NAME.TABLE && (
          <Table<IShiftResponse>
            data={shifts.value}
            columns={columns}
            showExpandableIcon={false}
            pageSize={20}
            selectable
            onNotifications={onNotifications}
            onSelectionChange={(rows) => {
              const validUsers = rows.map((row: any) => ({
                id: row.employee.id,
                name: row.employee.name,
                email: row.employee.email,
                playerId: row.employee.playerId,
              }));

              setSelectedUsers(validUsers as any);
            }}
            expandable={(row: IShiftResponse, currentColumnName?: string) => (
              <ExpandableMultiple
                type={currentColumnName || defaultColumn.value}
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
          />
        )}

        {currentView.value === VIEW_NAME.SCHEDULER && (
          <Gantt
            tasks={ganttShifts}
            viewMode={view}
            onDateChange={handleTaskChange}
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
          <PlannerView services={memoizedServices} users={memoizedUsers} />
        )}
        {currentView.value === VIEW_NAME.MAP && <LiveUserMap />}
      </div>

      <TaskForm
        closed={showUpsertModal.value}
        onClose={handleCloseUpsertModal}
        posSave={handleViewMode}
        userSelected={userSelected}
        taskSelected={taskSelected}
      />

      <ShiftForm
        closed={showShiftModal.value}
        onClose={handleCloseShiftModal}
        taskSelected={taskSelected}
        posAction={handleViewMode}
        onSupervision={() => {
          handleViewChange(VIEW_NAME.SUPERVISOR);
          handleCloseShiftModal();
        }}
      />
    </Section>
  );
};
