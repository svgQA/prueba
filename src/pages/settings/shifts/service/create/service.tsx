import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { toast } from 'react-toastify';
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
import { FormService } from '@/services';

interface FormData {
  name: string;
  description: string;
  priority: number;
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
    let request;
    let message: string;

    if (id) {
      request = await ShiftService.updateNovelty(model, id);
      message = 'servicio editado exitosamente!';
    } else {
      request = await ShiftService.createNovelty(model);
      message = 'servicio creado exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    navigate('/memo/novelty');
  };

  const filteredOptions = schedules.value.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProjects = async () => {
    const request: any = await ShiftService.getProjects();
    projects.value = request.data;
  };

  const getPlaces = async () => {
    const request: any = await ShiftService.getPlaces();
    places.value = request.data;
  };

  const getRounds = async () => {
    const request: any = await ShiftService.getRounds();
    rounds.value = request.data;
  };

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    console.log('reponse', response);
    forms.value = response.getMany();
  };

  const getTaks = async () => {
    const request: any = await ShiftService.getTasks();
    tasks.value = request.data;
  };

  const getSchedules = async () => {
    const request: any = await ShiftService.getSchedules();
    schedules.value = request.data;
    console.log(schedules.value);
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = ['name', 'description', 'priority'] as const;

    const request: any = await ShiftService.getNoveltyById(id);
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
    <Section className='pt-2'>
      <div className='p-4 dark:bg-b-dark bg-white rounde shado border-t-4 border-cyan-500  '>
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={onSubmit}
          initialValues={initialValues.value}
          validate={(values) => {
            const errors: Partial<FormData> = {};
            if (!values.description) errors.description = 'Campo obligatorio';
            if (!values.priority) errors.description = 'Campo obligatorio';

            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/** FORMULARIO PRINCIPAL */}
              <div className='grid grid-cols-4 gap-2'>
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
                <div class='col-span-2'>
                  <Field<string> name='contractId' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Selecione Contrato...'
                        label='Contrato'
                        id='contractId'
                        name='contractId'
                        icon='252'
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
                        placeholder='Selecione lugar...'
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
                        placeholder='Selecione ronda...'
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
                <div class='col-span-2'>
                  <Field name='state'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione estado...'
                        label='Estado'
                        name='state'
                        icon='252'
                        options={[
                          { value: 'ACTIVE', label: 'Activo' },
                          { value: 'INACTIVE', label: 'Inactivo' },
                          { value: 'PENDING', label: 'Pendiente' },
                          { value: 'COMPLETED', label: 'Completado' },
                          { value: 'CANCELED', label: 'Cancelado' },
                        ]}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-4'>
                  <h3>Horarios:</h3>

                  <Field name='schedules'>
                    {({ input }) => (
                      <div className=' mr-5 ml-5'>
                        <label className='block mb-2 text-sm font-medium text-gray-700'>
                          Buscar:
                        </label>
                        <input
                          type='text'
                          value={search}
                          onChange={(e) => setSearch(e.currentTarget.value)}
                          className='block w-full px-3 py-2 mb-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          placeholder='Escribe para buscar...'
                        />
                        <select
                          {...input}
                          multiple
                          className='block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32'
                          onChange={() => {}}
                        >
                          {filteredOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {`* Horario: ${option.name}(${option.day})  horas: ${dayjs(option.hourStart).format('HH:mm')} a ${dayjs(option.hourEnd).format('HH:mm')}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Field>
                </div>
                <div class='col-span-4'>
                  <FieldArray name='overtimes'>
                    {({ fields }) => (
                      <div>
                        <h3 className='text-lg dark:text-white font-medium text-gray-900 text-center p5'>
                          Añadir extra turnos
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
                                {index + 1}) Turno extra
                              </h2>
                            </div>
                            <div className='grid grid-cols-3 gap-1'>
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
                                      label='Fecha'
                                      meta={meta}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div class='col-span-1'>
                                <Field<string>
                                  name='hourStart'
                                  required={required}
                                  parse={(value) =>
                                    value
                                      ? dayjs(
                                          `${date}T${value}:00`
                                        ).toISOString()
                                      : ''
                                  }
                                  format={(value) =>
                                    value ? dayjs(value).format('HH:mm') : ''
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
                              <div class='col-span-1'>
                                <Field<string>
                                  name='hourEnd'
                                  required={required}
                                  parse={(value) =>
                                    value
                                      ? dayjs(
                                          `${date}T${value}:00`
                                        ).toISOString()
                                      : ''
                                  }
                                  format={(value) =>
                                    value ? dayjs(value).format('HH:mm') : ''
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
                </div>
                <div class='col-span-4'>
                  <FieldArray name='tasks'>
                    {({ fields }) => (
                      <div>
                        <h3 className='text-lg dark:text-white font-medium text-gray-900 text-center p5'>
                          Añadir tareas al servicio
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
                            <div className='grid grid-cols-3 gap-1'>
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
                              <div className='col-span-3'>
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
                </div>
              </div>

              {/* Botonera */}
              <div className='flex dark:bg-b-dark-light justify-end gap-2 p-4 bg-gray-50'>
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
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
          )}
        />
      </div>
    </Section>
  );
};
