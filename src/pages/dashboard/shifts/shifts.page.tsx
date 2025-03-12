import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ShiftService } from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { columns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';
import { toast } from 'react-toastify';

import {
  GeneralTask,
  Task,
  ViewMode,
} from '@/components/compose/gantt/types/public-types';
import dayjs from 'dayjs';
import { ViewSwitcher } from './components/swicher.gantt';
import { Gantt } from '@/components/compose/gantt';

import { USER_TYPE, UserService } from '@/services/user';
import { TaskForm } from './components/modal.upsert';
import { FormData } from './interface';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showModal = useSignal<boolean>(false);
  const shifts = useSignal<IShiftResponse[]>([]);
  const services = useSignal([]);
  const users = useSignal([]);
  const id = useSignal();
  const initialValues: Signal<Partial<FormData>> = useSignal({});

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  // const [calendarView /*setCalendarView*/] = useState<string>('timeGridWeek');
  const selectedTask = useSignal<Task | null>(null);
  // const selectedTaskCalendar = useSignal<ISingleTaskCalendar | null>(null);
  const startDate = dayjs().subtract(1, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });
  const inputKeywords = useSignal('');
  // const [localEvents, setLocalEvents] = useState<ISingleTaskCalendar[]>([]);

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
    const response = await ShiftService.get_gantt();
    if (!response.getStatus()) return;

    setGanttShifts((prev) => ({
      ...prev,
      users: response.getMany(),
    }));
  };
  const getServices = async () => {
    const request: any = await ShiftService.getServices();
    services.value = request.data;
  };

  const getUsers = async () => {
    const request: any = await UserService.get_all({
      items: 100,
      page: 1,
      userType: USER_TYPE.USER,
    });
    // Monster, en vez de hacer esto como un filter aqui, lo haces en las columnas
    // o en la presentaciòn del expandes, porque te evita hacer un ciclo innecesario.
    users.value = request.data.map((user: any) => {
      return { ...user, fullname: `${user.name} ${user.surname}` };
    });
  };

  const main = async () => {
    await getServices();
    await getUsers();
  };
  const onSubmit = async (model: FormData) => {
    const { start, end } = model;
    let request;
    let message: string;

    if (start) model.start = dayjs(start).toISOString();
    if (end) model.end = dayjs(end).toISOString();

    if (!id.value) {
      request = await ShiftService.createActivity(model);
      message = 'Turno creado exitosamente!';
    } else {
      request = await ShiftService.updateActivity(model, id.value);
      message = 'Turno editado exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    showModal.value = false;
    getGanttHandler();
  };

  useEffect(() => {
    document.title = 'VX - Shift Service';
    getShiftHandler();
    main();
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

  const handleSelect = useCallback((task: Task, isSelected: any) => {
    console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'));
  }, []);

  const handleExpanderClick = useCallback((task: Task) => {
    console.log('On expander click Id:' + task.id);
  }, []);

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm('Are you sure about ' + task.name + ' ?');
  }, []);

  const handleCreacteNewShift = () => {
    showModal.value = true;
  };

  const handleUserClick = (id: string | number) => {
    console.log('SELECCIONADO: ', id);
  };

  return (
    <Section>
      {buttonMenu}
      {currentView.value === VIEW_NAME.TABLE && (
        <div>
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
        </div>
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
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? '155px' : ''}
            columnWidth={columnWidth}
          />
        </div>
      )}

      {showModal.value && (
        <TaskForm
          id={id}
          showModal={() => (showModal.value = false)}
          onSubmit={onSubmit}
          users={users}
          services={services}
          inputKeywords={inputKeywords}
          initialValues={initialValues}
        />
      )}
    </Section>
  );
};
