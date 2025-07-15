import { Input } from '@/components/common/input/input';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { required } from '@/utils/utilities';
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
  initialValues?: Record<string, any>;
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
}

export const TaskFormCreate = ({
  initialValues,
  onSubmit,
  add = false,
  taskList = [],
  selector = false,
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
    let _task: ITask | undefined = undefined;
    if (form) {
      _task = {
        id: value.id,
        name: value.name,
        description: value.description,
        formId: value.formId?.value,
        type: value.type?.value,
        hourStart: DateUtils.createDateFromHour(value.hourStart, true),
        attachmentType: value.attachmentType?.value,
      };
    } else {
      // TODO: esta mierda no me gusta.
      const find = tasks.value.find((task) => task.id === value.value);
      if (!find) return;
      _task = {
        id: find.id,
        name: find.name,
        description: find.description,
        formId: find.formId,
        type: find.type,
        hourStart: DateUtils.createDateFromHour(find.hourStart, true),
        attachmentType: find.attachmentType,
      };
    }
    onSubmit(_task);
    form?.reset();

    if (!selector || !add) return;
    onAppend.value = false;
  };

  // const eventDelete = (event: MouseEvent) => {
  //   event.stopPropagation();
  //   const target = event.target as HTMLElement;
  //   if (target.nodeName === 'A' || target.nodeName === 'SPAN') {
  //     const id = target.getAttribute('data-id');
  //     if (!id) return;
  //     onDelete && onDelete(id);
  //   }
  // };

  const filteredTasks = tasks.value.filter((t) =>
    type ? t.type === type : true
  );

  return (
    <>
      <div
        className={className}
        // onClick={eventDelete}
      >
        <Form
          onSubmit={onChange}
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
                {selector && (
                  <SmartSelector
                    name='select-task'
                    placeholder='p_select'
                    label='h_task'
                    button
                    buttonIcon='219'
                    icon='086'
                    options={filteredTasks.map((e) => ({
                      value: e.id ?? '',
                      // label: e.description ?? 'Sin descripción',
                      label: e.name ?? 'Sin descripción',
                    }))}
                    menuPortalTarget={document.body}
                    onClick={onToggleTask}
                    onChange={onChange}
                    disabled={disabled}
                  />
                )}

                {onAppend.value && (
                  <div
                    className={`flex flex-col justify-center ${divisor ? 'border-t dark:border-t-light-dark py-2' : ''}`}
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
                                label='i_form'
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
