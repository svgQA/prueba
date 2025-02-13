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
  const date = dayjs().format('YYYY-MM-DD');

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
    <Section className='pt-2'>
      <div className='p-4 dark:bg-b-dark bg-white rounded-lg shadow-xl  border-t-4 border-cyan-500  '>
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
              <div className='grid grid-cols-2 gap-3'>
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
                  <Field<string> validate={required} name='day'>
                    {({ input, meta }) => {
                      return (
                        <div>
                          <Select
                            {...input}
                            meta={meta}
                            placeholder='Selecione dia...'
                            label='Dia'
                            name='day'
                            icon='252'
                            options={[
                              { value: 'MONDAY', label: 'Lunes' },
                              { value: 'TUESDAY', label: 'Martes' },
                              { value: 'WEDNESDAY', label: 'Miercoles' },
                              { value: 'THURSDAY', label: 'Jueves' },
                              { value: 'FRIDAY', label: 'Viernes' },
                              { value: 'SATURDAY', label: 'Sabado' },
                              { value: 'SUNDAY', label: 'Domindo' },
                            ]}
                          />
                        </div>
                      );
                    }}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string>
                    name='hourStart'
                    required={required}
                    parse={(value) =>
                      value ? dayjs(`${date}T${value}:00`).toISOString() : ''
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
                      value ? dayjs(`${date}T${value}:00`).toISOString() : ''
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
              {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
            </form>
          )}
        />
      </div>
    </Section>
  );
};
