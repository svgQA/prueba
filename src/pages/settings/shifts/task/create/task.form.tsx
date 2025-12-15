import { Input } from '@/components/common/input/input';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { lengthSize, required } from '@/utils/utilities';
import { Field, Form } from 'react-final-form';
import { ATTACHMENT_OPTIONS, TASK_TYPE_OPTIONS } from './constant';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { TaskCard } from './task.card';
import { useSignal } from '@preact/signals';
import { useCallback, useEffect } from 'preact/hooks';
import { FormService, TaskService } from '@/services';
import { useUserStore } from '@/store/slices';
import { ITask } from './interface';
import { DateUtils } from '@/utils/utilities/dates';

interface Props {
  onSubmit: (values: Record<string, any>) => void;
  add?: boolean;
  taskList?: any[];
  divisor?: boolean;
  className?: string;
  forms?: IOption[];
  selector?: boolean;
  append?: boolean;
  onDelete?: (id: string) => void;
  type?: 'REPORT' | 'GENERAL';
  disabled?: boolean;
  initialValues?: Record<string, any>;
}

export const TaskFormCreate = ({
  onSubmit,
  add = false,
  taskList = [],
  selector = false,
  initialValues = {},
  divisor = true,
  className = '',
  forms,
  append = false,
  onDelete,
  type,
  disabled = false,
}: Props) => {
  const { selectedCompany } = useUserStore();
  const onAppend = useSignal<boolean>(append);
  const tasks = useSignal<ITask[]>([]);
  const _forms = useSignal<IOption[]>(forms || []);

  const initData = useCallback(async () => {
    const [task_response, form_response] = await Promise.all([
      TaskService.getTasks(),
      FormService.getSimpleList(),
    ]);
    if (task_response.getStatus()) {
      tasks.value = task_response.getMany();
    }
    if (form_response.getStatus()) {
      _forms.value = form_response.getMany();
    }
  }, []);

  const initDataTask = useCallback(async () => {
    const [task_response] = await Promise.all([TaskService.getTasks()]);
    if (task_response.getStatus()) {
      tasks.value = task_response.getMany();
    }
  }, []);

  const onToggleTask = () => {
    onAppend.value = !onAppend.value;
  };

  useEffect(() => {
    if (selectedCompany) {
      _forms.value.length > 0 ? initDataTask() : initData();
    }
  }, [selectedCompany]);

  const onChange = (value: any, form?: any) => {
    if (!value) return;
    let _task: any | undefined = undefined;
    if (value.value === 'general') {
      _task = {
        name: 'General',
        description: 'Tarea general',
        hourStart: DateUtils.createDateFromHour(value.hourStart, true),
        type: 'GENERAL',
        attachmentType: undefined,
      };
    } else if (value.id || value.name) {
      _task = {
        ...value,
        hourStart: DateUtils.createDateFromHour(value.hourStart, true),
        id: value.id || Date.now(),
      };
    } else {
      const find = tasks.value.find((task) => task.id == value.value);
      if (!find) return;
      _task = {
        ...find,
        hourStart: DateUtils.createDateFromHour(find.hourStart, true),
      };
    }

    if (!_task) return;

    onSubmit({
      id: _task?.value || _task?.id,
      formId: _task.formId?.value ?? _task.formId,
      type: _task.type?.value ?? _task.type,
      attachmentType: _task.attachmentType?.value ?? _task.attachmentType,
      hourStart: _task.hourStart,
      description: _task.description,
      name: _task.name,
      responseId: _task.responseId,
      check: _task.check ?? false,
      status: _task.status,
      progress: _task.progess,
      start: _task.start ?? _task.hourStart,
      end: _task.end,
      styles: _task.styles,
      companyId: _task.companyId,
      is_new: _task?.value ? false : true,
    });

    if (form) form.change('select-task', undefined);
    if (!selector || !add) return;
    onAppend.value = false;
  };

  const filteredTasks = tasks.value.filter((t) =>
    type ? t.type === type : true
  );

  return (
    <>
      <div className={className}>
        <Form
          onSubmit={onChange}
          initialValues={{ type, ...initialValues }}
          render={({ handleSubmit, form, submitting, pristine }) => {
            const values: any = form.getState().values;

            const isGeneral =
              values.type === 'GENERAL' || values.type?.value === 'GENERAL';
            const isReport =
              values.type === 'REPORT' || values.type?.value === 'REPORT';
            const isFormReport =
              isReport &&
              (values.attachmentType === 'FORMS' ||
                values.attachmentType?.value === 'FORMS');

            return (
              <form
                onSubmit={handleSubmit}
                className='space-y-6'
                id='form-settings-task-create'
              >
                {selector && (
                  <Field name='select-task'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        placeholder='p_select'
                        label='h_task'
                        button
                        buttonIcon={!onAppend.value ? '044' : '192'}
                        icon='086'
                        options={[
                          ...filteredTasks.map((e) => ({
                            ...e,
                            value: e.id ?? '',
                            label: e.name ?? 'Sin descripción',
                          })),
                        ]}
                        menuPortalTarget={document.body}
                        onClick={onToggleTask}
                        onChange={(value) => onChange(value, form)}
                        disabled={disabled}
                        meta={meta}
                      />
                    )}
                  </Field>
                )}

                {onAppend.value && (
                  <div
                    className={`flex flex-col justify-center ${divisor ? 'border-y dark:border-b-dark-light py-2' : ''}`}
                  >
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='col-span-1'>
                        <Field<string> name='name' validate={lengthSize(5, 30)}>
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              placeholder='h_name'
                              label='h_name'
                              meta={meta}
                              icon='123'
                              type='text'
                            />
                          )}
                        </Field>
                      </div>

                      <div className='col-span-1 items-start flex flex-row w-full'>
                        {type ? (
                          <div className='font-bold flex h-11 text-center flex-col justify-center bg-ternary rounded-lg w-full mt-5'>
                            <p>{type}</p>
                          </div>
                        ) : (
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
                        )}
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
                                  label='l_form'
                                  icon='206'
                                  options={_forms.value}
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
                                label='l_form'
                                icon='206'
                                meta={meta}
                                options={_forms.value}
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
                                buttonLabel='l_add_task'
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
                      <div className='w-full flex justify-end items-center mt-3 relative'>
                        <StatusButton
                          onClickClean={() => form.reset()}
                          submitting={submitting}
                          pristine={pristine}
                          form='form-settings-task-create'
                        />
                      </div>
                    )}
                  </div>
                )}

                {taskList && taskList.length > 0 && (
                  <div className='mt-1 rounded-lg p-2 bg-b-light dark:bg-b-dark-light'>
                    <ul className='flex flex-wrap gap-1 justify-center'>
                      {taskList.map((task, index) => (
                        <TaskCard
                          task={task}
                          key={`task-selected-${index}`}
                          onDelete={onDelete}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            );
          }}
        />
      </div>
    </>
  );
};
