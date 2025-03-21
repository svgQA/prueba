import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { ShiftService } from '@/services/shift';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { UserService } from '@/services/user';
import dayjs from 'dayjs';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  state: string;
  priority: string;
  clientId: number;
}

export const ProjectCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  const users = useSignal([]);

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

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

  const getUsers = async () => {
    const request: any = await UserService.get_all();
    users.value = request.data.map((user: any) => {
      return { ...user, fullname: `${user.name} ${user.surname}` };
    });
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
      'clientId',
    ] as const;

    const request: any = await ShiftService.getProject(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };

  useEffect(() => {
    getUsers();
    setInitialValues();
  }, []);
  return (
    <Section className='pt-2'>
      <div>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues.value}
          validate={(values) => {
            const errors: Partial<FormData> = {};
            if (!values.name) errors.name = 'Campo obligatorio';
            if (!values.description) errors.description = 'Campo obligatorio';
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
                  <Field<string> name='clientId' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        meta={meta}
                        placeholder='Selecione cliente...'
                        label='Cliente'
                        name='Cliente'
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
                <div class='col-span-2'>
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

                <div class='col-span-1'>
                  <Field name='priority'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione prioridad...'
                        label='Prioridad'
                        name='priority'
                        icon='252'
                        options={[
                          { value: 'HIGH', label: 'Alta' },
                          { value: 'MEDIUM', label: 'Media' },
                          { value: 'LOW', label: 'Baja' },
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
                          { value: 'IN_PROGRESS', label: 'En progreso' },
                          { value: 'COMPLETED', label: 'Compleado' },
                          { value: 'PENDING', label: 'Pendiente' },
                        ]}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string>
                    name='startDate'
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
                    name='endDate'
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
      </div>
    </Section>
  );
};
