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
  GanttService,
  NotificationService,
  ServiceService,
  ShiftService,
  ShiftSummary,
} from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { getColumns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';
import { useTranslation } from 'react-i18next';
import {
  GeneralTask,
  Task,
  TaskStatus,
  TaskType,
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
import { UserService } from '@/services/general/user';
import { MentionOption } from '@/components/common/mention-editor';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { SHIFT_STATUS } from '@/types/shift/shift.enum.ts';
import { AudioButton } from './audio/socket.button';
import { getLocation } from '@/utils/utilities/location';

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
  const notificationValidate = useSignal<boolean>(false);
  const showShiftModal = useSignal<boolean>(false);
  const shiftSummary = useSignal<ShiftSummary>({
    total: 0,
    in_progress: 0,
    completed: 0,
  });

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const shifts = useSignal<IShiftResponse[]>([]);

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();
  const [keywordsSelected, setKeywordsSelected] = useState<string[]>([]);
  const [timeBeforeSelected, setTimeBeforeSelected] = useState<number>(0);
  const [externalSelected, setExternalSelected] = useState<string>('');

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
    const response = await GanttService.get_gantt({
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
    const [shiftsResponse, servicesResponse, usersResponse, hasValidResponse] =
      await Promise.all([
        ShiftService.get_all({ page: 1, items: 1000 }),
        ServiceService.getServicesSimpleList(),
        UserService.getListUsers(),
        NotificationService.hasUsersWithPlayerId(),
      ]);

    if (shiftsResponse && shiftsResponse.getStatus()) {
      const [hasNotifications, responseShifts] = findNotificationShift(
        shiftsResponse.getMany()
      );
      notificationValidate.value = hasNotifications;

      shifts.value = responseShifts;
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
  };

  const findNotificationShift = (
    shiftsResponse: IShiftResponse[]
  ): [boolean, IShiftResponse[]] => {
    let hasSomeNotifications = false;
    const shifts = shiftsResponse.map((shifts) => {
      if (shifts.employee?.playerId) {
        hasSomeNotifications = true;
        return {
          ...shifts,
          hasNotifications: true,
        };
      }
      return {
        ...shifts,
        hasNotifications: false,
      };
    });

    return [hasSomeNotifications, shifts];
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
    handleViewChange(VIEW_NAME.TABLE);

    if (!hasValidPlayerRef.current) {
      ToastManager.warning(t('notification.nobody_have_player_id'));
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
      ToastManager.warning(t('notification.select_at_least_one_employee'));
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
      <div className='flex items-center gap-2 mr-2'>
        <Button
          name='button-change-table'
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE);
          }}
          selected={currentView.value === VIEW_NAME.TABLE}
          icon='443'
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.SCHEDULER);
          }}
          selected={currentView.value === VIEW_NAME.SCHEDULER}
          icon='412'
        />
        <Button
          name='button-change-map'
          onClick={() => {
            handleViewChange(VIEW_NAME.MAP);
          }}
          selected={currentView.value === VIEW_NAME.MAP}
          icon='103'
        />

        <div className='relative'>
          <Button
            name='button-action'
            rounded={false}
            icon='314'
            label={t('shifts.remoteSupervision')}
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

        {/*
        <Button
          name='button-supervision'
          label={t('shifts.remoteSupervision')}
          className='bg-primary text-white py-1 rounded px-4'
          icon='079'
          iconSize='sm'
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
        */}
      </div>
    ),
    [
      currentView.value,
      hasValidPlayer,
      onNotifications,
      showSendModal.value,
      selectedUsers,
      t,
    ]
  );

  const handleReloadSignal = () => {
    getGanttHandler(view);
  };

  const onClickAction = (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    switch (params.action) {
      case ROW_ACTIONS.UPDATE:
        const shiftUpdate = shifts.value.find(
          (shift) => shift.id === Number(params.id)
        );

        setTaskSelected({
          id: Number(params.id),
          end: shiftUpdate?.end || '',
          start: shiftUpdate?.start || '',
          type: shiftUpdate?.type as TaskType,
          userId: String(shiftUpdate?.employee?.id || ''),
          serviceId: shiftUpdate?.serviceId || '',
          // TODO: Verificar si es necesario
          phone: shiftUpdate?.service?.contract.client.phone || '',
          contract: String(shiftUpdate?.service?.contract.id || ''),
          client: String(shiftUpdate?.service?.contract.client.id || ''),
          cardId: shiftUpdate?.employee?.cardId || '',
          status: shiftUpdate?.status as TaskStatus,
          name: shiftUpdate?.service?.name || '',
          progress: 0,
          service: shiftUpdate?.service?.name || '',
        });

        setKeywordsSelected(shiftUpdate?.keywords || []);
        setTimeBeforeSelected(shiftUpdate?.timeBefore || 0);
        setExternalSelected(shiftUpdate?.externalId || '');
        toggleUpsertModal();
        break;
      case ROW_ACTIONS.DELETE:
        const shift = shifts.value.find(
          (shift) => shift.id === Number(params.id)
        );
        if (!shift) {
          ToastManager.error(t('shift.table.delete.error'));
          return;
        }

        const status = shift.status as unknown as SHIFT_STATUS;
        if (status !== SHIFT_STATUS.CREATED) {
          ToastManager.warning(t('shift.table.delete.warning'));
          return;
        }

        showAlert({
          title: t('shift.table.delete.title'),
          message: t('shift.table.delete.message'),
          onConfirm: () => deleteShift(params.id),
          onCancel: () => {},
        });
        break;
      case ROW_ACTIONS.CHECK_IN:
        handleCheck('CHECK_IN', Number(params.id));
        break;
      case ROW_ACTIONS.CHECK_OUT:
        handleCheck('CHECK_OUT', Number(params.id));
        break;
    }
  };

  const handleCheck = async (type: string, shiftId: number) => {
    const position = await getLocation();
    if (!position) {
      ToastManager.error(t('Error al obtener la ubicación'));
      return;
    }

    console.log('position', position);

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type: type,
    };

    const response = await ShiftService.createCheck(checkData, shiftId);
    if (response.getStatus()) {
      ToastManager.success(t('shift.expandable.date.success'));
    }
  };

  const deleteShift = async (id: string) => {
    const response = await ShiftService.deleteActivity(id);
    if (!response.getStatus()) return;
    ToastManager.success(t('shift.table.delete.success'));
    fetchInitialData();
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('shifts.cards.totalToday')}
          count={shiftSummary.value.total}
          subtitle=''
          color='t-dark'
          icon='328'
        />

        <CardData
          title={t('shifts.cards.inProgress')}
          count={calculatePercentage(shiftSummary.value.in_progress)}
          subtitle=''
          color='t-dark'
          icon='311'
        />

        <CardData
          title={t('shifts.cards.completed')}
          count={calculatePercentage(shiftSummary.value.completed)}
          subtitle=''
          color='t-dark'
          icon='312'
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
            <Button
              name='button-create-shift'
              label={t('shifts.buttons.create')}
              onClick={handleCreacteNewShift}
              icon='044'
              iconSize='sm'
            />
            <AudioButton />
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
            onSelectionChange={(rows) => {
              const validUsers = rows.map((row: any) => ({
                id: row.employee.id,
                name: row.employee.name,
                email: row.employee.email,
                playerId: row.employee.playerId,
              }));

              setSelectedUsers(validUsers as any);
            }}
            expandable={(row: IShiftResponse, column?: string) => {
              return <ExpandableMultiple type={column} data={row} />;
            }}
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
        users={users}
        keywordsSelected={keywordsSelected}
        timeBeforeSelected={timeBeforeSelected}
        externalSelected={externalSelected}
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
