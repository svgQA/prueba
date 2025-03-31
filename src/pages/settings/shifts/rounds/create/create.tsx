import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
// import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { Map } from '@/components/common/map/map';
import { useEffect } from 'preact/hooks';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { omitBy, isNull, pick } from 'lodash';
import arrayMutators from 'final-form-arrays';
// import { FieldArray } from 'react-final-form-arrays';
// import { IFormResponse } from '@/types/form';
// import { TextArea } from '@/components/common/text.area/text.area';
// import dayjs from 'dayjs';

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
  longitude: string;
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

  // const [points, setPoint] = useState<{ id: number; position: any }[]>([]);
  const { id } = useParams(); // Obtiene el id de la URL

  const [_, navigate] = useLocation();

  const sendPointsRef = (data: any) => {
    console.log('data ==>', data);
    if (!data.length) return;
    const { lat, lng } = data[0].position;
    points.value = data;
    currentLocation.value = { lat, lng };
    return { lat, lng };
  };

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;
    if (!points.value.length) {
      return toast.warning('Ingrese puntos en el mapa', {
        position: 'top-right',
      });
    } else {
      model.points = points.value.map(
        (poin: { id: number; position: { lat: number; lng: number } }) => {
          return {
            latitude: poin.position.lat,
            longitude: poin.position.lng,
          };
        }
      );
    }
    if (id) {
      request = await ShiftService.updateRound(model, id);
      message = 'Ronda editada exitosamente!';
    } else {
      request = await ShiftService.createRound(model);
      message = 'Ronda creada exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });

    navigate('/rounds');
  };

  // const setPosition = (placeId: number) => {
  //   const place = places.value.find((val: any) => val.id === placeId);
  //   currentLocation.value = {
  //     lat: place.latitude,
  //     lng: place.longitude,
  //   };
  // };

  const setInitialValues = async () => {
    if (!id) return;
    let count = 0;
    const userKeys = ['name', 'frequency', 'placeId'] as const;
    const request: any = await ShiftService.getRoundById(id);
    points.value =
      request.model.points.map((point: any) => {
        count++;
        return {
          id: count,
          position: {
            lat: point.latitude,
            lng: point.longitude,
          },
        };
      }) ?? [];

    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };

  const getPlaces = async () => {
    const request: any = await ShiftService.getPlaces();
    places.value = request.data;
  };

  const resertMarket = async () => {
    console.log('resertMarket');
    points.value = [];
  };

  const created = async () => {
    await getPlaces();
    await setInitialValues();
  };

  useEffect(() => {
    created();
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
          <form onSubmit={handleSubmit} className='space-y-6'>
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
                        label='Nombre'
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
                        label='Descripción'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* Latitud y Longitud */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Field<string> name='latitude'>
                      {({ input }) => (
                        <Input
                          {...input}
                          label='Latitud'
                          type='text'
                          disabled
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Field<string> name='longitude'>
                      {({ input }) => (
                        <Input
                          {...input}
                          label='Longitud'
                          type='text'
                          disabled
                        />
                      )}
                    </Field>
                  </div>
                </div>

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
                        label='Frecuencia'
                        type='number'
                      />
                    )}
                  </Field>
                </div>

                {/* Instrucciones */}
                <div className='mt-6 border rounded-md p-4 bg-primary-opacity'>
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
              </div>

              <div>
                <Map
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
                />
              </div>
            </div>

            {/* <div class='col-span-2'>
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
                          setPosition(id);
                        }}
                        options={places.value}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <h3>Cordenadas del lugar</h3>
                  <label for='fname'>Latitud: </label>
                  {currentLocation.value?.lat}
                  <br />
                  <label for='lname'>Longitud: </label>
                  {currentLocation.value?.lng}
                </div> */}

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              <Button
                id='btn-clean'
                name='btn-clean'
                type='button'
                label='Limpiar'
                onClick={() => {
                  form.reset();
                  resertMarket();
                }}
                border={true}
                className='rounded-md px-4 py-2 hover:bg-primary-opacity  hover:text-primary'
              />

              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label={id ? 'Editar' : 'Guardar'}
                className='rounded-md bg-primary text-white px-4 py-2 hover:bg-primary-opacity  hover:text-primary'
                disabled={submitting}
              />
            </div>
            {/* {<pre>{JSON.stringify(values, 0, 2)}</pre>} */}
          </form>
        )}
      />
    </Section>
  );
};
