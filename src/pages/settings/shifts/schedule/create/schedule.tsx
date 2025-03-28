import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import WeeklyScheduler from '../components/weekly.scheduler';

interface FormData {
  name: string;
  day: string;
  hourEnd: string;
  hourStart: string;
}

export const ScheduleCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL

  // Estado compartido para las celdas seleccionadas
  const selectedCells = useSignal<{ [key: string]: boolean }>({})

  // Función para limpiar la selección - EXACTAMENTE LA MISMA que usará el botón interno
  const handleClearSelection = () => {
    selectedCells.value = {}
  }

  // Función para actualizar las celdas seleccionadas
  const handleCellChange = (newCells: { [key: string]: boolean }) => {
    selectedCells.value = newCells
  }

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    if (id) {
      request = await ShiftService.updateSchedule(model, id);
      message = 'Horario editado exitosamente!';
    } else {
      request = await ShiftService.createSchedule(model);
      message = 'Horario creado exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    navigate('/rounds/schedule');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = ['name', 'day', 'hourStart', 'hourEnd'] as const;

    const request: any = await ShiftService.getScheduleById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);

    initialValues.value = model;
  };

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<FormData> = {};

          if (!values.hourStart) errors.hourStart = 'Campo obligatorio';
          if (!values.hourEnd) errors.hourEnd = 'Campo obligatorio';

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-1 gap-3'>
              <div class='col-span-1'>
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
              <div class='col-span-1'>
                <WeeklyScheduler
                  startHour={0}
                  endHour={24}
                  title='Selecciona un horario'
                  clearSelection={false}
                  selectedCells={selectedCells.value}
                  onClearSelection={handleClearSelection}
                  onCellChange={handleCellChange}
                />
              </div>
            </div>

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              {/* Botón de prueba que SOLO llama a handleClearSelection */}
              <button
                type="button"
                className="px-4 py-2 border border-b-1 rounded-md mr-4 text-primary"
                onClick={() => {
                  handleClearSelection()
                  form.reset()
                }}
              >
                Limpiar
              </button>

              {/* <Button
                id='btn-clean'
                name='btn-clean'
                type='button'
                label='Limpiar'
                onClick={() => {
                  handleClearSelection()
                  form.reset()
                }}
                disabled={submitting || pristine}
                border={true}
                className="rounded-md px-4 py-2"
              /> */}

              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label={id ? 'Editar' : 'Guardar'}
                className="rounded-md bg-primary text-white px-4 py-2"
                disabled={submitting}
              />
            </div>
            {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
          </form>
        )}
      />
    </Section>
  );
};

