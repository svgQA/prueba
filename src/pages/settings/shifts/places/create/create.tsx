import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required, lengthSize } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { Map } from '@/components/common/map/map';
import { useEffect, useState } from 'preact/hooks';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { omitBy, isNull, pick } from 'lodash';

interface FormData {
  code?: number;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  state?: string;
  type?: string;
  municipalityId: number;
  zipCode: number;
  countryId: number;
  radius: number;
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
  const [green, setGreen] = useState(128);
  const municipalities: Signal<SelectOption[]> = useSignal([]);
  const departmentId = useSignal<number>();
  const municipalityLocation = useSignal<ILocation>();
  const departments = useSignal<any>([]);
  const points = useSignal<any>([]);
  const countries = useSignal<any>([]);
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

  const getCountries = async () => {
    const request: any = await ShiftService.getCountries();

    countries.value = request.data;
    console.log('countries:', countries.value);
  };

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    if (!id) {
      request = await ShiftService.createPlace(model);
      message = 'Lugar creado exitosamente!';
    } else {
      request = await ShiftService.updatePlace(model, id);
      message = 'Lugar editado exitosamente!';
    }
    if (!request.getStatus()) return;

    toast.success(message, {
      position: 'top-right',
    });

    navigate('/rounds/places');
  };

  const onChangeDeparment = async (deparmentId: string) => {
    await fetchMunicipalities(deparmentId + '');
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
    if (!id) return;
    const userKeys = [
      'code',
      'name',
      'description',
      'address',
      'latitude',
      'longitude',
      'state',
      'type',
      'countryId',
      'zipCode',
      'municipalityId',
    ] as const;

    const request: any = await ShiftService.getPlaceById(id);
    departmentId.value = request.model.municipality.departmentId;
    await onChangeDeparment(`${departmentId}`);
    const model = pick(omitBy(request.model, isNull), userKeys);
    points.value = [
      { id: 1, position: { lat: model.latitude, lng: model.longitude } },
    ];
    municipalityLocation.value = { lat: model.latitude, lng: model.longitude };
    initialValues.value = model;
  };

  useEffect(() => {
    setInitialValues();
    fetchDepartments();
    getCountries();
  }, []);

  return (
    <Section className='pt-2'>
      <div className='p-4 dark:bg-b-dark bg-white rounde shado border-t-4 border-cyan-500  '>
        <Form
          onSubmit={onSubmit}
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
                <div class='col-span-2'>
                  <Field<string> name='countryId' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        placeholder='Selecione país...'
                        label='País'
                        name='countryId'
                        icon='252'
                        optionValue='id'
                        optionLabel='name'
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
                        options={countries.value}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Field name='zipCode'>
                    {({ input }) => (
                      <Input
                        id='input-code'
                        {...input}
                        placeholder='Ingrese un código ZIP..'
                        label='Código ZIP'
                        type='number'
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Select
                    value={departmentId.value}
                    placeholder='Seleccione Departamento...'
                    id='departmentId'
                    label='Departamento'
                    name='departmentId'
                    icon='252'
                    optionValue='id'
                    optionLabel='name'
                    options={departments.value}
                    onChange={(e) => {
                      const id = e.currentTarget.value;
                      onChangeDeparment(id);
                    }}
                  />
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
                  <Field<string> name='latitude'>
                    {({ input }) => (
                      <Input {...input} label='Latitud' type='text' disabled />
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Field<string> name='longitude'>
                    {({ input }) => (
                      <Input {...input} label='Longitud' type='text' disabled />
                    )}
                  </Field>
                </div>
              </div>
              <div className='flex items-center space-x-4 p-4'>
                <input
                  type='range'
                  min='0'
                  max='255'
                  step='1'
                  value={green}
                  onChange={(e) => setGreen(Number(e.currentTarget.value))}
                  className='w-full accent-green-500'
                />
                <input
                  type='number'
                  value={green}
                  onChange={(e) => setGreen(Number(e.currentTarget.value))}
                  className='w-20 border border-gray-300 rounded p-1 text-center'
                />
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
