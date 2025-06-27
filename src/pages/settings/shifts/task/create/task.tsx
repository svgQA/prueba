import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
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
  attachmentType: IOption;
  taskType: IOption;
}

const ATTACHMENT_TYPES = [
  'DOCUMENT',
  'AUDIO',
  'VIDEO',
  'PHOTO',
  'GENERAL',
  'FORMS',
] as const;
const ATTACHMENT_OPTIONS: IOption[] = ATTACHMENT_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0) + t.slice(1).toLowerCase(),
}));

const TASK_TYPES = ['GENERAL', 'REPORT'] as const;
const TASK_TYPE_OPTIONS: IOption[] = TASK_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0) + t.slice(1).toLowerCase(),
}));

export const TaskCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const forms = useSignal<IOption[]>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (model: FormData) => {
    const output: any = {
      name: model.name,
      description: model.description,
      type: model.taskType.value as string,
    };
    if (model.taskType.value === 'GENERAL') {
      output.formId = Number(model.formId.value);
      output.hourStart = model.hourStart;
    } else if (model.taskType.value === 'REPORT') {
      if (model.attachmentType.value === 'FORMS') {
        output.formId = Number(model.formId.value);
      }
      output.attachmentType = model.attachmentType.value;
    }
    let request;
    let message: string;
    if (id) {
      request = await TaskService.updateTask(output, id);
      message = 'Tarea editada exitosamente!';
    } else {
      request = await TaskService.createTask(output);
      message = 'Tarea creada exitosamente!';
    }
    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/rounds/task');
  };

  const setInitialValues = async () => {
    /* ...igual a antes...*/
  };
  const getFormsHandler = async () => {
    const response = await FormService.getSimpleList();
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
        render={({ handleSubmit, form, submitting, pristine }) => {
          const values: any = form.getState().values;
          const isGeneral = values.taskType?.value === 'GENERAL';
          const isReport = values.taskType?.value === 'REPORT';
          const isFormReport =
            isReport && values.attachmentType?.value === 'FORMS';
          return (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-settings-shifts'
            >
              <div className='grid grid-cols-3 gap-3'>
                <div className='col-span-1'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='Nombre...'
                        label='name'
                        meta={meta}
                        type='text'
                      />
                    )}
                  </Field>
                </div>

                <div className='col-span-2'>
                  <Field<IOption> name='taskType' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='Tipo de tarea...'
                        label='tipo'
                        options={TASK_TYPE_OPTIONS}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                {/* GENERAL: Form selector y hora inicio */}
                {isGeneral && (
                  <>
                    <div className='col-span-1'>
                      <Field name='formId'>
                        {({ input }) => (
                          <SmartSelector
                            {...input}
                            placeholder='Seleccione formulario...'
                            label='formulario'
                            icon='📋'
                            options={forms.value}
                          />
                        )}
                      </Field>
                    </div>
                    <div className='col-span-2'>
                      <Field<string> name='hourStart' validate={required}>
                        {({ input, meta }) => {
                          let timeValue = input.value
                            ? dayjs(input.value).format('HH:mm')
                            : '';
                          return (
                            <Input
                              {...input}
                              type='time'
                              id='task-start'
                              label='Hora inicio'
                              meta={meta}
                              value={timeValue}
                              onChange={(e) => {
                                const [h, m] = (
                                  e.target as HTMLInputElement
                                ).value.split(':');
                                input.onChange(
                                  dayjs()
                                    .hour(parseInt(h))
                                    .minute(parseInt(m))
                                    .second(0)
                                    .millisecond(0)
                                    .toISOString()
                                );
                              }}
                            />
                          );
                        }}
                      </Field>
                    </div>
                  </>
                )}

                {/* REPORT: Attachment type */}
                {isReport && (
                  <div className='col-span-1'>
                    <Field<IOption> name='attachmentType' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Tipo de reporte...'
                          label='reporte'
                          icon='📎'
                          options={ATTACHMENT_OPTIONS}
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>
                )}

                {/* REPORT + FORMS: Form selector */}
                {isFormReport && (
                  <div className='col-span-1'>
                    <Field name='formId'>
                      {({ input }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Seleccione formulario...'
                          label='formulario'
                          icon='📋'
                          options={forms.value}
                        />
                      )}
                    </Field>
                  </div>
                )}

                <div className='col-span-3'>
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        minLength={3}
                        maxLength={300}
                        placeholder='Descripción...'
                        label='description'
                        meta={meta}
                        type='text'
                      />
                    )}
                  </Field>
                </div>
              </div>

              <div className='w-full flex justify-end items-center'>
                <StatusButton
                  onClickClean={() => form.reset()}
                  submitting={submitting}
                  pristine={pristine}
                  form='form-settings-shifts'
                />
              </div>
            </form>
          );
        }}
      />
    </Section>
  );
};
