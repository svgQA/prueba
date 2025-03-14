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

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showModal = useSignal<boolean>(false);
  const shifts = useSignal<IShiftResponse[]>([]);

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

  const wrapperStyle = {
    display: 'inline-block',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    border: 'none',
    overflow: 'hidden',
  };

  const innerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
  };

  const buttonMenu = useMemo(
    () => (
      <div className='flex flex-row gap-4 justify-start'>
        <div style={wrapperStyle}>
          <button
            className='focus:outline-none'
            onClick={() => handleViewChange(VIEW_NAME.TABLE)}
            style={innerStyle}
          >
            <div
              style={{
                position: 'relative',
                width: '24px',
                height: '24px',
                overflow: 'hidden',
              }}
            >
              <span
                className='vox-icon vx-icon-109'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              ></span>
            </div>
          </button>
        </div>

        <div style={wrapperStyle}>
          <button
            className='focus:outline-none'
            onClick={() => handleViewChange(VIEW_NAME.SCHEDULER)}
            style={innerStyle}
          >
            <div
              style={{
                position: 'relative',
                width: '24px',
                height: '24px',
                overflow: 'hidden',
              }}
            >
              <span
                className='vox-icon vx-icon-094'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              ></span>
            </div>
          </button>
        </div>
      </div>
    ),
    []
  );

  const handleTaskChange = useCallback(
    (_: Task) => {
      if (taskSelected) {
        // setTaskSelected(() => ({ ...taskSelected, ...task }));
      }
    },
    [shifts]
  );

  const handleDblClick = useCallback((task: Task) => {
    // console.log('TASK SELECTED:', task);
    setTaskSelected(() => task);
    showModal.value = true;
  }, []);

  const handleClick = useCallback(
    (/* task: Task */) => {
      // taskSelected.value = task;
      // showModal.value = true;
    },
    []
  );

  const handleCreacteNewShift = () => {
    cleanSelectedData();
    toggleModal();
  };

  const toggleModal = () => {
    showModal.value = !showModal.value;
  };

  const handleUserClick = useCallback(
    (id: string | number) => {
      const selectedUser = ganttShifts.users.find((user) => user.id === id);
      if (selectedUser) {
        setUserSelected(selectedUser);
        showModal.value = true;
      }
    },
    [ganttShifts.users]
  );

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm('Are you sure about ' + task.name + ' ?');
  }, []);

  const handlOnCloseModal = useCallback(() => {
    cleanSelectedData();
    toggleModal();
  }, []);

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined);
    setTaskSelected(undefined);
  }, []);
  /*
  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.currentTarget;
    if (selectedTaskCalendar.value) {
      selectedTaskCalendar.value = {
        ...selectedTaskCalendar.value,
        title: name === 'title' ? value : selectedTaskCalendar.value.title,
        start:
          name === 'start' ? new Date(value) : selectedTaskCalendar.value.start,
        end:
          name === 'end'
            ? new Date(value)
            : selectedTaskCalendar.value.end ||
              selectedTaskCalendar.value.start,
      };
    } else {
      const start = new Date(value);
      selectedTaskCalendar.value = {
        title: name === 'title' ? value : '',
        start: name === 'start' ? start : new Date(),
        end: name === 'end' ? new Date(value) : start,
        allDay: false,
      };
    }
  }, []);
  */
  /*
  const handleSave = () => {
    if (selectedTaskCalendar.value) {
      setLocalEvents([
        ...localEvents,
        {
          id: Math.random().toString(),
          title: selectedTaskCalendar.value.title,
          start: selectedTaskCalendar.value.start,
          end:
            selectedTaskCalendar.value.end || selectedTaskCalendar.value.start,
          allDay: selectedTaskCalendar.value.allDay || false,
        },
      ]);
    }
    showModal.value = false;
  };
  */

  /*
  function renderEventContent(eventInfo: any) {
    return (
      <div className="w-full h-full bg-primary flex justify-center items-center">
        <div className="flex items-center gap-2">
          <span className="vox-icon vx-icon-025 text-primary"></span>
          <div>
            <p className="font-bold text-sm">{eventInfo.event.title}</p>
            <p className="text-xs text-gray-600">{eventInfo.timeText}</p>
          </div>
        </div>
      </div>
    )
  }

  const handleDateClick = useCallback(() => {
    showModal.value = true
  }, [])

  */
  /*
  const handleEventDrop = useCallback(
    (info: any) => {
      const { event } = info
      const updatedEvents = localEvents.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            start: event.start,
            end: event.end || event.start,
          }
        }
        return e
      })
      setLocalEvents(updatedEvents)
    },
    [localEvents]
  );
  */

  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Turnos Totales Hoy'
          count={530}
          subtitle=''
          color='text-secondary'
          icon='054'
        />

        <CardData
          title='Turnos En Curso'
          count='50%'
          subtitle=''
          color='text-primary'
          icon='052'
        />

        <CardData
          title='Turnos Finalizados'
          count='30%'
          subtitle=''
          color='text-error'
          icon='015'
        />
      </div>

      {(currentView.value === VIEW_NAME.CALENDAR ||
        currentView.value === VIEW_NAME.SCHEDULER ||
        showModal.value) && (
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>{buttonMenu}</div>
        </div>
      )}

      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IShiftResponse>
          data={shifts.value}
          columns={columns}
          pageSize={20}
          button={buttonMenu}
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
            listCellWidth={isChecked ? '155px' : ''}
            columnWidth={columnWidth}
          />
        </div>
      )}

      <TaskForm
        // initialValues={initialValues}
        closed={showModal.value}
        onClose={handlOnCloseModal}
        posSave={getGanttHandler}
        userSelected={userSelected}
        taskSelected={taskSelected}
      />
    </Section>
  );
};
