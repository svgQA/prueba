import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { useEffect } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { omitBy, isNull, pick } from 'lodash';
import arrayMutators from 'final-form-arrays';
import { ExpansionPanel } from '@/components/common/expansion-panels/expansion-panels';
import { IPointMap } from '../interface';
import { TextArea } from '@/components/common/text.area/text.area';
import { Select } from '@/components/common/select/select';
import dayjs from 'dayjs';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { ITask } from '@/types/shift/activity';
import {
  FormService,
  PlaceService,
  RoundService,
  TaskService,
} from '@/services';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useNavigation } from '@/utils/utilities/navigation';

interface IPoint {
  latitude: number;
  longitude: number;
}

interface FormData {
  name: string;
  frequency: number;
  placeId: number;
  points?: IPoint[];
  latitude: string;
  radius: number;
  longitude: string;
  description: string;
  tasks: {
    [key: string]: {
      start: string;
      status: string;
      description: string;
      formId: number;
    };
  };
}

interface ILocation {
  lat: number;
  lng: number;
}

export const RoundCreateSettingPage: FunctionComponent = () => {
  const currentLocation = useSignal<ILocation>();
  const points = useSignal<any>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const places = useSignal<any>([]);
  const showHelp = useSignal<boolean>(false);
  const tasks = useSignal<ITask[]>([]);
  const { id } = useParams(); // Obtiene el id de la URL
  const { navigateUpsert } = useNavigation();
  const forms = useSignal<any[]>([]);

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  const sendPointsRef = (data: any) => {
    points.value = data;
    if (!data.length) {
      currentLocation.value = undefined;
      return;
    }
    const { lat, lng } = data[0].position;
    currentLocation.value = { lat, lng };
    return { lat, lng };
  };

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;
    if (!points.value.length) {
      return ToastManager.warning('s_insert_points');
    } else {
      model.points = points.value.map(
        (point: {
          id: number;
          position: { lat: number; lng: number };
          tasks: any[];
        }) => {
          const model = point.tasks
            ? {
                latitude: point.position.lat,
                longitude: point.position.lng,
                task: point.tasks,
              }
            : {
                latitude: point.position.lat,
                longitude: point.position.lng,
              };
          return model;
        }
      );
    }

    if (id) {
      request = await RoundService.updateRound(model, id);
      message = 's_updated_success';
    } else {
      request = await RoundService.createRound(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);

    navigateUpsert('/rounds');
  };
  const getTasks = async () => {
    const response = await TaskService.getTasks();
    if (!response.getStatus()) return;
    tasks.value = response.getMany();
  };

  const setInitialValues = async () => {
    if (!id) return;
    let count = 0;
    const userKeys = [
      'name',
      'frequency',
      'placeId',
      'radius',
      'description',
    ] as const;
    const request: any = await RoundService.getRoundById(id);
    points.value =
      request.model.points.map((point: any) => {
        count++;
        return {
          id: count,
          position: {
            lat: point.latitude,
            lng: point.longitude,
          },
          tasks: point.task,
        };
      }) ?? [];

    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };

  const getPlaces = async () => {
    const request: any = await PlaceService.getPlaces();
    places.value = request.data;
  };

  const resetMarket = async () => {
    points.value = [];
  };

  const created = async () => {
    await getPlaces();
    await setInitialValues();
    await getFormsHandler();
  };

  const selectTask = async (taskId: number, pointId: number) => {
    const task = tasks.value.find((task: any) => task.id === taskId);

    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    points.value[pointId].tasks.push({
      start: task.start,
      status: task.status,
      description: task.description,
      formId: task.formId,
    });
  };

  useEffect(() => {
    created();
    getTasks();
  }, []);

  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-round-create'
          >
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Ingrese nombre...'
                        label='name'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Descripción - podría ser un textarea */}
                <div>
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Ingrese descripción...'
                        label='description'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Field
                      name='frequency'
                      parse={(value) => (value ? Number(value) : undefined)}
                    >
                      {({ input }) => (
                        <Input
                          id='input-code'
                          {...input}
                          placeholder='Ingrese frecuencia...'
                          label='frequency'
                          type='number'
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Field
                      name='radius'
                      parse={(value) => (value ? Number(value) : undefined)}
                    >
                      {({ input }) => (
                        <Input
                          id='input-radius'
                          {...input}
                          placeholder='Ingrese radio...'
                          label='radius'
                          type='number'
                        />
                      )}
                    </Field>
                  </div>
                </div>

                <ExpansionPanel title='Tareas por punto' className='mb-2'>
                  {points.value.map((point: IPointMap, index: number) => (
                    <ExpansionPanel
                      subtitle={`lat: ${point.position.lat}, lng: ${point.position.lng}`}
                      className='my-1'
                      key={point.id}
                      title={`📍 Punto ${index + 1} `}
                    >
                      <Field name={`tasks.${point.id}.create`}>
                        {({ input: createInput }) => {
                          const isCreateChecked = createInput.value;

                          return (
                            <div className='grid grid-cols-12 gap-4 items-start bg-b-light-light dark:bg-b-dark-light p-3 border-t border-b-light dark:border-b-dark'>
                              {/* Checkbox */}
                              <div className='col-span-1'>
                                <Tooltip text='Crear tarea'>
                                  <input
                                    {...createInput}
                                    type='checkbox'
                                    className='form-checkbox mt-9 h-5 w-5 text-blue-600 rounded'
                                  />
                                </Tooltip>
                              </div>
                              {isCreateChecked ? (
                                <>
                                  <div className='col-span-4'>
                                    <Field<string>
                                      name={`tasks.${point.id}.start`}
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
                                          label='Fecha inicio'
                                          meta={meta}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <div className='col-span-6'>
                                    <Field name={`tasks.${point.id}.formId`}>
                                      {({ input }) => (
                                        <Select
                                          {...input}
                                          placeholder='Seleccione...'
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

                                  <div className='col-span-11'>
                                    <Field<string>
                                      name={`tasks.${point.id}.description`}
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
                                  <div className='col-span-1'>
                                    <Button
                                      id='btn-save'
                                      name='btn-save'
                                      icon='039'
                                      type='button'
                                      className='px-4 py-2 mt-8 '
                                      onClick={() => {
                                        const formState = form.getState();
                                        const taskData =
                                          formState.values.tasks[point.id];

                                        // Create a new array with the updated tasks
                                        const updatedPoints = [...points.value];
                                        if (!updatedPoints[index].tasks) {
                                          updatedPoints[index].tasks = [];
                                        }
                                        updatedPoints[index].tasks.push({
                                          start: taskData.start,
                                          description: taskData.description,
                                          formId: taskData.formId,
                                        });

                                        // Update the signal to trigger re-render
                                        points.value = updatedPoints;
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className='col-span-11'>
                                  <Field name={`tasks.${point.id}.taskId`}>
                                    {({ input }) => (
                                      <Select
                                        {...input}
                                        placeholder='Seleccione tarea...'
                                        label='Tarea'
                                        name='taskId'
                                        icon='252'
                                        optionValue='id'
                                        optionLabel='description'
                                        options={tasks.value}
                                        disabled={isCreateChecked}
                                        onChange={(e) => {
                                          const id = parseInt(
                                            e.currentTarget.value
                                          );
                                          input.onChange(id);
                                          selectTask(id, index);
                                        }}
                                      />
                                    )}
                                  </Field>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      </Field>

                      {point.tasks && point.tasks.length > 0 && (
                        <div className='mt-4'>
                          <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-b-light-light dark:bg-b-dark-light'>
                              <tr>
                                <th
                                  scope='col'
                                  className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                />
                                <th
                                  scope='col'
                                  className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  Fecha Inicio
                                </th>
                                <th
                                  scope='col'
                                  className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  ID Formulario
                                </th>
                                <th
                                  scope='col'
                                  className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  Descripción
                                </th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                              {point.tasks.map(
                                (task: ITask, taskIndex: number) => (
                                  <tr key={taskIndex}>
                                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                      <Button
                                        textColor='text-red-600'
                                        id='btn-delete'
                                        name='btn-delete'
                                        icon='041'
                                        type='button'
                                        className='text-red-600 hover:text-red-800'
                                        onClick={() => {
                                          points.value[index].tasks.splice(
                                            taskIndex,
                                            1
                                          );
                                          points.value = [...points.value];
                                        }}
                                      />
                                    </td>
                                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                      {dayjs(task.start).format(
                                        'DD/MM/YYYY HH:mm'
                                      )}
                                    </td>
                                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                      {task.formId}
                                    </td>

                                    <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                      <p>{task.description}</p>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </ExpansionPanel>
                  ))}
                </ExpansionPanel>

                {/* Instrucciones */}
                <div>
                  <Button
                    id='btn-help'
                    name='btn-help'
                    type='button'
                    label='💡 Instrucciones'
                    onClick={() => (showHelp.value = !showHelp.value)}
                  />

                  {showHelp.value && (
                    <div className='mt-2 rounded-md p-4 bg-b-light-light dark:bg-b-dark-light'>
                      <h3 className='font-medium mb-2'>Instrucciones</h3>
                      <ul className='list-disc pl-5 space-y-2'>
                        <li>
                          Haga clic en el mapa para comenzar a dibujar la ronda
                        </li>
                        <li>Continúe haciendo clic para agregar más puntos.</li>
                        <li>
                          Haga clic en el botón de guardar para crear la ronda.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                {/* <Map
                  name='Map'
                  pointsAmount={100}
                  allowManualPoint={true}
                  sendPoints={(data) => {
                    const result = sendPointsRef(data);
                    form.change('latitude', result?.lat);
                    form.change('longitude', result?.lng);
                  }}
                  pointsRef={points.value}
                  center={currentLocation.value}
                  condition={false}
                  errorCondition=''
                  radialPoint={null}
                  errorRadialPoint=''
                  draggable={true}
                  width='100%'
                  height='500px'
                  clickPoint={() => {}}
                /> */}

                <MapLibrePointsMap
                  name='map-points'
                  pointsAmount={100}
                  allowManualPoint={true}
                  sendPoints={(data) => {
                    const result = sendPointsRef(data);
                    form.change('latitude', result?.lat);
                    form.change('longitude', result?.lng);
                  }}
                  pointsRef={points.value}
                  center={currentLocation.value}
                  condition={false}
                  errorCondition=''
                  radialPoint={null}
                  errorRadialPoint=''
                  draggable={true}
                  width='100%'
                  height='500px'
                  clickPoint={() => {}}
                />

                {/* Botonera */}
                <div className='w-full flex-row flex justify-end items-center mt-2'>
                  <StatusButton
                    onClickClean={() => {
                      form.reset();
                      resetMarket();
                    }}
                    submitting={submitting}
                    pristine={true}
                    form='form-round-create'
                    label={id ? 'edit' : 'save'}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};
