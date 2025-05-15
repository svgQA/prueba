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
  name: string;
  description: string;
  formId: number;
  hourStart: string;
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

    const userKeys = ['name', 'formId', 'description', 'hourStart'] as const;

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
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-3 gap-3'>
              <div class='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder='Ingrese nombre...'
                      label='Nombre'
                      meta={meta}
                      name='name'
                      type='text'
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-1'>
                <Field name='formId'>
                  {({ input }) => (
                    <Select
                      {...input}
                      placeholder='Seleccione formulario...'
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
                <Field<string> name='hourStart' validate={required}>
                  {({ input, meta }) => {
                    let timeValue = '';
                    if (input.value) {
                      timeValue = dayjs(input.value).format('HH:mm');
                    }
                    return (
                      <Input
                        {...input}
                        type='time'
                        id='task-start'
                        label='Hora inicio'
                        meta={meta}
                        value={timeValue}
                        onChange={(e) => {
                          const time = (e.target as HTMLInputElement).value;
                          const [hours, minutes] = time.split(':');
                          const date = dayjs()
                            .hour(parseInt(hours))
                            .minute(parseInt(minutes))
                            .second(0)
                            .millisecond(0);
                          input.onChange(date.toISOString());
                        }}
                      />
                    );
                  }}
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
