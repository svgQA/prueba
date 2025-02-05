import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import dayjs from 'dayjs';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { IProject } from '../../projects/projects';
import { Place } from '../../places/utils/places';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  state: string;
  priority: string;
  keywords: string[];
}

export const ActivityCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const inputKeywords = useSignal('');
  const projects: Signal<IProject[]> = useSignal([]);
  const places: Signal<Place[]> = useSignal([]);
  const rounds = useSignal([]);

  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    const { startDate, endDate } = model;
    let request;
    let message: string;

    if (startDate) model.startDate = dayjs(startDate).toISOString();
    if (endDate) model.endDate = dayjs(endDate).toISOString();

    if (id) {
      request = await ShiftService.updateProject(model, id);
      message = 'Lugar editado exitosamente!';
    } else {
      request = await ShiftService.createProject(model);
      message = 'Lugar creado exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    navigate('/rounds/projects');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = [
      'name',
      'description',
      'startDate',
      'endDate',
      'state',
      'priority',
    ] as const;

    const request: any = await ShiftService.getProject(id);
    const { startDate, endDate } = request.model;
    const model = pick(omitBy(request.model, isNull), userKeys);
    if (startDate)
      model.startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm');
    if (endDate) model.endDate = dayjs(endDate).format('YYYY-MM-DD HH:mm');

    initialValues.value = model;
  };

  const getProjects = async () => {
    const request: any = await ShiftService.getProjects();
    projects.value = request.data;
  };

  const getPlaces = async (projectId: number) => {
    const request: any = await ShiftService.getPlaces({
      page: 1,
      items: 30,
      projectId,
    });
    places.value = request.data;
  };

  const getRounds = async (placeId: number) => {
    const request: any = await ShiftService.getRounds({
      page: 1,
      items: 30,
      placeId,
    });
    rounds.value = request.data;
  };
  const main = async () => {
    await getProjects();
  };

  useEffect(() => {
    main();
    setInitialValues();
  }, []);
  return (
    <Section className='pt-2'>
      <div className='p-4 dark:bg-b-dark bg-white rounded-lg shadow-xl  border-t-4 border-cyan-500  '>
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
                  <Field<string> name='startDate' validate={required}>
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
                  <Field<string> name='endDate' validate={required}>
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
                  <Field<string> name='userId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione usuario...'
                        label='Usuario'
                        name='userId'
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
                  <Field name='projectId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione proyecto...'
                        label='Proyecto'
                        name='projectId'
                        icon='252'
                        optionValue='id'
                        optionLabel='name'
                        options={projects.value}
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                          getPlaces(id);
                        }}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<string> name='placeId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione lugar...'
                        label='Lugar'
                        name='placeId'
                        optionValue='id'
                        optionLabel='name'
                        icon='252'
                        options={places.value}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<string> name='workstationId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione punto de trabajo...'
                        label='Punto de trabajo'
                        name='workstationId'
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
                  <Field<string> name='roundId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione ronda...'
                        label='Ronda'
                        name='roundId'
                        icon='252'
                        options={rounds.value}
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
                <div class='col-span-1'>
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
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
        {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
      </div>
    </Section>
  );
};
