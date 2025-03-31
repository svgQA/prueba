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
import { Gantt } from '@/components/compose/gantt';
import { TaskForm } from './components/upsert.modal';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';
import { SendForm } from './components/send.modal';
import { ExpandableMultiple } from './components/expandable.multiple';
import { ShiftForm } from './components/shift.modal';
import { Group } from '@/components/compose/gantt/components/gantt/group';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
  SUPERVISOR,
}

export const ShiftsPage: FunctionalComponent = () => {
  const showUpsertModal = useSignal<boolean>(false);
  const showSendModal = useSignal<boolean>(false);
  const showShiftModal = useSignal<boolean>(false);

  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const shifts = useSignal<IShiftResponse[]>([]);
  const defaultColumn = useSignal<string>('default');

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);

  const [taskSelected, setTaskSelected] = useState<Task>();
  const [userSelected, setUserSelected] = useState<User>();

  const startDate = dayjs().subtract(1, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });

  /**
   * Handle Database query for shifts.
   */
  const getShiftHandler = async () => {
    const response = await ShiftService.get_all({ page: 1, items: 1000 });
    if (!response.getStatus()) return;
    shifts.value = response.getMany();
  };

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

  /**
   * Handle the useEffect hook for the document title and shift retrieval.
   */
  useEffect(() => {
    document.title = 'VX - Shift Service';
    getShiftHandler();
  }, []);

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

  /**
   * Eventos de toggle para los modales
   */
  const toggleSendModal = () => {
    showSendModal.value = !showSendModal.value;
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
    toggleSendModal();
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

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined);
    setTaskSelected(undefined);
  }, []);

  const handleSend = useCallback(async (data: any) => {
    try {
      console.log('Sending data:', data);
      showSendModal.value = false;
    } catch (error) {
      console.error('Error sending data:', error);
    }
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

  return (
    <Section padding>
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
          <Gantt
            tasks={ganttShifts}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onDoubleClick={handleDblClick}
            onUserDoubleClick={handleUserClick}
            onUserClick={handleUserClick}
            onClick={handleClick}
            listCellWidth={isChecked ? '155px' : ''}
            columnWidth={columnWidth}
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

        {currentView.value === VIEW_NAME.SUPERVISOR && <div></div>}
      </div>
      <TaskForm
        closed={showUpsertModal.value}
        onClose={handleCloseUpsertModal}
        posSave={handleViewMode}
        userSelected={userSelected}
        taskSelected={taskSelected}
      />

      <SendForm
        closed={showSendModal.value}
        onClose={handleCloseSendModal}
        onSend={handleSend}
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
