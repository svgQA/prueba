import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ShiftService } from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { columns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';

import {
  GeneralTask,
  Task,
  User,
  ViewMode,
} from '@/components/compose/gantt/types/public-types';
import dayjs from 'dayjs';
import { ViewSwitcher } from './components/swicher.gantt';
import { Gantt } from '@/components/compose/gantt';
import { TaskForm } from './components/updaser.modal';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { SendForm } from './components/send.modal';
import { ExpandableMultiple } from './components/expandable.multiple';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
  SUPERVISOR,
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showUpsertModal = useSignal<boolean>(false);
  const showSendModal = useSignal<boolean>(false);
  const shifts = useSignal<IShiftResponse[]>([]);
  const defaultColumn = useSignal<string>('default');

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();

  const startDate = dayjs().subtract(4, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });

  const toggleSendModal = () => {
    showSendModal.value = !showSendModal.value;
  };

  const toggleUpsertModal = () => {
    showUpsertModal.value = !showUpsertModal.value;
  };

  const getShiftHandler = async () => {
    const response = await ShiftService.get_all({ page: 1, items: 1000 });
    if (!response.getStatus()) return;
    console.log('response.getMany()', response.getMany());
    shifts.value = response.getMany();
  };

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300;
    if (view === ViewMode.Week) return 250;
    return 60;
  }, [view]);

  const getGanttHandler = async () => {
    const response = await ShiftService.get_gantt({
      page: 1,
      items: 100,
      start: startDate.toISOString(),
    });
    if (!response.getStatus()) return;
    setGanttShifts((prev) => ({ ...prev, users: response.getMany() }));
  };

  useEffect(() => {
    document.title = 'VX - Shift Service';
    getShiftHandler();
  }, []);

  useEffect(() => {
    if (currentView.value === VIEW_NAME.SCHEDULER) {
      getGanttHandler();
    }
  }, [currentView.value]);

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

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
              ? 'bg-primary-opacity border-2 border-primary p-2 t-primary'
              : 'border-2 border-primary p-2'
          }
          icon='320'
          // iconHexColor={currentView.value === VIEW_NAME.TABLE ? '#00BDD6' : ''}
        />
        <Button
          name='button-change-scheduler'
          onClick={() => {
            handleViewChange(VIEW_NAME.SCHEDULER);
          }}
          rounded={false}
          className={
            currentView.value === VIEW_NAME.SCHEDULER
              ? 'bg-primary-opacity border-2 border-primary p-2'
              : 'border-2 border-primary p-2'
          }
          icon='330'
          // iconHexColor={
          //   currentView.value === VIEW_NAME.SCHEDULER ? '#00BDD6' : ''
          // }
        />
        <Button
          name='button-action'
          rounded={false}
          className='border-2 border-primary p-2'
          icon='314'
          onClick={toggleSendModal}
        />
        <Button
          name='button-supervision'
          label='Supervisión Remota'
          className='bg-primary text-white py-1 rounded px-4'
          onClick={() => {
            handleViewChange(VIEW_NAME.SUPERVISOR);
          }}
        />
      </div>
    ),
    [currentView.value]
  );

  const handleTaskChange = useCallback(
    (_: Task) => {
      if (taskSelected) {
      }
    },
    [shifts]
  );

  const handleDblClick = useCallback((task: Task) => {
    setTaskSelected(() => task);
    showUpsertModal.value = true;
  }, []);

  const handleClick = useCallback((/* task: Task */) => {}, []);

  const handleCreacteNewShift = () => {
    cleanSelectedData();
    toggleUpsertModal();
  };

  const handleUserClick = useCallback(
    (id: string | number) => {
      const selectedUser = ganttShifts.users.find((user) => user.id === id);
      if (selectedUser) {
        setUserSelected(selectedUser);
        showUpsertModal.value = true;
      }
    },
    [ganttShifts.users]
  );

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm('Are you sure about ' + task.name + ' ?');
  }, []);

  const handleCloseUpsertModal = useCallback(() => {
    cleanSelectedData();
    toggleUpsertModal();
  }, []);

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined);
    setTaskSelected(undefined);
  }, []);

  const handleCloseSendModal = useCallback(() => {
    showSendModal.value = false;
  }, []);

  const handleSend = useCallback(async (data: any) => {
    try {
      console.log('Sending data:', data);
      showSendModal.value = false;
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }, []);

  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Turnos Totales Hoy'
          count={530}
          subtitle=''
          color='t-dark'
          icon='054'
        />

        <CardData
          title='Turnos En Curso'
          count='50%'
          subtitle=''
          color='t-dark'
          icon='052'
        />

        <CardData
          title='Turnos Finalizados'
          count='30%'
          subtitle=''
          color='t-dark'
          icon='015'
        />
      </div>

      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-between px-1 items-center overflow-visible xl:absolute relative z-10'>
          <div className='flex flex-row items-center justify-between'>
            {buttonMenu}
            <Button
              name='button-create-shift'
              label='Create'
              className='mx-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
              duration: false,
              userEmail: false,
              userPhone: false,
              serviceRound: false,
            }}
          />
        )}

        {currentView.value === VIEW_NAME.SCHEDULER && (
          <div>
            <ViewSwitcher
              onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
              status={view}
            />
            <Gantt
              tasks={ganttShifts}
              viewMode={view}
              onDateChange={handleTaskChange}
              onDelete={handleTaskDelete}
              onDoubleClick={handleDblClick}
              onUserClick={handleUserClick}
              onClick={handleClick}
              listCellWidth={isChecked ? '155px' : ''}
              columnWidth={columnWidth}
            />
          </div>
        )}

        {currentView.value === VIEW_NAME.SUPERVISOR && <div></div>}
      </div>
      <TaskForm
        closed={showUpsertModal.value}
        onClose={handleCloseUpsertModal}
        posSave={getGanttHandler}
        userSelected={userSelected}
        taskSelected={taskSelected}
      />

      <SendForm
        closed={showSendModal.value}
        onClose={handleCloseSendModal}
        onSend={handleSend}
      />
    </Section>
  );
};
