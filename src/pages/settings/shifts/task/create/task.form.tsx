import { Input } from '@/components/common/input/input';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { required } from '@/utils/utilities';
import { Field, Form } from 'react-final-form';
import { ATTACHMENT_OPTIONS, TASK_TYPE_OPTIONS } from './constant';
import { StatusButton } from '@/pages/settings/components/custom.button';

interface Props {
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  forms: IOption[];
  add?: boolean;
}

export const TaskFormCreate = ({
  initialValues,
  onSubmit,
  forms,
  add = false,
}: Props) => {
  return (
    <Form
      onSubmit={(values, form) => {
        onSubmit(values);
        form.reset();
      }}
      initialValues={initialValues}
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
            id='form-settings-task-create'
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
                          options={forms}
                        />
                      )}
                    </Field>
                  </div>
                  <div className='col-span-1'>
                    <Field<string> name='hourStart' validate={required}>
                      {({ input, meta }) => {
                        return (
                          <Input
                            {...input}
                            type='time'
                            id='task-start'
                            label='h_time'
                            meta={meta}
                            unicon
                            icon='325'
                          />
                        );
                      }}
                    </Field>
                  </div>
                </>
              )}

              {isReport && (
                <div className='col-span-1'>
                  <Field<IOption> name='attachmentType'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='p_select'
                        label='h_report'
                        icon='452'
                        options={ATTACHMENT_OPTIONS}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
              )}

              {isFormReport && (
                <div className='col-span-1'>
                  <Field<IOption> name='formId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='p_select'
                        label='i_form'
                        icon='206'
                        meta={meta}
                        options={forms}
                      />
                    )}
                  </Field>
                </div>
              )}

              <div className='col-span-2'>
                {add ? (
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='input-task-description'
                        type='text'
                        icon='123'
                        meta={meta}
                        label='description'
                        placeholder='p_write'
                        button
                        buttonIcon='044'
                        buttonType='submit'
                        buttonForm='form-settings-task-create'
                      />
                    )}
                  </Field>
                ) : (
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='input-task-description'
                        type='text'
                        icon='123'
                        meta={meta}
                        label='description'
                        placeholder='p_write'
                      />
                    )}
                  </Field>
                )}
              </div>
            </div>
            {!add && (
              <div className='w-full flex justify-end items-center'>
                <StatusButton
                  onClickClean={() => form.reset()}
                  submitting={submitting}
                  pristine={pristine}
                  form='form-settings-task-create'
                />
              </div>
            )}
          </form>
        );
      }}
    />
  );
};
