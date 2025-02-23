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
import { Gantt, Task, ViewMode } from '@/components/compose/gantt';
// import { Gantt, Task, ViewMode } from 'gantt-task-react';
import '@/components/compose/gantt/index.css';
import { ViewSwitcher } from './components/swicher.gantt';
import { getStartEndDateForProject, initTasks } from './utils/gantt.data';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const reports = useSignal<IReportResponse[]>([]);
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE);

  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300;
    if (view === ViewMode.Week) return 250;
    return 60;
  }, [view]);

  const handleTaskChange = useCallback(
    (task: any) => {
      console.log('On date change Id:' + task.id);
      let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
      if (task.project) {
        const [start, end] = getStartEndDateForProject(newTasks, task.project);
        const project =
          newTasks[newTasks.findIndex((t) => t.id === task.project)];
        if (
          project.start.getTime() !== start.getTime() ||
          project.end.getTime() !== end.getTime()
        ) {
          const changedProject = { ...project, start, end };
          newTasks = newTasks.map((t) =>
            t.id === task.project ? changedProject : t
          );
        }
      }
      setTasks(newTasks);
    },
    [tasks]
  );

  const handleTaskDelete = useCallback((task: any) => {
    const conf = window.confirm('Are you sure about ' + task.name + ' ?');
    if (conf) {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    }
    return conf;
  }, []);

  const handleProgressChange = useCallback(async (task: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? task : t))
    );
    console.log('On progress change Id:' + task.id);
  }, []);

  const handleDblClick = useCallback((task: any) => {
    alert('On Double Click event Id:' + task.id);
  }, []);

  const handleSelect = useCallback((task: any, isSelected: any) => {
    console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'));
  }, []);

  const handleExpanderClick = useCallback((task: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? task : t))
    );
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

      <div className='flex flex-row gap-2'>
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

      {currentView.value === VIEW_NAME.CALENDAR && <div>Calendar View</div>}

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
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? '155px' : ''}
            columnWidth={columnWidth}
          />
        </div>
      )}
    </Section>
  );
};
