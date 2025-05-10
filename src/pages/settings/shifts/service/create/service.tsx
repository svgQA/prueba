import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';

import { FunctionComponent } from 'preact';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect, useState } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { IProject } from '../../projects/projects';
import { Place } from '@/pages/settings/shifts/places/utils/places';
import { Round } from '@/pages/settings/shifts/rounds/utils/rounds';
import { TextArea } from '@/components/common/text.area/text.area';
import { ISchedule } from '../../schedule/schedule';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import dayjs from 'dayjs';
import { Input } from '@/components/common/input/input';
import { IFormResponse } from '@/types/form';
import {
  ContractService,
  FormService,
  PlaceService,
  RoundService,
  ScheduleService,
  ServiceService,
  TaskService,
} from '@/services';
import { ExpansionPanel } from '@/components/common/expansion-panels/expansion-panels';

interface FormData {
  name: string;
  description: string;
  hasRound: boolean;
  roundId: number;
  task: any;
}

export const ServiceCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const projects: Signal<IProject[]> = useSignal([]);
  const places: Signal<Place[]> = useSignal([]);
  const rounds: Signal<Round[]> = useSignal([]);
  const tasks = useSignal([]);
  const schedules: Signal<ISchedule[]> = useSignal([]);
  const [search, setSearch] = useState('');
  const { id } = useParams(); // Obtiene el id de la URL
  const date = dayjs().format('YYYY-MM-DD');
  const forms = useSignal<IFormResponse[]>([]);

  const onSubmit = async (model: FormData) => {
    model.task = setTasks(model.task);
    model.hasRound = !!model.roundId;

    let request;
    let message: string;

    if (id) {
      request = await ServiceService.updateService(model, id);
      message = 'servicio editado exitosamente!';
    } else {
      request = await ServiceService.createService(model);
      message = 'servicio creado exitosamente!';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/rounds/service/');
  };

  const setTasks = (_tasks: any) => {
    const data: any = [];

    const mappedTasks = _tasks?.map((task: any) => {
      const taskData = {
        start: '',
        status: '',
        description: '',
      };

      if (!task.create && task.taskId) {
        const matchingTask: any = tasks.value.find(
          (val: any) => val.id === task.taskId
        );
        taskData.start = matchingTask.start;
        taskData.status = matchingTask.status;
        taskData.description = matchingTask.description;
      } else {
        taskData.start = task.start;
        taskData.status = task.status;
        taskData.description = task.description;
      }

      return taskData;
    });

    data.push(...(mappedTasks || []));

    return data;
  };
  const filteredOptions: any = schedules.value.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProjects = async () => {
    const request: any = await ContractService.getProjects();
    projects.value = request.data;
  };

  const getPlaces = async () => {
    const request: any = await PlaceService.getPlaces();
    places.value = request.data;
  };

  const getRounds = async () => {
    const request: any = await RoundService.getRounds();
    rounds.value = request.data;
  };

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const getTaks = async () => {
    const request: any = await TaskService.getTasks();
    tasks.value = request.data;
  };

  const getSchedules = async () => {
    const request: any = await ScheduleService.getSchedules();
    schedules.value = request.data;
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = [
      'name',
      'contractId',
      'placeId',
      'roundId',
      'description',
      'priority',
      'schedules',
      'overtimes',
      'task',
    ] as const;

    const request: any = await ServiceService.getServiceById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);

    initialValues.value = model;
  };

  useEffect(() => {
    getTaks();
    getPlaces();
    getRounds();
    getProjects();
    getSchedules();
    getFormsHandler();
    setInitialValues();
  }, []);
  return (
    <Section>
      <Form
        mutators={{
          ...arrayMutators,
        }}
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-4 gap-2'>
              <div class='col-span-2'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='Ingrese nombre...'
                      label='name'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div class='col-span-2'>
                <Field<string> name='contractId' validate={required}>
                  {({ input, meta }) => (
                    <Select
                      {...input}
                      placeholder='Seleccione Contrato...'
                      label='Contrato'
                      id='contractId'
                      name='contractId'
                      icon='241'
                      optionValue='id'
                      optionLabel='name'
                      onChange={(e) => {
                        const id = parseInt(e.currentTarget.value);
                        input.onChange(id);
                      }}
                      options={projects.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <Field<string> name='placeId' validate={required}>
                  {({ input, meta }) => (
                    <Select
                      {...input}
                      placeholder='Seleccione lugar...'
                      label='Lugar'
                      id='placeId'
                      name='placeId'
                      icon='252'
                      optionValue='id'
                      optionLabel='name'
                      onChange={(e) => {
                        const id = parseInt(e.currentTarget.value);
                        input.onChange(id);
                      }}
                      options={places.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <Field<string> name='roundId'>
                  {({ input }) => (
                    <Select
                      {...input}
                      placeholder='Seleccione ronda...'
                      label='Ronda'
                      id='roundId'
                      name='roundId'
                      icon='252'
                      optionValue='id'
                      optionLabel='name'
                      onChange={(e) => {
                        const id = parseInt(e.currentTarget.value);
                        input.onChange(id);
                      }}
                      options={rounds.value}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-4'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='300'
                      placeholder='Ingrese Descripción...'
                      label='Descripción'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div class='col-span-4'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Horarios:
                </h3>

                <Field<number> name='schedules' validate={required}>
                  {({ input }) => (
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
                      <div className='flex items-center gap-4 mb-3'>
                        <div className='flex-1'>
                          <label className='text-sm font-medium text-gray-700'>
                            Buscar:
                          </label>
                          <input
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            className='mt-1 block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Escribe para buscar...'
                          />
                        </div>
                      </div>

                      <select
                        {...input}
                        multiple
                        onChange={(e) => {
                          const selectedValues = Array.from(
                            e.currentTarget.selectedOptions,
                            (option) => Number(option.value)
                          );
                          input.onChange(selectedValues);
                        }}
                        className='block w-full px-3 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-28'
                      >
                        {filteredOptions.map((option: any) => (
                          <option
                            key={option.id}
                            value={option.id}
                            className='py-1 px-2'
                          >
                            {`* Horario: ${option.name}  [ ${option.daysAllowed} ]`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <ExpansionPanel title='Turnos extra'>
                  <FieldArray name='overtimes'>
                    {({ fields }) => (
                      <div>
                        <div className='flex items-center justify-between mb-4'>
                          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Añadir turnos extra
                          </h3>
                          <Button
                            icon='044'
                            rounded
                            id='menu-btn'
                            name='menu'
                            type='button'
                            color='text-primary'
                            onClick={() => fields.push({})}
                          />
                        </div>

                        <div className='space-y-4'>
                          {fields.map((name, index) => (
                            <div
                              key={index}
                              className='bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden'
                            >
                              <div className='bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600'>
                                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                                  Turno extra #{index + 1}
                                </h2>
                              </div>

                              <div className='p-4'>
                                <div className='grid grid-cols-3 gap-4'>
                                  <div>
                                    <Field<string>
                                      name={`${name}.start`}
                                      validate={required}
                                      parse={(value) =>
                                        value ? dayjs(value).toISOString() : ''
                                      }
                                      format={(value) =>
                                        value
                                          ? dayjs(value).format(
                                              'YYYY-MM-DD HH:mm'
                                            )
                                          : ''
                                      }
                                    >
                                      {({ input, meta }) => (
                                        <Input
                                          {...input}
                                          type='datetime-local'
                                          id='task-start'
                                          label='Fecha'
                                          meta={meta}
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div>
                                    <Field<string>
                                      name={`${name}.hourStart`}
                                      required={required}
                                      parse={(value) =>
                                        value
                                          ? dayjs(
                                              `${date}T${value}:00`
                                            ).toISOString()
                                          : ''
                                      }
                                      format={(value) =>
                                        value
                                          ? dayjs(value).format('HH:mm')
                                          : ''
                                      }
                                    >
                                      {({ input, meta }) => (
                                        <Input
                                          {...input}
                                          meta={meta}
                                          type='time'
                                          label='Hora inicio'
                                        />
                                      )}
                                    </Field>
                                  </div>

                                  <div>
                                    <Field<string>
                                      name={`${name}.hourEnd`}
                                      required={required}
                                      parse={(value) =>
                                        value
                                          ? dayjs(
                                              `${date}T${value}:00`
                                            ).toISOString()
                                          : ''
                                      }
                                      format={(value) =>
                                        value
                                          ? dayjs(value).format('HH:mm')
                                          : ''
                                      }
                                    >
                                      {({ input, meta }) => (
                                        <Input
                                          {...input}
                                          meta={meta}
                                          type='time'
                                          label='Hora fin'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                </div>

                                <div className='mt-4 flex justify-end'>
                                  <button
                                    type='button'
                                    onClick={() => fields.remove(index)}
                                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 '
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </ExpansionPanel>
              </div>
              <div class='col-span-2'>
                <ExpansionPanel title='Tareas del servicio'>
                  <FieldArray name='task'>
                    {({ fields }: any) => (
                      <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Añadir tareas al servicio
                          </h3>
                          <Button
                            icon='044'
                            rounded
                            id='menu-btn'
                            name='menu'
                            type='button'
                            color='text-primary'
                            onClick={() => fields.push({})}
                          />
                        </div>

                        {fields.map((name: any, index: any) => (
                          <div
                            key={index}
                            className='bg-white dark:bg-b-dark rounded-lg border border-gray-200 shadow-sm'
                          >
                            <div className='bg-gray-50 dark:bg-b-dark-light px-4 py-3 border-b border-gray-200 rounded-t-lg'>
                              <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                                Tarea {index + 1}
                              </h2>
                            </div>

                            <div className='p-4 space-y-4'>
                              <Field name={`${name}.create`}>
                                {({ input: createInput }) => {
                                  const isCreateChecked = createInput.value;
                                  return (
                                    <div className='space-y-4'>
                                      <div className='grid grid-cols-6 gap-4'>
                                        <div className='col-span-5'>
                                          <Field name={`${name}.taskId`}>
                                            {({ input }) => (
                                              <Select
                                                {...input}
                                                placeholder='Seleccione tarea...'
                                                label='Tarea'
                                                name='taskId'
                                                icon='252'
                                                optionValue='id'
                                                optionLabel='description'
                                                options={forms.value}
                                                disabled={isCreateChecked}
                                                onChange={(e) => {
                                                  const id = parseInt(
                                                    e.currentTarget.value
                                                  );
                                                  input.onChange(id);
                                                }}
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        <div className='col-span-1 flex items-center pt-6'>
                                          <label className='inline-flex items-center cursor-pointer'>
                                            <input
                                              {...createInput}
                                              type='checkbox'
                                              className='form-checkbox h-5 w-5 text-blue-600 rounded'
                                            />
                                            <span className='ml-2 text-gray-700 dark:text-gray-300'>
                                              Crear tarea
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      {isCreateChecked && (
                                        <div className='grid grid-cols-6 gap-4'>
                                          <div className='col-span-2'>
                                            <Field<string>
                                              name={`${name}.start`}
                                              validate={required}
                                              parse={(value) =>
                                                value
                                                  ? dayjs(value).toISOString()
                                                  : ''
                                              }
                                              format={(value) =>
                                                value
                                                  ? dayjs(value).format(
                                                      'YYYY-MM-DD HH:mm'
                                                    )
                                                  : ''
                                              }
                                            >
                                              {({ input, meta }) => (
                                                <Input
                                                  {...input}
                                                  type='datetime-local'
                                                  id='task-start'
                                                  label='Fecha inicio'
                                                  meta={meta}
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className='col-span-2'>
                                            <Field name='formId'>
                                              {({ input }) => (
                                                <Select
                                                  {...input}
                                                  placeholder='Selecione formulario...'
                                                  label='Formulario'
                                                  name='formId'
                                                  icon='252'
                                                  optionValue='id'
                                                  optionLabel='title'
                                                  options={forms.value}
                                                  onChange={(e) => {
                                                    const id = parseInt(
                                                      e.currentTarget.value
                                                    );
                                                    input.onChange(id);
                                                  }}
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className='col-span-2'>
                                            <Field<string>
                                              name={`${name}.status`}
                                            >
                                              {({ input }) => (
                                                <Select
                                                  {...input}
                                                  placeholder='Selecione tipo...'
                                                  label='Tipo'
                                                  id='task-status'
                                                  name='type'
                                                  icon='252'
                                                  options={[
                                                    {
                                                      value: 'CREATED',
                                                      label: 'Creado',
                                                    },
                                                    {
                                                      value: 'RESOLVED',
                                                      label: 'Resuelto',
                                                    },
                                                    {
                                                      value: 'CLOSED',
                                                      label: 'Cerrado',
                                                    },
                                                  ]}
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className='col-span-6'>
                                            <Field<string>
                                              name={`${name}.description`}
                                              validate={required}
                                            >
                                              {({ input, meta }) => (
                                                <TextArea
                                                  {...input}
                                                  id='task-description'
                                                  placeholder='Ingrese Descripción...'
                                                  label='Descripción'
                                                  type='text'
                                                  meta={meta}
                                                />
                                              )}
                                            </Field>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Field>

                              <div className='flex justify-end'>
                                <button
                                  type='button'
                                  onClick={() => fields.remove(index)}
                                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:ring-2 focus:ring-offset-2'
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </ExpansionPanel>
              </div>
            </div>

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              <Button
                id='btn-clean'
                name='btn-clean'
                type='button'
                label='Limpiar'
                onClick={() => form.reset()}
                disabled={submitting}
              />

              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label={id ? 'Editar' : 'Guardar'}
                className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
                disabled={submitting}
              />
            </div>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre>*/}
          </form>
        )}
      />
    </Section>
  );
};
