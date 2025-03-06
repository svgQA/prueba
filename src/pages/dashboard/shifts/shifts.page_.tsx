import { FunctionalComponent } from 'preact';
import { useEffect, useState, useMemo, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IReportResponse } from '@/types/form';
import { FormService } from '@/services';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { ExpandableShift } from '@/components/compose/table';
import { Shift } from './utils/shifts';
import { shiftsData } from './utils/shifts.data';
import { columns } from './components/shift.columns';
import { Gantt, ViewMode } from '@/components/compose/gantt';
import '@/components/compose/gantt/index.css';
import { ViewSwitcher } from './components/swicher.gantt';
import { groupByPerson } from './utils/gantt.shift';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Input } from '@/components/common/input/input';
import {
  GeneralTask,
  Task,
} from '@/components/compose/gantt/types/public-types';

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
  const reports = useSignal<IReportResponse[]>([]);
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);
  const showModal = useSignal<boolean>(false);
  const selectedTask = useSignal<Task | null>(null);
  const selectedTaskCalendar = useSignal<ISingleTaskCalendar | null>(null);
  const [localEvents, setLocalEvents] = useState<ISingleTaskCalendar[]>([]);

  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks /*setTasks*/] = useState<GeneralTask>(groupByPerson());
  const [isChecked, setIsChecked] = useState(true);
  const [calendarView /*setCalendarView*/] = useState<string>('timeGridWeek');

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300;
    if (view === ViewMode.Week) return 250;
    return 60;
  }, [view]);

  const handleTaskChange = useCallback(
    (task: Task) => {
      if (selectedTask.value) {
        selectedTask.value = { ...selectedTask.value, ...task };
      }
    },
    [tasks]
  );

  const handleTaskDelete = useCallback((task: any) => {
    window.confirm('Are you sure about ' + task.name + ' ?');
  }, []);

  const handleDblClick = useCallback((task: any) => {
    selectedTask.value = task;
    showModal.value = true;
  }, []);

  const handleSelect = useCallback((task: any, isSelected: any) => {
    console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'));
  }, []);

  const handleExpanderClick = useCallback((task: any) => {
    console.log('On expander click Id:' + task.id);
  }, []);

  const getReportHandler = useCallback(async () => {
    const response = await FormService.get_report_all();
    if (!response.getStatus()) return;
    reports.value = response.getMany();
  }, []);

  useEffect(() => {
    document.title = 'VX - Shifts Service';
    getReportHandler();
  }, [getReportHandler]);

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view;
  }, []);

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

  const cardDataMemo = useMemo(
    () => (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total de Turnos'
          count={400}
          subtitle='Turnos registrados'
          color='text-secondary'
          icon='171'
        />
        <CardData
          title='Turnos Activos'
          count={300}
          subtitle='En este momento'
          color='text-primary'
          icon='020'
        />
        <CardData
          title='Turnos Inactivos'
          count={200}
          subtitle='Fuera de servicio'
          color='text-error'
          icon='110'
        />
      </div>
    ),
    []
  );

  return (
    <Section>
      {cardDataMemo}

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

      {currentView.value === VIEW_NAME.TABLE && (
        <Table<Shift>
          data={shiftsData}
          columns={columns}
          expandable={(row: Shift) => <ExpandableShift row={row} />}
          pageSize={20}
          visibility={{
            address: false,
            city: false,
            employeeId: false,
            duration: false,
          }}
        />
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
        <div>
          <ViewSwitcher
            onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
          />
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onDoubleClick={handleDblClick}
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
                  value={selectedTask.value?.start.toISOString().slice(0, 16)}
                  onChange={handleInputChange}
                  icon='025'
                  borderless
                  thin
                />

                <Input
                  label='Fecha Fin'
                  name='end'
                  type='datetime-local'
                  value={selectedTask.value?.end.toISOString().slice(0, 16)}
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
