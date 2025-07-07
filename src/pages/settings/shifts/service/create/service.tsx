import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';

import { FunctionComponent } from 'preact';
import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { TextArea } from '@/components/common/text.area/text.area';
import arrayMutators from 'final-form-arrays';
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
import { StatusButton } from '@/pages/settings/components/custom.button';
import { ScheduleSelector } from '@/components/common/schedule-selector/schedule-selector';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { TaskFormCreate } from '../../task/create/task.form';
import { ITask } from '../../task/create/interface';
import { _onTaskAddSimple } from '../../task/create/utils';

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
  // const [_, navigate] = useLocation();
  const schedules: Signal<IOption[]> = useSignal([]);
  const projects: Signal<IOption[]> = useSignal([]);
  const places: Signal<IOption[]> = useSignal([]);
  const rounds: Signal<IOption[]> = useSignal([]);

  const tasks = useSignal([]);
  const forms: Signal<IOption[]> = useSignal([]);

  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams();

  const onSubmit = async (model: FormData) => {
    model.tasks = tasksResponse.value;
    model.hasRound = !!model.roundId;

    const output = {
      ...model,
      placeId: Number(model.placeId?.value),
      roundId: Number(model.roundId?.value),
      contractId: Number(model.contractId?.value),
    };

    // TODO: Joshua Deje comentado el send, solo es descomentar y debe funcionar
    // pero ahi podes ver las estructura que genera: SOLO es para rematar.
    console.log('OUTPUT: ', output);

    /*
    if (id) {
      const response = await ServiceService.updateService(output, id);
      if (!response.getStatus()) return;
      ToastManager.success('s_updated_success');
    } else {
      const response = await ServiceService.createService(output);
      if (!response.getStatus()) return;
      ToastManager.success('s_created_success');
    }

    navigate('/rounds/service/');
    */
  };

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

    const response = await ServiceService.getServiceById(id);
    if (!response.getStatus()) return;
    const model = response.getOne();
    let placeId: IOption | undefined = undefined;
    let roundId: IOption | undefined = undefined;
    let contractId: IOption | undefined = undefined;
    let schedules: IOption[] = [];

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

    if (model.tasks && model.tasks.length > 0) {
      onTaskAdd(model.tasks);
    }

    const res_props = pick(omitBy(model, isNull), userKeys);

    initialValues.value = {
      ...res_props,
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
    ]);
    setInitialValues();
  };

  useEffect(() => {
    getAllData();
  }, []);

  const tasksResponse = useSignal<ITask[]>([]);
  const onTaskAdd = (model: any) => {
    const task = _onTaskAddSimple(model);
    tasksResponse.value = [...task, ...tasksResponse.value];
  };

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

              <div class='col-span-2'>
                <Field<IOption[]> name='schedules' validate={required}>
                  {({ input, meta }) => (
                    <ScheduleSelector
                      {...input}
                      meta={meta}
                      options={schedules.value}
                      id='schedules'
                    />
                  )}
                </Field>
              </div>
              {/*
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
              */}
              <div class='col-span-2'>
                <TaskFormCreate
                  onSubmit={onTaskAdd}
                  forms={forms.value}
                  append
                  taskList={tasksResponse.value}
                  add
                  divisor={false}
                  className='rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light w-full'
                  icon='039'
                />
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
          </form>
        )}
      />
    </Section>
  );
};
