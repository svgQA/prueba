import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift/shift';
import { UserService } from '@/services/general/user';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import dayjs from 'dayjs';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { ServiceService } from '@/services';

interface ITask {
  start: string;
  status: string;
  description: string;
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

export const ActivityCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const inputKeywords = useSignal('');
  const services = useSignal([]);
  const users = useSignal([]);

  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    const { start, end } = model;
    let request;
    let message: string;

    if (start) model.start = dayjs(start).toISOString();
    if (end) model.end = dayjs(end).toISOString();

    if (!id) {
      request = await ShiftService.createActivity(model);
      message = 'Turno creado exitosamente!';
    } else {
      request = await ShiftService.updateActivity(model, id);
      message = 'Turno editado exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    navigate('/rounds/activity');
  };

  const setInitialValues = async () => {
    if (!id) return;

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

    const request: any = await ShiftService.getActivityById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };

  const getServices = async () => {
    const request: any = await ServiceService.getServices();
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
    await setInitialValues();
  };

  useEffect(() => {
    main();
  }, []);
  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, values, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-2 gap-3'>
              <div class='col-span-1'>
                <Field<string>
                  name='start'
                  validate={required}
                  parse={(value) => (value ? dayjs(value).toISOString() : '')}
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
                  parse={(value) => (value ? dayjs(value).toISOString() : '')}
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
                    <Input {...input} type='text' label='Codigo externo' />
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
                            (inputKeywords.value = e.currentTarget.value)
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
              {/* <div class='col-span-2'>
                  <FieldArray name='tasks'>
                    {({ fields }) => (
                      <div>
                        <h3 className='text-lg dark:text-white font-medium text-gray-900 text-center p5'>
                          Añadir tareas al turno
                          <Button
                            icon='044'
                            rounded
                            id='menu-btn'
                            name='menu'
                            type='button'
                            color='text-primary'
                            onClick={() => fields.push({})}
                          />
                        </h3>
                        {fields.map((name, index) => (
                          <div
                            key={index}
                            className='rounde shadow p-2 border-2'
                          >
                            <div className='bg-gray-100 dark:bg-b-dark-light p-3 text-center'>
                              <h2 className='text-xl font-semibold '>
                                Tarea {index + 1}
                              </h2>
                            </div>
                            <div className='grid grid-cols-2 gap-1'>
                              <div className='col-span-1'>
                                <Field<string>
                                  name={`${name}.start`}
                                  validate={required}
                                  parse={(value) =>
                                    value ? dayjs(value).toISOString() : ''
                                  }
                                  format={(value) =>
                                    value
                                      ? dayjs(value).format('YYYY-MM-DD HH:mm')
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

                              <div class='col-span-1'>
                                <Field<string> name={`${name}.status`}>
                                  {({ input }) => (
                                    <Select
                                      {...input}
                                      placeholder='Selecione tipo...'
                                      label='Tipo'
                                      id='task-status'
                                      name='type'
                                      icon='252'
                                      options={[
                                        { value: 'CREATED', label: 'Creado' },
                                        {
                                          value: 'RESOLVED',
                                          label: 'Resuelto',
                                        },
                                        { value: 'CLOSED', label: 'Cerrado' },
                                      ]}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className='col-span-2'>
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
                            <button
                              type='button'
                              onClick={() => fields.remove(index)}
                              className='mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700'
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div> */}
            </div>

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              <Button
                id='btn-clean'
                name='btn-clean'
                type='button'
                label='Limpiar'
                onClick={() => form.reset()}
                disabled={submitting || pristine}
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
          </form>
        )}
      />
      {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
    </Section>
  );
};
