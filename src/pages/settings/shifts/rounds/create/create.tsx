import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { useEffect } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { omitBy, isNull, pick } from 'lodash';
import arrayMutators from 'final-form-arrays';
// import { ExpansionPanel } from '@/components/common/expansion-panels/expansion-panels';
import { IPointMap } from '../interface';
// import { TextArea } from '@/components/common/text.area/text.area';
// import { Select } from '@/components/common/select/select';
// import dayjs from 'dayjs';
// import { Tooltip } from '@/components/common/tooltip/tooltip';
// import { ITask } from '@/types/shift/activity';
import {
  // FormService,
  // TaskService,
  PlaceService,
  RoundService,
} from '@/services';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useNavigation } from '@/utils/utilities/navigation';
import { HelpTooltip } from '@/components/common/help-tooltip';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
// import { TaskFormCreate } from '../../task/create/task.form';
// import { IOption } from '@/components/common/multi/interface';

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
  const { t } = useTranslation();
  const { id } = useParams(); // Obtiene el id de la URL
  const currentLocation = useSignal<ILocation>();
  const points = useSignal<any>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const places = useSignal<any>([]);
  const { navigateUpsert } = useNavigation();
  // const tasksResponse = useSignal<any[]>([]);
  // const _forms = useSignal<IOption[]>([]);

  // const getFormsHandler = async () => {
  //   const response = await FormService.getSimpleList();
  //   if (!response.getStatus()) return;
  //   _forms.value = response.getMany();
  // };

  let lastPointsSerialized = JSON.stringify([]);

  const sendPointsRef = (data: any) => {
    const serialized = JSON.stringify(data);
    if (serialized === lastPointsSerialized) return; // Solo actualiza si realmente cambió

    points.value = data;
    lastPointsSerialized = serialized;

    if (!data.length) return;
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

    navigateUpsert('/shifts/rounds');
  };

  /*
  const getTasks = async () => {
    const response = await TaskService.getTasks();
    if (!response.getStatus()) return;
    tasks.value = response.getMany();
  };
  */

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
    await Promise.all([
      getPlaces(),
      setInitialValues() /*, getFormsHandler() */,
    ]);
  };

  /*
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
  */

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      created();
      // Promise.all([created(), getTasks()]);
    }
  }, [selectedCompany, location]);

  /*
  const onTaskAdd = (task: any, index: number) => {
    tasksResponse.value[index] = [task, ...tasksResponse.value[index]];
    // tasksResponse.value = [task, ...tasksResponse.value];
  };
  */

  return (
    <>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting }) => (
          <form onSubmit={handleSubmit} id='form-round-create'>
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
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='p_write'
                        label='h_name'
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
                        placeholder='p_write'
                        label='description'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {t('h_frequency')}
                      </label>
                      <HelpTooltip title='h_frequency' content='i_frequency' />
                    </div>
                    <Field
                      name='frequency'
                      parse={(value) => (value ? Number(value) : undefined)}
                    >
                      {({ input }) => (
                        <Input
                          {...input}
                          id='input-code'
                          placeholder='p_write'
                          type='number'
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {t('h_radius')}
                      </label>
                      <HelpTooltip title='h_radius' content='i_radius' />
                    </div>
                    <Field
                      name='radius'
                      parse={(value) => (value ? Number(value) : undefined)}
                    >
                      {({ input }) => (
                        <Input
                          {...input}
                          id='input-radius'
                          placeholder='p_write'
                          type='number'
                        />
                      )}
                    </Field>
                  </div>
                </div>

                <div className='max-h-[450px] overflow-auto vox-scroll-design'>
                  {points.value.map((point: IPointMap, index: number) => (
                    <div
                      id={String(index)}
                      className={`border-b-light-dark dark:border-b-dark-dark rounded-md overflow-hidden my-1`}
                    >
                      <div className={`flex items-center justify-between p-4 bg-b-light-light dark:bg-b-dark-light`}>
                        <div className='flex flex-col'>
                          <span className='font-medium'>{`📍 Point ${index + 1} `}</span>
                          <span className='text-sm'>{`lat: ${point.position.lat}, lng: ${point.position.lng}`}</span>
                        </div>
                      </div>
                    </div>
                    // <ExpansionPanel
                    //   subtitle={`lat: ${point.position.lat}, lng: ${point.position.lng}`}
                    //   className='my-1'
                    //   key={point.id}
                    //   title={`📍 Point ${index + 1} `}
                    // >
                    //   <div></div>
                    //   <TaskFormCreate
                    //     onSubmit={(e: any) => onTaskAdd(e, index)}
                    //     taskList={tasksResponse.value[index]}
                    //     forms={_forms.value}
                    //     add
                    //     selector
                    //     divisor={false}
                    //     className='rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light w-full'
                    //   />
                    //   <Field name={`tasks.${point.id}.create`}>
                    //     {({ input: createInput }) => {
                    //       const isCreateChecked = createInput.value;

                    //       return (
                    //         <div className='grid grid-cols-12 gap-4 items-start bg-b-light-light dark:bg-b-dark-light p-3 border-t border-b-light dark:border-b-dark'>
                    //           <div className='col-span-1'>
                    //             <Tooltip text='Crear tarea'>
                    //               <input
                    //                 {...createInput}
                    //                 type='checkbox'
                    //                 className='form-checkbox mt-9 h-5 w-5 text-blue-600 rounded'
                    //               />
                    //             </Tooltip>
                    //           </div>
                    //           {isCreateChecked ? (
                    //             <>
                    //               <div className='col-span-4'>
                    //                 <Field<string>
                    //                   name={`tasks.${point.id}.start`}
                    //                   validate={required}
                    //                   parse={(value) =>
                    //                     value ? dayjs(value).toISOString() : ''
                    //                   }
                    //                   format={(value) =>
                    //                     value
                    //                       ? dayjs(value).format(
                    //                           'YYYY-MM-DD HH:mm'
                    //                         )
                    //                       : ''
                    //                   }
                    //                 >
                    //                   {({ input, meta }) => (
                    //                     <Input
                    //                       {...input}
                    //                       type='datetime-local'
                    //                       id='task-start'
                    //                       label='Fecha inicio'
                    //                       meta={meta}
                    //                     />
                    //                   )}
                    //                 </Field>
                    //               </div>
                    //               <div className='col-span-6'>
                    //                 <Field name={`tasks.${point.id}.formId`}>
                    //                   {({ input }) => (
                    //                     <Select
                    //                       {...input}
                    //                       placeholder='Seleccione...'
                    //                       label='Formulario'
                    //                       name='formId'
                    //                       icon='252'
                    //                       optionValue='id'
                    //                       optionLabel='title'
                    //                       options={forms.value}
                    //                       onChange={(e) => {
                    //                         const id = parseInt(
                    //                           e.currentTarget.value
                    //                         );
                    //                         input.onChange(id);
                    //                       }}
                    //                     />
                    //                   )}
                    //                 </Field>
                    //               </div>

                    //               <div className='col-span-11'>
                    //                 <Field<string>
                    //                   name={`tasks.${point.id}.description`}
                    //                   validate={required}
                    //                 >
                    //                   {({ input, meta }) => (
                    //                     <TextArea
                    //                       {...input}
                    //                       id='task-description'
                    //                       placeholder='Ingrese Descripción...'
                    //                       label='Descripción'
                    //                       type='text'
                    //                       meta={meta}
                    //                     />
                    //                   )}
                    //                 </Field>
                    //               </div>
                    //               <div className='col-span-1'>
                    //                 <Button
                    //                   id='btn-save'
                    //                   name='btn-save'
                    //                   icon='039'
                    //                   type='button'
                    //                   className='px-4 py-2 mt-8 '
                    //                   onClick={() => {
                    //                     const formState = form.getState();
                    //                     const taskData =
                    //                       formState.values.tasks[point.id];

                    //                     // Create a new array with the updated tasks
                    //                     const updatedPoints = [...points.value];
                    //                     if (!updatedPoints[index].tasks) {
                    //                       updatedPoints[index].tasks = [];
                    //                     }
                    //                     updatedPoints[index].tasks.push({
                    //                       start: taskData.start,
                    //                       description: taskData.description,
                    //                       formId: taskData.formId,
                    //                     });

                    //                     // Update the signal to trigger re-render
                    //                     points.value = updatedPoints;
                    //                   }}
                    //                 />
                    //               </div>
                    //             </>
                    //           ) : (
                    //             <div className='col-span-11'>
                    //               <Field name={`tasks.${point.id}.taskId`}>
                    //                 {({ input }) => (
                    //                   <Select
                    //                     {...input}
                    //                     placeholder='Seleccione tarea...'
                    //                     label='Tarea'
                    //                     name='taskId'
                    //                     icon='252'
                    //                     optionValue='id'
                    //                     optionLabel='description'
                    //                     options={tasks.value}
                    //                     disabled={isCreateChecked}
                    //                     onChange={(e) => {
                    //                       const id = parseInt(
                    //                         e.currentTarget.value
                    //                       );
                    //                       input.onChange(id);
                    //                       selectTask(id, index);
                    //                     }}
                    //                   />
                    //                 )}
                    //               </Field>
                    //             </div>
                    //           )}
                    //         </div>
                    //       );
                    //     }}
                    //   </Field>

                    //   {point.tasks && point.tasks.length > 0 && (
                    //     <div className='mt-4'>
                    //       <table className='min-w-full divide-y divide-gray-200'>
                    //         <thead className='bg-b-light-light dark:bg-b-dark-light'>
                    //           <tr>
                    //             <th
                    //               scope='col'
                    //               className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    //             />
                    //             <th
                    //               scope='col'
                    //               className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    //             >
                    //               Fecha Inicio
                    //             </th>
                    //             <th
                    //               scope='col'
                    //               className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    //             >
                    //               ID Formulario
                    //             </th>
                    //             <th
                    //               scope='col'
                    //               className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    //             >
                    //               Descripción
                    //             </th>
                    //           </tr>
                    //         </thead>
                    //         <tbody className='divide-y divide-gray-200'>
                    //           {point.tasks.map(
                    //             (task: ITask, taskIndex: number) => (
                    //               <tr key={taskIndex}>
                    //                 <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                    //                   <Button
                    //                     textColor='text-red-600'
                    //                     id='btn-delete'
                    //                     name='btn-delete'
                    //                     icon='041'
                    //                     type='button'
                    //                     className='text-red-600 hover:text-red-800'
                    //                     onClick={() => {
                    //                       points.value[index].tasks.splice(
                    //                         taskIndex,
                    //                         1
                    //                       );
                    //                       points.value = [...points.value];
                    //                     }}
                    //                   />
                    //                 </td>
                    //                 <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                    //                   {dayjs(task.start).format(
                    //                     'DD/MM/YYYY HH:mm'
                    //                   )}
                    //                 </td>
                    //                 <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                    //                   {task.formId}
                    //                 </td>

                    //                 <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                    //                   <p>{task.description}</p>
                    //                 </td>
                    //               </tr>
                    //             )
                    //           )}
                    //         </tbody>
                    //       </table>
                    //     </div>
                    //   )}
                    // </ExpansionPanel>
                  ))}
                </div>
              </div>
              <div>
                <div className='mt-2 rounded-md p-4 bg-b-light-light dark:bg-b-dark-light'>
                  <h3 className='font-medium mb-2 flex flex-row gap-3'>
                    <span className='vox-icon vx-icon-406 size-sm' />
                    {t('instructions')}
                  </h3>
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>{t('inst_1')}</li>
                    <li>{t('inst_2')}</li>
                    <li>{t('inst_3')}</li>
                  </ul>
                </div>
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
                  clickPoint={() => { }}
                />
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};
