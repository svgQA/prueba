import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import dayjs from 'dayjs';
import { FormService, TaskService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';

interface FormData {
  name: string;
  description: string;
  formId: IOption;
  hourStart: string;
}

export const TaskCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const forms = useSignal<IOption[]>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    const output = {
      ...model,
      ...(model.formId && { formId: Number(model.formId.value) }),
    };

    if (id) {
      request = await TaskService.updateTask(output, id);
      message = 'Tarea editado exitosamente!';
    } else {
      request = await TaskService.createTask(output);
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
    let formId: IOption | undefined;

    if (request.getStatus()) {
      const model = request.getOne();
      if (model?.form) {
        formId = {
          value: model?.form?.id,
          label: model?.form?.title,
        };
      }
    }

    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = {
      ...model,
      formId,
    };
  };

  const getFormsHandler = async () => {
    const response = await FormService.getBasicForms();
    if (!response.getStatus()) return;
    forms.value = response.getMany();
  };

  useEffect(() => {
    Promise.all([getFormsHandler(), setInitialValues()]);
  }, []);

  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-settings-shifts'
          >
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
                    <SmartSelector
                      {...input}
                      placeholder='Seleccione formulario...'
                      label='Formulario'
                      icon='252'
                      options={forms.value}
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
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting}
                pristine={pristine}
                form='form-settings-shifts'
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
