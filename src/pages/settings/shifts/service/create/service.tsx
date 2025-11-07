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
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

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
  const { go } = useNavigation();
  const schedules: Signal<IOption[]> = useSignal([]);
  const projects: Signal<IOption[]> = useSignal([]);
  const places: Signal<IOption[]> = useSignal([]);
  const rounds: Signal<IOption[]> = useSignal([]);

  const tasks = useSignal([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams();
  const loading = useSignal<boolean>(false);

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    model.tasks = tasksResponse.value;
    model.hasRound = !!model.roundId;

    const output = {
      ...model,
      placeId: Number(model.placeId?.value),
      roundId: Number(model.roundId?.value),
      contractId: Number(model.contractId?.value),
    };

    if (id) {
      const response = await ServiceService.updateService(output, id);
      if (!response.getStatus()) return;
      ToastManager.success('s_updated_success');
    } else {
      const response = await ServiceService.createService(output);
      if (!response.getStatus()) return;
      ToastManager.success('s_created_success');
    }
    go({
      to: '/shifts/service',
      label: 'm_service',
      id: 'shift:services:state',
      base: 'setting',
    });
    loading.value = false;
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
    loading.value = true;
    if (!id) return loading.value = false;

    const userKeys = [
      'name',
      'contractId',
      'placeId',
      'roundId',
      'description',
      'priority',
      'schedules',
      'overtimes',
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
    loading.value = false;
  };

  const getAllData = async () => {
    await Promise.all([
      getTasks(),
      getPlaces(),
      getRounds(),
      getProjects(),
      getSchedules(),
    ]);
    setInitialValues();
  };

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getAllData();
    }
  }, [selectedCompany, location]);

  const tasksResponse = useSignal<ITask[]>([]);
  const onTaskAdd = (model: any) => {
    const task = _onTaskAddSimple(model);
    tasksResponse.value = [...task, ...tasksResponse.value];
  };

  const onTaskDelete = (id: string) => {
    tasksResponse.value = tasksResponse.value.filter((task) => task.id !== id);
  };

  return (
    <Section className=' p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design' loading={loading.value}>
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
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting}
              pristine={pristine}
              form='form-service-create'
              label={id ? 'edit' : 'save'}
            />
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-4 gap-2'>
              <div class='col-span-2'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='p_name'
                      label='l_name'
                      type='text'
                      meta={meta}
                      disabled={loading.value}
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
                      placeholder='p_contract'
                      label='l_contract'
                      id='contractId'
                      icon='241'
                      options={projects.value}
                      disabled={loading.value}
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
                      placeholder='p_select_place'
                      label='l_place'
                      id='placeId'
                      icon='252'
                      options={places.value}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div class='col-span-2'>
                <Field<IOption> name='roundId'>
                  {({ input }) => (
                    <SmartSelector
                      {...input}
                      placeholder='p_select_round'
                      label='l_round'
                      id='roundId'
                      icon='252'
                      options={rounds.value}
                      disabled={loading.value}
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
                      placeholder='p_element_description'
                      label='description'
                      type='text'
                      meta={meta}
                      disabled={loading.value}
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
              <div class='col-span-2'>
                <TaskFormCreate
                  onSubmit={onTaskAdd}
                  taskList={tasksResponse.value}
                  onDelete={onTaskDelete}
                  add
                  selector
                  type='GENERAL'
                  divisor={false}
                  className='rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light w-full'
                  disabled={loading.value}
                />
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};
