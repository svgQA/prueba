import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import dayjs from 'dayjs';
import { FormService, TaskService } from '@/services';
import { IFormResponse } from '@/types/form';

interface FormData {
  description: string;
  status: number;
  start: string;
}

export const TaskCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const forms = useSignal<IFormResponse[]>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    if (id) {
      request = await TaskService.updateTask(model, id);
      message = 'Tarea editado exitosamente!';
    } else {
      request = await TaskService.createTask(model);
      message = 'Tarea creado exitosamente!';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/rounds/task');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = ['status', 'formId', 'description', 'start'] as const;

    const request: any = await TaskService.getTaskById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);

    initialValues.value = model;
  };

  const getFormsHandler = async () => {
    const response = await FormService.get_all();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  useEffect(() => {
    getFormsHandler();
    setInitialValues();
  }, []);
  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<FormData> = {};
          if (!values.description) errors.description = 'Campo obligatorio';

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-3 gap-3'>
              <div class='col-span-1'>
                <Field name='status'>
                  {({ input }) => (
                    <Select
                      {...input}
                      placeholder='Selecione estado...'
                      label='Estado'
                      name='status'
                      icon='252'
                      options={[
                        { value: 'CREATED', label: 'Creado' },
                        { value: 'RESOLVED', label: 'Resuelto' },
                        { value: 'CLOSED', label: 'Cerrado' },
                      ]}
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
                        const id = parseInt(e.currentTarget.value);
                        input.onChange(id);
                      }}
                    />
                  )}
                </Field>
              </div>

              <div class='col-span-1'>
                <Field<string>
                  name='start'
                  parse={(value) => (value ? dayjs(value).toISOString() : '')}
                  format={(value) =>
                    value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                  }
                >
                  {({ input }) => (
                    <Input
                      {...input}
                      type='datetime-local'
                      label='Fecha inicio'
                    />
                  )}
                </Field>
              </div>
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
    </Section>
  );
};
