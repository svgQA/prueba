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
import { UserService } from '@/services/user';
import { ShiftService } from '@/services';
import { IUserResponse } from '@/types/auth';
import { IShiftResponse } from '@/types/shift/activity';
import { Chip } from '@/components/common/chip/chip';
import { toast } from 'react-toastify';
import { Task, User } from '@/components/compose/gantt/types/public-types';
import { Badge } from '@/components/common/badge/badge';

interface Props {
  closed?: boolean;
  onClose?: () => void;
  posSave?: () => void;
  userSelected?: User;
  taskSelected?: Task;
}

export const TaskForm = ({
  closed,
  onClose,
  userSelected,
  taskSelected,
}: Props) => {
  const inputKeywords = useSignal('');
  const users = useSignal<IUserResponse[]>([]);
  const services = useSignal<IShiftResponse[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>();

  const onSubmit = async (model: FormData) => {
    try {
      const { start, end } = model;

      if (start) model.start = dayjs(start).toISOString();
      if (end) model.end = dayjs(end).toISOString();

      const request = taskSelected?.id
        ? await ShiftService.updateActivity(model, taskSelected.id)
        : await ShiftService.createActivity(model);

      if (!request.getStatus()) return;

      const message = taskSelected?.id
        ? 'Turno editado exitosamente!'
        : 'Turno creado exitosamente!';

      toast.success(message, { position: 'top-right' });
      // onClose?.();
      // posSave?.();
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    }
  };

  const getServices = useCallback(async () => {
    const request = await ShiftService.getServices();
    if (request.getStatus()) {
      services.value = request.getMany();
    }
  }, []);

  const getUsers = useCallback(async () => {
    const request = await UserService.get_all_employee();
    if (request.getStatus()) {
      users.value = request.getMany().map((user: any) => ({
        ...user,
        fullname: `${user.name} ${user.surname}`,
      }));
    }
  }, []);

  useEffect(() => {
    Promise.all([getUsers(), getServices()]);
  }, [getUsers, getServices]);

  const required = useCallback(
    (value: any) => (value ? undefined : 'Required'),
    []
  );

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex dark:bg-b-dark-light justify-end items-center gap-2 p-4 bg-gray-50'>
        <Button
          id='btn-form-shift-close'
          name='btn-form-shift-close'
          type='button'
          label='Cancelar'
          onClick={onClose}
        />
        <Button
          id='btn-form-shift-save'
          name='btn-form-shift-save'
          type='submit'
          label={taskSelected ? 'Editar' : 'Guardar'}
          className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
          form='form-shift-update'
        />
      </div>
    ),
    [taskSelected, onClose]
  );

  const headerContent = useMemo(
    () => <h3>{taskSelected ? 'Editar Turno' : 'Crear Turno'}</h3>,
    [taskSelected]
  );

  const renderTaskCard = useCallback(
    (task: Task) => (
      <div
        key={task.id}
        className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-64'
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
            <span>Progress</span>
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
      setSelectedEmployeeId(taskSelected.userId?.toString());
      setInitialValues({
        start: taskSelected.start?.toString(),
        end: taskSelected.end?.toString(),
        serviceId: taskSelected.serviceId,
        type: 'INTERNAL',
      });
      return;
    }
    if (userSelected) {
      setSelectedEmployeeId(userSelected.id?.toString());
      return;
    }
    setSelectedEmployeeId('');
    setInitialValues({
      start: '',
      end: '',
      serviceId: '',
      type: 'INTERNAL',
    });
  }, [userSelected, taskSelected]);

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
      <div className='px-4 py-6 flex flex-col'>
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
              <div className='grid grid-cols-2 gap-3'>
                <div class='col-span-1'>
                  <Field<string> name='employeedId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        id='select-employee'
                        name='select-employee'
                        placeholder='Selecione empleado...'
                        label='Empleado'
                        icon='252'
                        options={users.value}
                        optionValue='id'
                        optionLabel='fullname'
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
                        value={selectedEmployeeId}
                        disabled={!!userSelected}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string> name='type'>
                    {({ input }) => (
                      <Select
                        {...input}
                        id='select-type'
                        name='select-type'
                        placeholder='Selecione tipo...'
                        label='Tipo'
                        icon='252'
                        options={[
                          { value: 'EXTERNAL', label: 'Externo' },
                          { value: 'INTERNAL', label: 'Interno' },
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
                        label='Fecha inicio'
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
                        label='Fecha fin'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field name='serviceId'>
                    {({ input }) => (
                      <Select
                        {...input}
                        id='select-service'
                        name='select-service'
                        placeholder='Selecione Servicio...'
                        label='Servicio'
                        icon='252'
                        optionValue='id'
                        optionLabel='description'
                        options={services.value}
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
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
                        label='Codigo externo'
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
                              placeholder='Escribe una palabra clave'
                              button
                              label='Palabras claves'
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
                        label='Tiempo antes'
                      />
                    )}
                  </Field>
                </div>
              </div>
            </form>
          )}
        />
        <div className='flex flex-row flex-wrap gap-4 w-full justify-center p-4'>
          {userSelected?.tasks.map(renderTaskCard)}
        </div>
        {/*
        <div className='w-[650px] max-h-52 overflow-y-scroll'>
          {taskSelected && (
            <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto'>
              {JSON.stringify(taskSelected, null, 2)}
            </pre>
          )}
          {userSelected && (
            <pre className='bg-gray-100 dark:bg-gray-800 p-4 mt-4 rounded-lg overflow-auto'>
              {JSON.stringify(userSelected, null, 2)}
            </pre>
          )}
        </div>
        */}
      </div>
    </Modal>
  );
};
