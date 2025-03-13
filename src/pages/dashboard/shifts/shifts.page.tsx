import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ShiftService } from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { columns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';
import { toast } from 'react-toastify';
import { CardData } from '@/components/compose/cards';

// import { omitBy, isNull, pick } from 'lodash';

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

import { Form, Field } from 'react-final-form';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { UserService } from '@/services/user';
import { Button } from '@/components/common/button/button';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

interface FormData {
  start: string;
  end: string;
  status: string;
  type: string;
  userId: string;
  projectId: number;
  placeId: number;
  workstationId: number;
  roundId: number;
  externalId: string;
  keywords: string[];
  tasks: ITask[];
}

interface ITask {
  start: string;
  status: string;
  description: string;
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
  const services = useSignal([]);
  const users = useSignal([]);
  const id = useSignal();
  const initialValues: Signal<Partial<FormData>> = useSignal({});

  const [isChecked, setIsChecked] = useState(true);
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay);
  const [calendarView /*setCalendarView*/] = useState<string>('timeGridWeek');
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
  const getServices = async () => {
    const request: any = await ShiftService.getServices();
    services.value = request.data;
  };

  const getUsers = async () => {
    const request: any = await UserService.get_all();
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
  };

  /*
  const setInitialValues = async () => {
    if (!id.value) return;

    const userKeys = [
      'start',
      'end',
      'status',
      'type',
      'userId',
      'serviceId',
      'employeedId',
      'externalId',
      'keywords',
    ] as const;

    const request: any = await ShiftService.getActivityById(id.value);
    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };
  */

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
          <span className='vox-icon vx-icon-109'></span>
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

      {buttonMenu}
      {currentView.value === VIEW_NAME.TABLE && (
        <div>
          <Table<IShiftResponse>
            data={shifts.value}
            columns={columns}
            pageSize={8}
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
              <h3 className='text-lg font-medium'>
                {id.value ? 'Editar Tarea' : 'Guardar Tarea'}
              </h3>
              <Form
                onSubmit={onSubmit}
                initialValues={initialValues.value}
                mutators={{
                  ...arrayMutators,
                }}
                render={({ handleSubmit, submitting, values }) => (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/** FORMULARIO PRINCIPAL */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div class='col-span-1'>
                        <Field<string>
                          name='start'
                          validate={required}
                          parse={(value) =>
                            value ? dayjs(value).toISOString() : ''
                          }
                          format={(value) =>
                            value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                          }
                        >
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              type='datetime-local'
                              label='Fecha inicio'
                              meta={meta}
                            />
                          )}
                        </Field>
                      </div>
                      <div class='col-span-1'>
                        <Field<string>
                          name='end'
                          validate={required}
                          parse={(value) =>
                            value ? dayjs(value).toISOString() : ''
                          }
                          format={(value) =>
                            value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                          }
                        >
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              type='datetime-local'
                              label='Fecha fin'
                              meta={meta}
                            />
                          )}
                        </Field>
                      </div>

                      <div class='col-span-1'>
                        <Field<string> name='status'>
                          {({ input }) => (
                            <Select
                              {...input}
                              placeholder='Selecione estado...'
                              label='Estado'
                              name='status'
                              icon='252'
                              options={[
                                { value: 'CREATED', label: 'Creado' },
                                { value: 'OPENED', label: 'Abierto' },
                                { value: 'CLOSED', label: 'Cerrado' },
                                { value: 'RESOLVED', label: 'Resuelto' },
                              ]}
                            />
                          )}
                        </Field>
                      </div>
                      <div class='col-span-1'>
                        <Field<string> name='type'>
                          {({ input }) => (
                            <Select
                              {...input}
                              placeholder='Selecione tipo...'
                              label='Tipo'
                              name='type'
                              icon='252'
                              options={[
                                { value: 'EXTERNAL', label: 'Externo' },
                                { value: 'INTERNAL', label: 'Interno' },
                              ]}
                            />
                          )}
                        </Field>
                      </div>
                      <div class='col-span-1'>
                        <Field<string> name='employeedId'>
                          {({ input }) => (
                            <Select
                              {...input}
                              placeholder='Selecione empleado...'
                              label='Empleado'
                              name='employeedId'
                              icon='252'
                              options={users.value}
                              optionValue='id'
                              optionLabel='fullname'
                              onChange={(e) => {
                                const id = parseInt(e.currentTarget.value);
                                input.onChange(id);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <div class='col-span-1'>
                        <Field name='serviceId'>
                          {({ input }) => (
                            <Select
                              {...input}
                              placeholder='Selecione Servicio...'
                              label='Servicio'
                              name='serviceId'
                              icon='252'
                              optionValue='id'
                              optionLabel='description'
                              options={services.value}
                              onChange={(e) => {
                                const id = parseInt(e.currentTarget.value);
                                input.onChange(id);
                              }}
                            />
                          )}
                        </Field>
                      </div>

                      <div class='col-span-1'>
                        <Field<string> name='externalId'>
                          {({ input }) => (
                            <Input
                              {...input}
                              type='text'
                              label='Codigo externo'
                            />
                          )}
                        </Field>
                      </div>
                      <div class='col-span-1 mt-4'>
                        <FieldArray<string> name='keywords'>
                          {({ fields }) => (
                            <div className='flex flex-col gap-2'>
                              <div className='flex items-center border p-2 rounded-md'>
                                <input
                                  value={inputKeywords.value}
                                  type='keywords'
                                  onChange={(e) =>
                                  (inputKeywords.value =
                                    e.currentTarget.value)
                                  }
                                  placeholder='Escribe una palabra clave'
                                  className='flex-grow p-2 border rounded-md'
                                />
                                <button
                                  type='button'
                                  className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md'
                                  onClick={() => {
                                    fields.push(inputKeywords.value);
                                    inputKeywords.value = '';
                                  }}
                                >
                                  Agregar
                                </button>
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {values.keywords?.map(
                                  (keyword: string, index: number) => (
                                    <span
                                      key={index}
                                      className='px-3 py-1 bg-gray-200 rounded-md flex items-center'
                                    >
                                      {keyword}
                                      <button
                                        type='button'
                                        className='ml-2 text-red-500'
                                        onClick={() => {
                                          fields.remove(index);
                                        }}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>

                    {/* Botonera */}
                    <div className='flex dark:bg-b-dark-light justify-end gap-2 p-4 bg-gray-50'>
                      <Button
                        id='btn-close'
                        name='btn-close'
                        type='button'
                        label='Cancelar'
                        onClick={() => (showModal.value = false)}
                      />

                      <Button
                        id='btn-save'
                        name='btn-save'
                        type='submit'
                        label={id.value ? 'Editar' : 'Guardar'}
                        className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
                        disabled={submitting}
                      />
                    </div>
                  </form>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};
