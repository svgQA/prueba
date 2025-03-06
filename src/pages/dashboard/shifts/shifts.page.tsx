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
  ViewMode,
} from '@/components/compose/gantt/types/public-types';
import dayjs from 'dayjs';
import { ViewSwitcher } from './components/swicher.gantt';
import { Gantt } from '@/components/compose/gantt';
import { Input } from '@/components/common/input/input';
// import { BarTask } from '@/components/compose/gantt/types/bar-task';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

interface ISingleTaskCalendar {
  title: string;
  start: Date;
  end: Date; // Added end date
  id?: string;
  allDay?: boolean; // Added allDay flag
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showModal = useSignal<boolean>(false);
  const shifts = useSignal<IShiftResponse[]>([]);
  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);
  const [calendarView /*setCalendarView*/] = useState<string>('timeGridWeek');
  const selectedTask = useSignal<Task | null>(null);
  const selectedTaskCalendar = useSignal<ISingleTaskCalendar | null>(null);
  const startDate = dayjs().subtract(1, 'day').toDate();
  const endDate = dayjs(startDate).add(1, 'week').toDate();
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  });
  const [localEvents, setLocalEvents] = useState<ISingleTaskCalendar[]>([]);

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
          onClick={() => handleViewChange(VIEW_NAME.CALENDAR)}
        >
          <span className='vox-icon vx-icon-025'></span>
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

  function renderEventContent(eventInfo: any) {
    return (
      <div className='w-full h-full bg-primary flex justify-center items-center'>
        <div className='flex items-center gap-2'>
          <span className='vox-icon vx-icon-025 text-primary'></span>
          <div>
            <p className='font-bold text-sm'>{eventInfo.event.title}</p>
            <p className='text-xs text-gray-600'>{eventInfo.timeText}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDateClick = useCallback(() => {
    showModal.value = true;
  }, []);

  const handleEventDrop = useCallback(
    (info: any) => {
      const { event } = info;
      const updatedEvents = localEvents.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            start: event.start,
            end: event.end || event.start,
          };
        }
        return e;
      });
      setLocalEvents(updatedEvents);
    },
    [localEvents]
  );

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

      {currentView.value === VIEW_NAME.CALENDAR && (
        <div className='w-full mt-3'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth',
            }}
            weekends={false}
            events={localEvents}
            eventContent={renderEventContent}
            dateClick={handleDateClick}
            height={600}
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            slotMinTime='06:00:00'
            slotMaxTime='22:00:00'
            displayEventEnd={true}
            forceEventDuration={true}
            defaultTimedEventDuration='01:00:00'
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
          <div className='bg-white rounded-lg shadow-lg w-2/3 max-w-4xl'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium'>Editar Tarea</h3>
            </div>
            <div className='px-6 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Nombre'
                  name='title'
                  value={selectedTask.value?.name}
                  onChange={handleInputChange}
                  icon='123'
                  borderless
                  thin
                />

                <Input
                  label='Fecha Inicio'
                  name='start'
                  type='datetime-local'
                  value={selectedTask.value?.start}
                  onChange={handleInputChange}
                  icon='025'
                  borderless
                  thin
                />

                <Input
                  label='Fecha Fin'
                  name='end'
                  type='datetime-local'
                  value={selectedTask.value?.end}
                  onChange={handleInputChange}
                  icon='025'
                  borderless
                  thin
                />

                <Input
                  label='Progreso'
                  name='progress'
                  type='number'
                  value={selectedTask.value?.progress}
                  onChange={handleInputChange}
                  min='0'
                  max='100'
                  icon='234'
                  borderless
                  thin
                />
              </div>
            </div>
            <div className='px-6 py-4 border-t border-gray-200 flex justify-end gap-2'>
              <button
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
                onClick={() => (showModal.value = false)}
              >
                Cancelar
              </button>
              <button
                className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark'
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};
