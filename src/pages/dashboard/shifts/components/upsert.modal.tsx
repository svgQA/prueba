import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useSignal } from '@preact/signals';
import { FormData, IShiftRequest, ITask } from '../interface';
import { Modal } from '@/components/common/modal/modal';
import { Button } from '@/components/common/button/button';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import {
  FormService,
  ServiceService,
  ShiftService,
  TaskService,
} from '@/services';
import { Task, User } from '@/components/compose/gantt/types/public-types';
import { IOption } from '@/components/common/multi/interface';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { useUserStore } from '@/store/slices';

import {
  getSelectedHoursByDay,
  convertBlocksToCells,
} from '@/pages/settings/shifts/schedule/utils';
import { DataSchedule } from '@/pages/settings/shifts/schedule/components/data.schedule';
import { ShiftFormContent } from './shift.form';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { DAYS_OF_WEEK, HOURS } from '@/pages/settings/shifts/schedule/constant';
import { TaskFormCreate } from '@/pages/settings/shifts/task/create/task.form';
import { TaskCard } from './task.card';

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
  const { selectedCompany } = useUserStore();

  const [selectedCells, setSelectedCells] = useState<any>([]);
  const services = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});
  const schedules = useSignal<any[]>([]);
  const [tasksResponse, setTasksResponse] = useState<ITask[]>([]);
  const tasks = useSignal<ITask[]>([]);
  const relatedShifts = useSignal<any[]>([]);
  const forms = useSignal<any[]>([]);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices(), getTasks(), getForms()]);
    }
  }, [selectedCompany, location]);

  const onSubmit = async (model: any, form: any) => {
    if (relatedShifts.value.length > 0) {
      ToastManager.error('s_replicate_duplicate_range_error');
      return;
    }
    const { employeeId, serviceId } = model;
    console.log(model, tasks.value);
    /*
		const isInSchedule = isStartAndEndInSchedules(
		  DateUtils.dateToInput(model.start),
		  DateUtils.dateToInput(model.end),
		  schedules.value
		);

		if (!isInSchedule) {
		  ToastManager.warning('s_updated_error');
		  return;
		}
		*/

    // const model_task = tasks.value.find(
    //   (_task: ITask) => _task.id === task?.value
    // );
    const allTasks: ITask[] = [];

    const request_model: IShiftRequest = {
      ...model,
      employeeId: employeeId?.value,
      serviceId: serviceId?.value,
      task: allTasks,
    };

    const request = taskSelected?.id
      ? await ShiftService.updateActivity(request_model, taskSelected.id)
      : await ShiftService.createActivity(request_model);

    if (!request.getStatus()) {
      ToastManager.error('s_upload_error');
      return;
    }

    const message = taskSelected?.id
      ? 's_updated_success'
      : 's_created_success';

    form.reset();
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

  const getTasks = useCallback(async () => {
    const request = await TaskService.getTasks();
    if (request.getStatus()) {
      tasks.value = request.getMany();
    }
  }, []);

  const getForms = useCallback(async () => {
    const request = await FormService.getSimpleList();
    if (request.getStatus()) {
      forms.value = request.getMany();
    }
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-form-shift-close'
          label='cancel'
          type='button'
          onClick={onClose}
          icon='041'
        />
        <Button
          name='btn-form-shift-save'
          type='submit'
          label={taskSelected ? 'edit' : 'save'}
          form='form-shift-create-update'
          icon='041'
        />
      </div>
    ),
    [taskSelected, onClose]
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

  const onChangeShift = async (id: number, start: string, end: string) => {
    const response = await ShiftService.get_related({
      id,
      start: DateUtils.dateToBackend(start),
      end: DateUtils.dateToBackend(end),
    });
    if (!response.getStatus()) return;
    const outputs = response.getMany();
    relatedShifts.value = outputs;
  };

  const onChangeService = async (id: number) => {
    const response = await ServiceService.getServiceById(String(id));
    if (!response.getStatus()) return;
    const model = response.getOne();

    if (model.tasks && model.tasks.length > 0) {
      // MSG: Update tasks message
      // TODO: Agregar solo las propiedades necesarias
      setTasksResponse(
        model.tasks.map((task: any, index: number) => ({
          id: index,
          t: 1,
          ...task,
        }))
      );
    }

    const length = model.schedules.length;
    if (length < 1) return;

    /* TODO: Mierda de Scheduler */
    schedules.value = model.scchedule;
    const schedule = model.schedules[length - 1].schedule;
    const days = schedule.days.reduce(
      (acc: any, day: any) => {
        acc[day.day] = day.blocks.map((block: any) => {
          return { start: block.start, end: block.end };
        });
        return acc;
      },
      {} as { [key: string]: { start: number; end: number }[] }
    );
    // @ts-ignore
    setSelectedCells(convertBlocksToCells(days));
  };

  const cleanServiceSelected = () => {
    setSelectedCells([]);
    // Tener cuidado solo limpiar las del servicio.
    setTasksResponse([]);
  };

  const onTaskAdd = (model: any) => {
    const task = {
      id: tasksResponse.length + 1,
      t: 2,
      ...model,
      hourStart: DateUtils.createUTCDateFromHour(model.hourStart),
    };
    setTasksResponse((prevTasks) => [...prevTasks, task]);
  };

  const isNewTask = useSignal(false);
  const onToggleTask = () => {
    isNewTask.value = !isNewTask.value;
  };

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-2/3'
      position='fixed'
      header={<h3>{taskSelected ? t('udpate') : t('create')}</h3>}
      footer={footerContent}
    >
      <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
        {selectedCells && (
          <div className='mb-2 rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light'>
            <ul className='flex flex-wrap gap-1 justify-center'>
              {getSelectedHoursByDay(DAYS_OF_WEEK, HOURS, selectedCells).map(
                (daySelection) => (
                  <DataSchedule daySelection={daySelection} />
                )
              )}
            </ul>
          </div>
        )}

        {relatedShifts.value.length > 0 && (
          <div className='mb-2 rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light'>
            <ul className='flex flex-wrap gap-1 justify-center'>
              {relatedShifts.value.map((shift) => (
                <li
                  key={shift.id}
                  className='w-52 text-xs p-2 rounded-md border bg-b-light-dark dark:bg-b-dark-dark  border-red-500 min-w-[150px]'
                >
                  <div className='flex flex-row justify-between items-center'>
                    <TextEllipsis
                      text={shift?.service?.name}
                      maxWidth='100px'
                    ></TextEllipsis>
                    <span className='rounded-full h-3 w-3 bg-primary'></span>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <strong>Start: </strong>
                    <p>
                      {DateUtils.dateToFrontend(shift.start, {
                        time: true,
                        mode: '12',
                      })}
                    </p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <strong>end: </strong>
                    {DateUtils.dateToFrontend(shift.end, {
                      time: true,
                      mode: '12',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          mutators={{
            ...arrayMutators,
          }}
          render={(formProps) => (
            <ShiftFormContent
              {...formProps}
              onChangeShift={onChangeShift}
              onChangeService={onChangeService}
              onToggleTask={onToggleTask}
              users={users}
              services={services.value}
              cleanServiceSelected={cleanServiceSelected}
              tasks={tasks}
            />
          )}
        />

        {isNewTask.value && (
          <div className='flex flex-col justify-center mt-4 border-t dark:border-t-light-dark py-2'>
            <TaskFormCreate onSubmit={onTaskAdd} forms={forms.value} add />
          </div>
        )}

        {tasksResponse?.length > 0 && (
          <div className='mt-2 rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light'>
            <ul className='flex flex-wrap gap-1 justify-center'>
              {tasksResponse.map((task) => (
                <li
                  key={`card-task-${task.name}-${task.id}`}
                  className='w-52 text-xs p-2 rounded-md  bg-b-light-dark dark:bg-b-dark-dark min-w-[150px] relative'
                >
                  {/* @ts-ignore */}
                  <span>{t((task.type as IOption)?.value | task.type)}</span>
                  <p className='font-semibold text-primary mb-1'>{task.name}</p>
                  <TextEllipsis text={task.description} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {userSelected && userSelected.tasks && (
          <div className='mt-4 flex flex-row flex-wrap gap-4 w-full justify-center p-4 max-h-60 overflow-y-auto vox-scroll-design'>
            {userSelected?.tasks.map((task) => (
              <TaskCard task={task}></TaskCard>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
