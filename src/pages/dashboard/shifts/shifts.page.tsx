import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
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

import { FormData } from './interface';
import { TaskForm } from './components/updaser.modal';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showModal = useSignal<boolean>(false);
  const shifts = useSignal<IShiftResponse[]>([]);
  const id = useSignal();
  const initialValues: Signal<Partial<FormData>> = useSignal({});

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.HalfDay);
  const selectedTask = useSignal<Task | null>(null);
  const startDate = dayjs().subtract(4, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const userSelected = useSignal<User | undefined>(undefined);
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });

  const getShiftHandler = async () => {
    const response = await ShiftService.get_all();
    if (!response.getStatus()) return;
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
    setGanttShifts((prev) => ({
      ...prev,
      users: response.getMany(),
    }));
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
      <div className='flex flex-row gap-2 justify-start px-0.5 bg-b-light-dark dark:bg-b-dark-light rounded-md'>
        <button
          className='p-1 hover:bg-slate-100 rounded-lg'
          onClick={() => handleViewChange(VIEW_NAME.TABLE)}
        >
          <span className='vox-icon vx-icon-011'></span>
        </button>
        <button
          className='p-1 hover:bg-slate-100 rounded-lg'
          onClick={() => handleViewChange(VIEW_NAME.SCHEDULER)}
        >
          <span className='vox-icon vx-icon-094'></span>
        </button>
      </div>
    ),
    []
  );

  const handleTaskChange = useCallback(
    (task: Task) => {
      if (selectedTask.value) {
        selectedTask.value = { ...selectedTask.value, ...task };
      }
    },
    [shifts]
  );

  const handleDblClick = useCallback((task: Task) => {
    selectedTask.value = task;
    showModal.value = true;
  }, []);

  const handleClick = useCallback((task: Task) => {
    selectedTask.value = task;
    // showModal.value = true;
  }, []);

  const handleCreacteNewShift = () => {
    showModal.value = true;
  };

  const handleUserClick = (id: string | number) => {
    userSelected.value = ganttShifts.users.find((user) => user.id === id);
    showModal.value = true;
  };

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm('Are you sure about ' + task.name + ' ?');
  }, []);

  const handlOnCloseModal = () => {
    userSelected.value = undefined;
    showModal.value = !showModal.value;
  };
  return (
    <Section>
      {buttonMenu}
      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IShiftResponse>
          data={shifts.value}
          columns={columns}
          pageSize={20}
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
        <div className='max-h-screen'>
          <div className='py-2 flex flex-row justify-between px-1'>
            <button
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={handleCreacteNewShift}
            >
              Create
            </button>
            <ViewSwitcher
              onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
            />
          </div>
          <Gantt
            tasks={ganttShifts}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onDoubleClick={handleDblClick}
            onUserClick={handleUserClick}
            onClick={handleClick}
            // onSelect={handleSelect}
            // onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? '155px' : ''}
            columnWidth={columnWidth}
          />
        </div>
      )}
      <TaskForm
        id={id}
        initialValues={initialValues}
        closed={showModal.value}
        onClose={handlOnCloseModal}
        posSave={getGanttHandler}
        userSelected={userSelected.value}
      />
    </Section>
  );
};
