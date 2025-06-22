import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';

import { FunctionComponent } from 'preact';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { TextArea } from '@/components/common/text.area/text.area';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Input } from '@/components/common/input/input';
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
import { StatusButton } from '@/pages/settings/components/custom.button';
import { ScheduleSelector } from '@/components/common/schedule-selector/schedule-selector';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { DateUtils } from '@/utils/utilities/dates';
import { DateField } from '@/components/compose/forms';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  description: string;
  hasRound: boolean;
  roundId?: IOption;
  placeId?: IOption;
  contractId?: IOption;
  schedules: IOption[];
  tasks: any;
}

export const ServiceCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const schedules: Signal<IOption[]> = useSignal([]);
  const projects: Signal<IOption[]> = useSignal([]);
  const places: Signal<IOption[]> = useSignal([]);
  const rounds: Signal<IOption[]> = useSignal([]);
  const { t } = useTranslation();

  const tasks = useSignal([]);
  const forms: Signal<IOption[]> = useSignal([]);

  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  // const date = dayjs().format('YYYY-MM-DD');

  const onSubmit = async (model: FormData) => {
    model.tasks = setTasks(model.tasks);
    model.hasRound = !!model.roundId;

    let request;
    let message: string;

    const output = {
      ...model,
      placeId: Number(model.placeId?.value),
      roundId: Number(model.roundId?.value),
      contractId: Number(model.contractId?.value),
    };

    if (id) {
      request = await ServiceService.updateService(output, id);
      message = 'servicio editado exitosamente!';
    } else {
      request = await ServiceService.createService(output);
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
        hourStart: null as string | null,
        formId: null,
        name: null,
        description: null,
      };

      if (!task.create && task.taskId) {
        const matchingTask: any = tasks.value.find(
          (val: any) => val.id === task.taskId
        );
        taskData.hourStart = matchingTask.hourStart;
        taskData.formId = matchingTask.formId;
        taskData.name = matchingTask.name;
        taskData.description = matchingTask.description;
      } else {
        // TODO: Revisar esta mierda por si queda con errores
        /*
        taskData.hourStart = task.hourStart
          ? dayjs(`${date}T${task.hourStart}:00`).toISOString()
          : null;
        */
        taskData.hourStart = task.hourStart
          ? DateUtils.dateToBackend(task.hourStart)
          : null;
        taskData.formId = task.formId || null;
        taskData.name = task.name;
        taskData.description = task.description;
      }

      return taskData;
    });

    data.push(...(mappedTasks || []));

    return data;
  };

  // const filteredOptions: any = schedules.value.filter((option) =>
  //   option.name.toLowerCase().includes(search.toLowerCase())
  // );

  const getProjects = async () => {
    const request = await ContractService.getSimpleList();
    if (!request.getStatus()) return;
    projects.value = request.getMany();
  };

  const getPlaces = async () => {
    const request = await PlaceService.getSimpleList();
    if (!request.getStatus()) return;
    places.value = request.getMany();
  };

  const getRounds = async () => {
    const request = await RoundService.getSimpleList();
    if (!request.getStatus()) return;
    rounds.value = request.getMany();
  };

  const getFormsHandler = async () => {
    const response = await FormService.getSimpleList();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const getTasks = async () => {
    const request: any = await TaskService.getTasks();
    if (!request.getStatus()) return;
    tasks.value = request.getMany();
  };

  const getSchedules = async () => {
    const request = await ScheduleService.getSimpleList();
    if (!request.getStatus()) return;
    schedules.value = request.getMany();
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
    let placeId: IOption | undefined;
    let roundId: IOption | undefined;
    let contractId: IOption | undefined;
    let schedules: IOption[] = [];

    if (request.getStatus()) {
      const model = request.getOne();
      if (model.place) {
        placeId = {
          value: model.place.id,
          label: model.place.name,
        };
      }
      if (model.round) {
        roundId = {
          value: model.round.id,
          label: model.round.name,
        };
      }
      if (model.contract) {
        contractId = {
          value: model.contract.id,
          label: model.contract.name,
        };
      }
      if (model.schedules) {
        schedules = model.schedules.map((schedule: any) => ({
          value: schedule.schedule.id,
          label: schedule.schedule.name,
        }));
      }
    }

    const model = pick(omitBy(request.model, isNull), userKeys);

    initialValues.value = {
      ...model,
      placeId,
      roundId,
      contractId,
      schedules,
    };
  };

  const getAllData = async () => {
    await Promise.all([
      getTasks(),
      getPlaces(),
      getRounds(),
      getProjects(),
      getSchedules(),
      getFormsHandler(),
      setInitialValues(),
    ]);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <Section>
      <Form
        mutators={{
          ...arrayMutators,
        }}
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-service-create'
          >
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
                <Field<IOption> name='contractId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='Seleccione Contrato...'
                      label='contract'
                      id='contractId'
                      icon='241'
                      options={projects.value}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <Field<IOption> name='placeId' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      placeholder='Seleccione lugar...'
                      label='place'
                      id='placeId'
                      icon='252'
                      options={places.value}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <Field<IOption> name='roundId'>
                  {({ input }) => (
                    <SmartSelector
                      {...input}
                      placeholder='Seleccione ronda...'
                      label='round'
                      id='roundId'
                      icon='252'
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
                      label='description'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div class='col-span-4'>
                <h3 className='text-lg font-medium mb-4'>Horarios:</h3>
                <Field<IOption[]> name='schedules' validate={required}>
                  {({ input, meta }) => (
                    <ScheduleSelector
                      {...input}
                      meta={meta}
                      options={schedules.value}
                      label='schedule'
                      id='schedules'
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-2'>
                <ExpansionPanel title='Turnos extra'>
                  <FieldArray name='overtimes'>
                    {({ fields }) => (
                      <div>
                        <div className='flex items-center justify-between my-2'>
                          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Añadir turnos extra
                          </h3>
                          <Button
                            icon='044'
                            square
                            id='menu-btn'
                            name='menu'
                            type='button'
                            color='text-primary'
                            onClick={() => fields.push({})}
                          />
                        </div>

                        {fields.map((name, index) => (
                          <div
                            key={index}
                            className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden'
                          >
                            <div className='bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600'>
                              <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                                Turno extra #{index + 1}
                              </h2>
                            </div>

                            <div className='p-4'>
                              <div className='grid grid-cols-3 gap-4'>
                                <div>
                                  <DateField
                                    name={`${name}.start`}
                                    label={t('shifts.date')}
                                    validate={required}
                                  />
                                </div>

                                <div>
                                  <DateField
                                    name={`${name}.end`}
                                    label={t('shifts.date')}
                                    validate={required}
                                    format='time'
                                  />
                                </div>

                                <div>
                                  <DateField
                                    name={`${name}.end`}
                                    label={t('shifts.date')}
                                    validate={required}
                                    format='time'
                                  />
                                </div>
                              </div>

                              <div className='mt-4 flex justify-end'>
                                <Button
                                  icon='044'
                                  id='menu-btn'
                                  name='menu'
                                  type='button'
                                  label='delete'
                                  color='text-primary'
                                  onClick={() => fields.remove(index)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </ExpansionPanel>
              </div>
              <div class='col-span-2'>
                <ExpansionPanel title='Tareas del servicio'>
                  <FieldArray name='tasks'>
                    {({ fields }: any) => (
                      <div>
                        <div className='flex items-center justify-between my-2'>
                          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                            Añadir tareas al servicio
                          </h3>
                          <Button
                            icon='044'
                            square
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
                            className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden'
                          >
                            <div className='bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600'>
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
                                                label='task'
                                                name='taskId'
                                                icon='252'
                                                optionValue='id'
                                                optionLabel='name'
                                                options={tasks.value}
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
                                              name={`${name}.hourStart`}
                                              validate={required}
                                            >
                                              {({ input, meta }) => (
                                                <Input
                                                  {...input}
                                                  type='time'
                                                  id='task-start'
                                                  label='Hora inicio'
                                                  meta={meta}
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className='col-span-3'>
                                            <Field name={`${name}.formId`}>
                                              {({ input }) => (
                                                <Select
                                                  {...input}
                                                  placeholder='Seleccione formulario...'
                                                  label='i_form'
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
                                          <div className='col-span-6'>
                                            <Field<string>
                                              name={`${name}.name`}
                                              validate={required}
                                            >
                                              {({ input, meta }) => (
                                                <Input
                                                  {...input}
                                                  id='task-name'
                                                  placeholder='Ingrese nombre...'
                                                  label='name'
                                                  type='text'
                                                  meta={meta}
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
                                                  label='description'
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
                                <Button
                                  icon='044'
                                  id='menu-btn'
                                  name='menu'
                                  type='button'
                                  color='text-primary'
                                  label='delete'
                                  onClick={() => fields.remove(index)}
                                />
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
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting}
                pristine={pristine}
                form='form-service-create'
                label={id ? 'edit' : 'save'}
              />
            </div>
            {/* <pre>{JSON.stringify(values, 0, 2)}</pre>*/}
          </form>
        )}
      />
    </Section>
  );
};
