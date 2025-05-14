import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import dayjs from 'dayjs';
import { useSignal } from '@preact/signals';
import { FormData } from '../interface';
import { Modal } from '@/components/common/modal/modal';
import { Button } from '@/components/common/button/button';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ServiceService, ShiftService } from '@/services';
import { Chip } from '@/components/common/chip/chip';
import { Task, User } from '@/components/compose/gantt/types/public-types';
import { Badge } from '@/components/common/badge/badge';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';

interface ITaskFormProps {
  closed?: boolean;
  onClose?: () => void;
  posSave?: () => void;
  userSelected?: User;
  taskSelected?: Task;
  users?: IOption[];
  keywordsSelected?: string[];
  timeBeforeSelected?: number;
  externalSelected?: string;
}

export const TaskForm = ({
  closed,
  onClose,
  userSelected,
  taskSelected,
  posSave,
  users,
  keywordsSelected,
  timeBeforeSelected,
  externalSelected,
}: ITaskFormProps) => {
  const { t } = useTranslation();
  const inputKeywords = useSignal('');
  // const services = useSignal<any[]>([]);
  const services = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>();
  // const tasks = useSignal<ITask[]>([]);

  // const setTasks = (serviceId: number) => {
  //   // const service = services.value.find((service) => service.id === serviceId);
  //   // tasks.value = service?.task || [];
  // };

  // const [selectedEmployees, setSelectedEmployees] = useState<IOption[]>([]);

  const onSubmit = async (model: FormData) => {
    const { start, end, employeeId, serviceId } = model;
    model.employeeId = employeeId?.value;
    model.serviceId = serviceId?.value;

    if (start) model.start = dayjs(start).toISOString();
    if (end) model.end = dayjs(end).toISOString();

    const request = taskSelected?.id
      ? await ShiftService.updateActivity(model, taskSelected.id)
      : await ShiftService.createActivity(model);

    if (!request.getStatus()) return;
    const message = taskSelected?.id
      ? t('shifts.upsert.successEdit')
      : t('shifts.upsert.successCreate');

    ToastManager.success(message);
    onClose?.();
    posSave?.();
  };

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (request.getStatus()) {
      services.value = request.getMany();
    }
  }, []);

  // const getUsers = useCallback(async () => {
  //   const request = await UserService.get_all_employee();
  //   if (request.getStatus()) {
  //     users.value = request.getMany().map((user: any) => ({
  //       ...user,
  //       fullname: `${user.name} ${user.surname}`,
  //     }));
  //   }
  // }, []);

  useEffect(() => {
    Promise.all([getServices()]);
  }, [getServices]);

  const required = useCallback(
    (value: any) => (value ? undefined : t('shifts.upsert.required')),
    [t]
  );

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          id='btn-form-shift-close'
          name='btn-form-shift-close'
          type='button'
          label={t('shifts.upsert.buttons.cancel')}
          onClick={onClose}
          icon='041'
        />
        <Button
          id='btn-form-shift-save'
          name='btn-form-shift-save'
          type='submit'
          label={
            taskSelected
              ? t('shifts.upsert.buttons.edit')
              : t('shifts.upsert.buttons.save')
          }
          className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
          form='form-shift-update'
          icon='041'
        />
      </div>
    ),
    [taskSelected, onClose, t]
  );

  const headerContent = useMemo(
    () => (
      <h3>
        {taskSelected
          ? t('shifts.upsert.editShift')
          : t('shifts.upsert.createShift')}
      </h3>
    ),
    [taskSelected, t]
  );

  const renderTaskCard = useCallback(
    (task: Task) => (
      <div
        key={task.id}
        className='dark:bg-b-dark-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-64'
      >
        <div className='flex justify-between items-center mb-3'>
          <h3 className='font-medium text-gray-900 dark:text-white truncate'>
            {task.name}
          </h3>
          <Badge
            label={task.status}
            bgColor={
              task.status === 'CLOSED'
                ? 'bg-red-200'
                : task.status === 'CREATED'
                  ? 'bg-green-200'
                  : 'bg-gray-200'
            }
          />
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
            <span>{t('shifts.upsert.taskCard.progress')}</span>
            <span>{task.progress | 0}%</span>
          </div>

          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{
                width: `${task.progress | 0}%`,
                backgroundColor: task.styles?.progressColor,
              }}
            ></div>
          </div>
          <div className='flex justify-center items-center text-xs text-center text-gray-500 dark:text-gray-400 mt-2 w-full'>
            <div>
              <i className='fas fa-calendar-alt mr-1'></i>
              {new Date(task.start).toLocaleString()}
            </div>
            <div>
              <i className='fas fa-flag-checkered mr-1'></i>
              {new Date(task.end).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  useEffect(() => {
    if (taskSelected) {
      const selectedService = services.value.find(
        (service) => service.value === Number(taskSelected.serviceId)
      );
      const selectedUser = users?.find(
        (user) => user.value === Number(taskSelected.userId)
      );
      setInitialValues({
        employeeId: selectedUser || '',
        start: taskSelected.start?.toString(),
        end: taskSelected.end?.toString(),
        serviceId: selectedService || '',
        type: taskSelected.type,
        keywords: keywordsSelected,
        timeBefore: timeBeforeSelected,
        externalId: externalSelected,
      });
      return;
    }
    if (userSelected) {
      // setSelectedEmployeeId(userSelected.id?.toString());
      setInitialValues({
        employeeId: userSelected.id,
        start: '',
        end: '',
        serviceId: '',
        type: 'INTERNAL',
        timeBefore: 0,
        externalId: '',
      });
      return;
    }
    // setSelectedEmployeeId('');
    setInitialValues({
      employeeId: '',
      start: '',
      end: '',
      serviceId: '',
      type: 'INTERNAL',
      timeBefore: 0,
      externalId: '',
    });
  }, [userSelected, taskSelected, timeBeforeSelected]);

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={headerContent}
      footer={footerContent}
    >
      <div className='px-4 py-6 flex flex-col w-full'>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          mutators={{
            ...arrayMutators,
          }}
          render={({ handleSubmit, values }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-shift-update'
              onKeyDown={preventKeyDown}
            >
              <div className='grid grid-cols-2 gap-3 z-50 grid-cols-en'>
                <div class='col-span-1'>
                  <Field<IOption> name='employeeId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        name='employeeId'
                        id='select-employeeId'
                        label='Empleado'
                        options={users || []}
                        multiple={false}
                        allowAll={false}
                        menuPortalTarget={document.body}
                        placeholder={t(
                          'shifts.upsert.form.employeePlaceholder'
                        )}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string> name='type' validate={required}>
                    {({ input, meta }) => (
                      <Select
                        {...input}
                        meta={meta}
                        id='select-type'
                        name='select-type'
                        placeholder={t('shifts.upsert.form.typePlaceholder')}
                        label={t('shifts.upsert.form.type')}
                        icon='252'
                        options={[
                          {
                            value: 'EXTERNAL',
                            label: t('shifts.upsert.form.typeOptions.external'),
                          },
                          {
                            value: 'INTERNAL',
                            label: t('shifts.upsert.form.typeOptions.internal'),
                          },
                        ]}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string>
                    name='start'
                    validate={required}
                    parse={(value) => (value ? dayjs(value).toISOString() : '')}
                    format={(value) =>
                      value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                    }
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='input-start-date'
                        name='input-start-date'
                        type='datetime-local'
                        label={t('shifts.upsert.form.startDate')}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string>
                    name='end'
                    validate={required}
                    parse={(value) => (value ? dayjs(value).toISOString() : '')}
                    format={(value) =>
                      value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                    }
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        id='input-end-date'
                        name='input-end-date'
                        type='datetime-local'
                        label={t('shifts.upsert.form.endDate')}
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<IOption> name='serviceId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        name='serviceId'
                        id='select-service'
                        placeholder={t('shifts.upsert.form.servicePlaceholder')}
                        label={t('shifts.upsert.form.service')}
                        options={services.value}
                        menuPortalTarget={document.body}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string> name='externalId'>
                    {({ input }) => (
                      <Input
                        {...input}
                        id='input-external-id'
                        name='input-external-id'
                        type='text'
                        label={t('shifts.upsert.form.externalCode')}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1 '>
                  <FieldArray<string> name='keywords'>
                    {({ fields }) => {
                      const appendElement = () => {
                        if (inputKeywords.value.trim() === '') return;
                        fields.push(inputKeywords.value);
                        inputKeywords.value = '';
                      };
                      return (
                        <div className='flex flex-col'>
                          <div className='flex items-center rounded-md'>
                            <Input
                              id='input-keywords'
                              name='input-keywords'
                              value={inputKeywords.value}
                              type='keywords'
                              onChange={(e) =>
                                (inputKeywords.value = e.currentTarget.value)
                              }
                              placeholder={t(
                                'shifts.upsert.form.keywordPlaceholder'
                              )}
                              button
                              label={t('shifts.upsert.form.keywords')}
                              buttonIcon='044'
                              onKeyUp={appendElement}
                              onClick={appendElement}
                            />
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {values.keywords?.map(
                              (keyword: string, index: number) => (
                                <Chip
                                  key={`chip-shift-word-${index}`}
                                  label={keyword}
                                  onDelete={() => fields.remove(index)}
                                />
                              )
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </FieldArray>
                </div>

                <div class='col-span-1'>
                  <Field
                    name='timeBefore'
                    parse={(value) => Number(value) || undefined}
                  >
                    {({ input }) => (
                      <Input
                        {...input}
                        id='input-time-before'
                        name='input-time-before'
                        type='number'
                        label={t('shifts.upsert.form.timeBefore')}
                      />
                    )}
                  </Field>
                </div>

                {/*
                <div className='col-span-2'>
                  <ExpansionPanel
                    title={t('shifts.upsert.form.taskPanel.title')}
                  >
                    <FieldArray name='tasks'>
                      {({ fields }) => (
                        <div>
                          <Select
                            placeholder={t(
                              'shifts.upsert.form.taskPanel.selectTaskPlaceholder'
                            )}
                            label={t('shifts.upsert.form.taskPanel.task')}
                            name='taskId'
                            icon='252'
                            optionValue='description'
                            optionLabel='description'
                            options={tasks.value}
                            onChange={(e) => {
                              const description = e.currentTarget.value;
                              const task = tasks.value.find(
                                (task: any) => task.description === description
                              );
                              fields.push(task);
                            }}
                          />
                          <div className='mt-4'>
                            <table className='min-w-full divide-y divide-gray-200'>
                              <thead className='bg-gray-50'>
                                <tr>
                                  <th
                                    scope='col'
                                    className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                  />
                                  <th
                                    scope='col'
                                    className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                  >
                                    {t(
                                      'shifts.upsert.form.taskPanel.startDate'
                                    )}
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                  >
                                    {t('shifts.upsert.form.taskPanel.formId')}
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                  >
                                    {t(
                                      'shifts.upsert.form.taskPanel.description'
                                    )}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='bg-white divide-y divide-gray-200'>
                                {fields.value &&
                                  fields.value.map(
                                    (task: any, taskIndex: number) => (
                                      <tr key={taskIndex}>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                          <Button
                                            textColor='text-red-600'
                                            id='btn-delete'
                                            name='btn-delete'
                                            icon='041'
                                            type='button'
                                            className='text-red-600 hover:text-red-800'
                                            onClick={() =>
                                              fields.remove(taskIndex)
                                            }
                                          />
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                          {dayjs(task.start).format(
                                            'DD/MM/YYYY HH:mm'
                                          )}
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                          {task.formId}
                                        </td>

                                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
                                          <p>{task.description}</p>
                                        </td>
                                      </tr>
                                    )
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </ExpansionPanel>
                </div>
                */}
              </div>
            </form>
          )}
        />
        <div className='mt-4 flex flex-row flex-wrap gap-4 w-full justify-center p-4 max-h-60 overflow-y-auto vox-scroll-design'>
          {userSelected?.tasks.map(renderTaskCard)}
        </div>
        {/*
        <div className='w-[650px] max-h-52 overflow-y-scroll'>
          {taskSelected && (
            <pre className='bg-gray-100 dark:bg-b-dark-dark p-4 rounded-lg overflow-auto'>
              {JSON.stringify(taskSelected, null, 2)}
            </pre>
          )}
          {userSelected && (
            <pre className='bg-gray-100 dark:bg-b-dark-dark p-4 mt-4 rounded-lg overflow-auto'>
              {JSON.stringify(userSelected, null, 2)}
            </pre>
          )}
        </div>
        */}
      </div>
    </Modal>
  );
};
