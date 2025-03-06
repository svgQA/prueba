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
  const startDate = dayjs().subtract(1, 'day').toDate();
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
    (_: Task) => {
      // if (selectedTask.value) {
      //   selectedTask.value = { ...selectedTask.value, ...task };
      // }
    },
    [shifts]
  );

  const handleDblClick = useCallback((_: Task) => {
    // selectedTask.value = task;
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
          {/*
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
          */}
        </div>
      )}

      {currentView.value === VIEW_NAME.SCHEDULER && (
        <div className='max-h-screen'>
          <ViewSwitcher
            onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
          />
          <Gantt
            tasks={ganttShifts}
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
          {/*
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
                  */}
        </div>
      )}
    </Section>
  );
};
