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
import { DateUtils } from '@/utils/utilities/dates';

interface FormData {
  name: string;
  description: string;
  formId: IOption;
  hourStart: string;
  attachmentType: IOption;
  type: IOption;
}

const ATTACHMENT_TYPES = [
  'GENERAL',
  'DOCUMENT',
  'AUDIO',
  'VIDEO',
  'PHOTO',
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
      type: model.type.value as string,
    };

    if (output.type === 'GENERAL') {
      output.formId = model.formId?.value ? Number(model.formId.value) : null;
      output.hourStart = DateUtils.dateToBackend(model.hourStart);
    } else if (output.type === 'REPORT') {
      if (model.attachmentType.value === 'FORMS') {
        output.formId = Number(model.formId.value);
      }
      output.attachmentType = model.attachmentType.value;
    }

    if (id) {
      const request = await TaskService.updateTask(output, id);
      if (!request.getStatus()) return;
      ToastManager.success('s_update_success');
    } else {
      const request = await TaskService.createTask(output);
      if (!request.getStatus()) return;
      ToastManager.success('s_create_success');
    }
    navigate('/rounds/task');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const request = await TaskService.getTaskById(id);
    if (!request.getStatus()) return;
    const task = request.getOne();
    initialValues.value = {
      ...task,
      hourStart: DateUtils.dateToFrontend(task.hourStart),
      type: {
        value: task.type,
        label: task.type,
      },
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
    <Section className='w-full'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => {
          const values: any = form.getState().values;
          const isGeneral = values.type?.value === 'GENERAL';
          const isReport = values.type?.value === 'REPORT';
          const isFormReport =
            isReport && values.attachmentType?.value === 'FORMS';
          return (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-settings-shifts'
            >
              <div className='grid grid-cols-2 gap-3'>
                <div className='col-span-1'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder='h_name'
                        label='h_name'
                        meta={meta}
                        icon='120'
                        type='text'
                      />
                    )}
                  </Field>
                </div>

                <div className='col-span-1'>
                  <Field<IOption> name='type' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='p_select'
                        label='h_type'
                        icon='454'
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
                            placeholder='p_select'
                            label='i_form'
                            icon='206'
                            options={forms.value}
                          />
                        )}
                      </Field>
                    </div>
                    <div className='col-span-1'>
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
                              label='h_time'
                              meta={meta}
                              unicon
                              icon='325'
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
                    <Field<IOption> name='attachmentType'>
                      {({ input, meta }) => (
                        <SmartSelector
                          {...input}
                          placeholder='p_select'
                          label='h_reporte'
                          icon='452'
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
                    <Field<IOption> name='formId' validate={required}>
                      {({ input, meta }) => (
                        <SmartSelector<IOption>
                          {...input}
                          placeholder='p_select'
                          label='i_form'
                          icon='206'
                          meta={meta}
                          options={forms.value}
                        />
                      )}
                    </Field>
                  </div>
                )}

                <div className='col-span-2'>
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        minLength={3}
                        maxLength={300}
                        placeholder='Descripción...'
                        label='description'
                        meta={meta}
                        icon='288'
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
