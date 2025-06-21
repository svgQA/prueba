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
  attachmentType: IOption;
  taskType: IOption;
}

// Valores locales que reflejan los tipos del backend
// Tipos del backend
const ATTACHMENT_TYPES = ['DOCUMENT', 'AUDIO', 'VIDEO', 'PHOTO', 'GENERAL', 'FORMS'] as const;
type AttachmentType = (typeof ATTACHMENT_TYPES)[number];
const ATTACHMENT_OPTIONS: IOption[] = ATTACHMENT_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }));

const TASK_TYPES = ['GENERAL', 'REPORT'] as const;
type TaskType = (typeof TASK_TYPES)[number];
const TASK_TYPE_OPTIONS: IOption[] = TASK_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }));


export const TaskCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const forms = useSignal<IOption[]>([]);
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (model: FormData) => {
    const output = {
      name: model.name,
      description: model.description,
      formId: Number(model.formId.value),
      hourStart: model.hourStart,
      attachmentType: model.attachmentType.value as AttachmentType,
      type: model.taskType.value as TaskType,
    };
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
    if (!id) return;
    const keys = [
      'name',
      'formId',
      'description',
      'hourStart',
      'attachmentType',
      'taskType',
    ] as const;
    const response: any = await TaskService.getTaskById(id);
    if (!response.getStatus()) return;
    const model = response.getOne();

    const formIdOption: IOption | undefined = model?.form
      ? { value: model.form.id, label: model.form.title }
      : undefined;

    const attachmentOption: IOption | undefined = model?.attachmentType
      ? {
        value: model.attachmentType as AttachmentType,
        label: (model.attachmentType as string)
          .charAt(0)
          .concat((model.attachmentType as string).slice(1).toLowerCase()),
      }
      : undefined;

    const taskOption: IOption | undefined = model?.taskOption
      ? {
        value: model.taskOption as AttachmentType,
        label: (model.taskOption as string)
          .charAt(0)
          .concat((model.taskOption as string).slice(1).toLowerCase()),
      }
      : undefined;

    const picked = pick(omitBy(response.model, isNull), keys);
    initialValues.value = {
      ...picked,
      formId: formIdOption,
      attachmentType: attachmentOption,
      taskType: taskOption,
    };
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
          console.log(values);
          const isReport = values.taskType?.value === 'REPORT';
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
                        placeholder='Ingrese nombre...'
                        label='Nombre'
                        meta={meta}
                        type='text'
                      />
                    )}
                  </Field>
                </div>

                <div className='col-span-1'>
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

                <div className='col-span-1'>
                  <Field<IOption> name='taskType' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='Seleccione tipo de tarea...'
                        label='Tipo de tarea'
                        icon='📎'
                        options={TASK_TYPE_OPTIONS}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                {isReport && (
                  <div className='col-span-1'>
                    <Field<IOption> name='attachmentType' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='Seleccione tipo de reporte...'
                          label='Tipo de reporte'
                          icon='📎'
                          options={ATTACHMENT_OPTIONS}
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>)}

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
          )
        }
        }
      />
    </Section>
  );

};
