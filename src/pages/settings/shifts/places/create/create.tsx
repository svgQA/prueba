import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required, lengthSize } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Section } from '@/components/common/section/section';
import { useEffect, useState } from 'preact/hooks';
import { useLocation, useParams } from 'wouter';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { PlaceService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { Slider } from '@/components/common/slider/slider';
import { composeValidators, validateNumber } from '@/utils/validators';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';

interface SelectOption extends IOption {
  latitude: string;
  longitude: string;
}
interface FormData {
  code?: number;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  state?: string;
  type?: string;
  zipCode: number;
  municipalityId: SelectOption;
  countryId: IOption;
  departmentId: IOption;
  radius: number;
}

interface ILocation {
  lat: number;
  lng: number;
}

export const PlaceCreateSettingPage: FunctionComponent = () => {
  const [green, setGreen] = useState(0);
  const departments = useSignal<IOption[]>([]);
  const municipalities = useSignal<SelectOption[]>([]);
  const countries = useSignal<IOption[]>([]);

  const municipalityLocation = useSignal<ILocation>();
  const points = useSignal<any>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});

  const { id } = useParams(); // Obtiene el id de la URL
  const [_, navigate] = useLocation();

  const sendPointsRef = (data: any) => {
    if (!data.length) return;
    const { lat, lng } = data[0].position;
    points.value = data;
    municipalityLocation.value = { lat, lng };
    return { lat, lng };
  };

  const fetchMunicipalities = async (departmentId: number) => {
    const request =
      await PlaceService.getMunicipalitieList<SelectOption>(departmentId);
    if (!request.getStatus()) return;
    const options = request.getMany();
    municipalities.value = options;
  };

  const fetchDepartments = async (countryId: number) => {
    const request = await PlaceService.getDepartmentList(countryId);
    if (!request.getStatus()) return;
    departments.value = request.getMany();
  };

  const getCountries = async () => {
    const request = await PlaceService.getCountriesList();
    if (!request.getStatus()) return;
    countries.value = request.getMany();
  };

  const onSubmit = async (model: FormData) => {
    const data = {
      name: model.name,
      address: model.address,
      latitude: model.latitude,
      longitude: model.longitude,
      state: model.state,
      radius: green,
      countryId: Number(model.countryId.value),
      departmentId: Number(model.departmentId.value),
      municipalityId: Number(model.municipalityId.value),
      ...(model.description == '' ? {} : { description: model.description }),
      code: Number(model.code),
    };

    let request: any;
    if (!id) {
      request = await PlaceService.createPlace(data);
    } else {
      request = await PlaceService.updatePlace(data, id);
    }
    if (!request.getStatus()) return;

    ToastManager.success('Accion con exito');
    navigate('/rounds/places');
  };

  const onChangeDeparment = async (departmentId: number) => {
    await fetchMunicipalities(departmentId);
    // Resetear la ubicación cuando cambia el departamento
    points.value = [];
    municipalityLocation.value = undefined;
  };

  const setPosition = (municipalityId: number) => {
    const municipality = municipalities.value.find(
      (item) => item.value === municipalityId
    );

    if (!municipality?.latitude || !municipality?.longitude) return;
    const lat = Number(municipality.latitude.replace(',', '.'));
    const lng = Number(municipality.longitude.replace(',', '.'));

    const modelLat = {
      lat: lat,
      lng: lng,
    };

    points.value = [{ id: 1, position: modelLat }];
    municipalityLocation.value = modelLat;
  };

  const setInitialValues = async () => {
    if (!id) return;

    const request = await PlaceService.getPlaceById(id);
    let municipalityId = {
      value: 0,
      label: 'Seleccione un municipio',
      latitude: 0,
      longitude: 0,
    };
    let departmentId = {
      value: 0,
      label: 'Seleccione un departamento',
    };

    let countryId = {
      value: 0,
      label: 'Seleccione un país',
    };

    if (request.getStatus()) {
      const model = request.getOne();
      municipalityId = {
        value: model?.municipalityId,
        label: model?.municipality?.name,
        latitude: model?.municipality?.latitude,
        longitude: model?.municipality?.longitude,
      };

      departmentId = {
        value: model?.municipality?.department.id,
        label: model?.municipality?.department?.name,
      };

      countryId = {
        value: model?.country?.id,
        label: model?.country?.name,
      };

      setGreen(model?.radius || 0);
      points.value = [
        {
          id: 1,
          position: {
            lat: model?.latitude,
            lng: model?.longitude,
          },
        },
      ];
      municipalityLocation.value = {
        lat: model?.latitude,
        lng: model?.longitude,
      };
      initialValues.value = {
        ...model,
        municipalityId,
        departmentId,
        countryId,
      };
    }
  };

  const changeValue = (latitude: number, longitude: number) => {
    sendPointsRef([{ id: 1, position: { lat: latitude, lng: longitude } }]);
  };

  useEffect(() => {
    Promise.all([setInitialValues(), fetchDepartments(1), getCountries()]);
  }, []);

  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-2'
            id='form-place-create'
          >
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
              {/* Información Básica */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Información Básica
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <Field<string>
                      name='code'
                      validate={composeValidators(required, validateNumber)}
                    >
                      {({ input, meta }) => (
                        <Input
                          id='input-code'
                          {...input}
                          placeholder='Ingrese un codigo...'
                          label='Codigo'
                          type='number'
                          icon='123'
                          meta={meta}
                        />
                      )}
                    </Field>

                    <Field<string>
                      name='name'
                      validate={composeValidators(required, lengthSize(3, 30))}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='Ingrese nombre...'
                          label='Nombre'
                          icon='123'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        min='3'
                        max='300'
                        placeholder='Ingrese Descripción...'
                        label='Descripción'
                        type='text'
                        icon='123'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de Ubicación */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Información de Ubicación
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <Field<string> name='type' validate={required}>
                      {({ input, meta }) => (
                        <Select
                          {...input}
                          placeholder='Selecione tipo...'
                          label='Tipo'
                          name='type'
                          icon='123'
                          options={[
                            { value: 'INDUSTRIAL', label: 'Industrial' },
                            { value: 'RESIDENTIAL', label: 'Residencial' },
                            { value: 'OTHER', label: 'Otro' },
                          ]}
                          meta={meta}
                        />
                      )}
                    </Field>

                    <Field<string> name='state' validate={required}>
                      {({ input, meta }) => (
                        <Select
                          {...input}
                          placeholder='Selecione estado...'
                          label='Estado'
                          name='state'
                          icon='123'
                          options={[
                            { value: 'ACTIVE', label: 'Activo' },
                            { value: 'INACTIVE', label: 'Inactivo' },
                            { value: 'UNCER_REVIEW', label: 'Revisión' },
                          ]}
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <Field<string> name='address' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Ingrese Dirección...'
                        label='Dirección'
                        type='text'
                        icon='123'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Información de País y Departamento */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Información de País y Departamento
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='grid grid-cols-1 xl:grid-cols-2 gap-3'>
                    <Field<IOption> name='countryId' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Selecione país...'
                          label='País'
                          icon='123'
                          options={countries.value}
                          meta={meta}
                        />
                      )}
                    </Field>

                    <Field<IOption> name='departmentId' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Seleccione Departamento...'
                          label='Departamento'
                          icon='123'
                          options={departments.value}
                          onChange={(e) => {
                            if (e?.value) {
                              onChangeDeparment(Number(e.value));
                            }
                            input.onChange(e);
                          }}
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <div className='grid grid-cols-1 xl:grid-cols-2 gap-3'>
                    <Field<string> name='municipalityId' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Seleccione Municipio...'
                          label='Municipio'
                          icon='123'
                          options={municipalities.value}
                          meta={meta}
                          onChange={(e) => {
                            if (e?.value) {
                              setPosition(Number(e.value));
                            }
                            input.onChange(e);
                          }}
                        />
                      )}
                    </Field>

                    <Field<number> name='zipCode' validate={required}>
                      {({ input, meta }) => (
                        <Input<number>
                          id='input-code'
                          {...input}
                          placeholder='Ingrese un código ZIP...'
                          label='Código ZIP'
                          icon='123'
                          type='number'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              {/* Coordenadas y Radio */}
              <div className='bg-b-light-light dark:bg-b-dark-light p-4 rounded-lg shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b border-b-light dark:border-b-dark pb-2'>
                  Coordenadas y Radio
                </h3>
                <div className='grid grid-cols-1 gap-4'>
                  <Slider
                    min={0}
                    max={2000}
                    step={1}
                    value={green}
                    onChange={setGreen}
                    label='Radio de cobertura'
                    showValue={true}
                    disabled={!points.value || points.value.length < 1}
                  />
                  <div className='grid grid-cols-1 xl:grid-cols-2 gap-3'>
                    <Field<string> name='latitude' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='Latitud'
                          type='text'
                          meta={meta}
                          onChange={(e) => {
                            input.onChange(e);
                            const longitude = form.getFieldState('longitude')?.value;
                            changeValue(Number(e.currentTarget.value), Number(longitude) || 0);
                          }}
                        />
                      )}
                    </Field>
                    <Field<string> name='longitude' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='Longitud'
                          type='text'
                          meta={meta}
                          onChange={(e) => {
                            input.onChange(e);
                            const latitude = form.getFieldState('latitude')?.value;
                            changeValue(Number(latitude) || 0, Number(e.currentTarget.value));
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            <MapLibrePointsMap
              name='map-points'
              pointsAmount={1}
              sendPoints={(data) => {
                const result = sendPointsRef(data);
                if (result) {
                  form.change('latitude', result.lat);
                  form.change('longitude', result.lng);
                }
              }}
              pointsRef={points.value}
              center={municipalityLocation.value}
              condition={false}
              errorCondition=''
              radialPoint={null}
              errorRadialPoint=''
              radius={green}
              draggable={true}
              width='100%'
              clickPoint={() => {}}
              key={
                municipalityLocation.value
                  ? `${municipalityLocation.value.lat}-${municipalityLocation.value.lng}`
                  : 'initial'
              }
            />

            {/* Botonera Convertir esto en un componente */}
            <div className='w-full flex-row flex justify-between items-center'>
              <StatusButton
                onClickClean={() => {
                  form.reset();
                  setGreen(0);
                  points.value = [];
                  municipalityLocation.value = undefined;
                }}
                submitting={submitting}
                pristine={pristine}
                form='form-place-create'
                label={id ? 'Editar' : 'Guardar'}
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
