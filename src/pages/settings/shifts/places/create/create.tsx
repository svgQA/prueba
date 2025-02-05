import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required, lengthSize } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { Map } from '@/components/common/map/map';
import { useEffect } from 'preact/hooks';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { omitBy, isNull, pick } from 'lodash';

interface Workstation {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
}

interface FormData {
  code?: number;
  name: string;
  description: string;
  address: string;
  latitude?: string;
  longitude?: string;
  state?: string;
  type?: string;
  municipalityId: number;
  projectId: number;
  workstations?: Workstation[];
}

interface SelectOption {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

interface ILocation {
  lat: number;
  lng: number;
}

export const PlaceCreateSettingPage: FunctionComponent = () => {
  const municipalities: Signal<SelectOption[]> = useSignal([]);
  const projects = useSignal([]);
  const municipalityLocation = useSignal<ILocation>();
  const departments = useSignal<any>([]);
  const points = useSignal<any>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});

  // const [points, setPoint] = useState<{ id: number; position: any }[]>([]);
  const { id } = useParams(); // Obtiene el id de la URL

  const [_, navigate] = useLocation();

  const sendPointsRef = (data: any) => {
    console.log('data', data);
    if (!data.length) return;
    const { lat, lng } = data[0].position;
    points.value = data;
    // setPoint(data);
    municipalityLocation.value = { lat, lng };
    return { lat, lng };
  };

  const fetchMunicipalities = async (deparmentId: string) => {
    const request: any = await ShiftService.getMunicipalities(deparmentId);
    municipalities.value = request.data;
    console.log('departments:', municipalities.value);
  };

  const fetchDepartments = async () => {
    const request: any = await ShiftService.getDepartments();

    departments.value = request.data;
    console.log('departments:', departments.value);
  };

  const fetchProjects = async () => {
    const request: any = await ShiftService.getProjects();
    projects.value = request.data;
  };

  const onSubmit = async (model: FormData) => {
    const request = await ShiftService.createPlace(model);
    if (!request.getStatus()) return;

    toast.success('Lugar creado exitosamente!', {
      position: 'top-right',
    });

    navigate('/rounds/places');
  };

  const onChangeDeparment = (deparmentId: string) => {
    fetchMunicipalities(deparmentId + '');
  };

  const setPosition = (municipalityId: number) => {
    const municipality = municipalities.value.find(
      (item) => item.id === municipalityId
    );
    console.log(municipality);

    if (!municipality?.latitude) return;
    const lat = parseFloat(municipality.latitude.replace(',', '.'));
    const lng = parseFloat(municipality.longitude.replace(',', '.'));
    //setPoint([{ id: 1, position: { lat, lng } }]);
    points.value = [{ id: 1, position: { lat, lng } }];
    municipalityLocation.value = { lat, lng };
  };

  const setInitialValues = async () => {
    if (!id) {
      initialValues.value = {
        workstations: [],
      };
    } else {
      const userKeys = [
        'code',
        'name',
        'description',
        'address',
        'latitude',
        'longitude',
        'state',
        'type',
        'municipalityId',
        'projectId',
        'workstations',
      ] as const;

      const request: any = await ShiftService.getPlaceById(id);
      const model = pick(omitBy(request.model, isNull), userKeys);
      initialValues.value = model;
    }
  };

  useEffect(() => {
    setInitialValues();
    fetchDepartments();
    fetchProjects();
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
          validate={(values) => {
            const errors: Partial<FormData> = {};
            if (!values.name) errors.name = 'Campo obligatorio';
            if (!values.description) errors.description = 'Campo obligatorio';
            if (!values.address) errors.address = 'Required';
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/** FORMULARIO PRINCIPAL */}
              <div className='grid grid-cols-4 gap-3'>
                <div class='col-span-1'>
                  <Field
                    name='code'
                    parse={(value) => (value ? Number(value) : undefined)}
                  >
                    {({ input }) => (
                      <Input
                        id='input-code'
                        {...input}
                        placeholder='Ingrese un codigo...'
                        label='Codigo'
                        type='number'
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-3'>
                  <Field<string> name='name' validate={lengthSize(3, 30)}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Ingrese nombre...'
                        label='Nombre'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-4'>
                  <Field<string>
                    name='description'
                    validate={lengthSize(3, 250)}
                  >
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

                <div class='col-span-1'>
                  <Field name='type'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione tipo...'
                        label='Tipo'
                        name='type'
                        icon='252'
                        options={[
                          { value: 'INDUSTRIAL', label: 'Industrial' },
                          { value: 'RESIDENTIAL', label: 'Residencial' },
                          { value: 'OTHER', label: 'Otro' },
                        ]}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
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
                          { value: 'UNCER_REVIEW', label: 'Revisión' },
                        ]}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Field<string> name='projectId' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Selecione Proyecto...'
                        label='Proyecto'
                        name='projectId'
                        icon='252'
                        options={projects.value}
                        meta={meta}
                        onChange={(e) => {
                          input.onChange(parseInt(e.currentTarget.value));
                        }}
                        optionValue='id'
                        optionLabel='name'
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-2'>
                  <Field name='departmentId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione Departamento...'
                        id='departmentId'
                        label='Departamento'
                        name='departmentId'
                        icon='252'
                        optionValue='id'
                        optionLabel='name'
                        options={departments.value}
                        // onChange={onChangeDeparment}
                        onChange={(e) => {
                          const id = e.currentTarget.value;
                          input.onChange(id);
                          onChangeDeparment(id);
                        }}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Field<string> name='municipalityId' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Selecione Municipio...'
                        label='Municipio'
                        id='municipalityId'
                        name='municipalityId'
                        icon='252'
                        optionValue='id'
                        optionLabel='name'
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                          setPosition(id);
                        }}
                        options={municipalities.value}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-2'>
                  <Field<string> name='address' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Ingrese Dirección...'
                        label='Dirección'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<string> name='latitude'>
                    {({ input }) => (
                      <Input {...input} label='Latitud' type='text' disabled />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<string> name='longitude'>
                    {({ input }) => (
                      <Input {...input} label='Longitud' type='text' disabled />
                    )}
                  </Field>
                </div>
              </div>

              <Map
                name='Map'
                pointsAmount={1}
                sendPoints={(data) => {
                  const result = sendPointsRef(data);
                  form.change('latitude', result?.lat);
                  form.change('longitude', result?.lng);
                }}
                pointsRef={points.value}
                center={municipalityLocation.value}
                condition={false}
                errorCondition=''
                radialPoint={null}
                errorRadialPoint=''
                draggable={true}
                width='100%'
                clickPoint={() => {}}
              />
              {/** PUNTOS DE TRABAJO */}

              <FieldArray name='workstations'>
                {({ fields }) => (
                  <div>
                    <h3 className='text-lg dark:text-white font-medium text-gray-900 text-center p5'>
                      Añadir puestos de trabajo
                      <Button
                        icon='044'
                        rounded
                        id='menu-btn'
                        name='menu'
                        type='button'
                        color='text-primary'
                        onClick={() =>
                          fields.push({
                            name: '',
                            description: '',
                            latitude: '',
                            longitude: '',
                          })
                        }
                      />
                    </h3>
                    {fields.map((name, index) => (
                      <div
                        key={index}
                        className='rounded-lg shadow p-2 border-2'
                      >
                        <div className='bg-gray-100 dark:bg-b-dark-light p-3 text-center'>
                          <h2 className='text-xl font-semibold '>
                            Puesto {index + 1}
                          </h2>
                        </div>
                        <div className='grid grid-cols-3 gap-3'>
                          <div className='col-span-1'>
                            <Field<string>
                              name={`${name}.name`}
                              validate={required}
                            >
                              {({ input, meta }) => (
                                <Input
                                  {...input}
                                  placeholder='Ingrese nombre...'
                                  label='Puesto'
                                  type='text'
                                  meta={meta}
                                />
                              )}
                            </Field>
                          </div>
                          <div className='col-span-1'>
                            <Field<string>
                              name={`${name}.latitude`}
                              validate={required}
                            >
                              {({ input, meta }) => (
                                <Input
                                  {...input}
                                  placeholder='Ingrese latitud...'
                                  label='Latitud'
                                  type='text'
                                  meta={meta}
                                />
                              )}
                            </Field>
                          </div>
                          <div className='col-span-1'>
                            <Field<string>
                              name={`${name}.longitude`}
                              validate={required}
                            >
                              {({ input, meta }) => (
                                <Input
                                  {...input}
                                  placeholder='Ingrese longitud...'
                                  label='Longitud'
                                  type='text'
                                  meta={meta}
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

              {/* Botonera */}
              <div className='flex dark:bg-b-dark-light justify-end gap-2 p-4 bg-gray-50'>
                <Button
                  id='btn-clean'
                  name='btn-clean'
                  type='button'
                  label='Limpiar'
                  onClick={form.reset}
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
              {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
            </form>
          )}
        />
      </div>
    </Section>
  );
};
