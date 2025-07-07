import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useSignal } from '@preact/signals';
import { FormData, IShiftRequest } from '../interface';
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
import { isStartAndEndInSchedules } from './validation';
import { _onTaskAddWithId } from '@/pages/settings/shifts/task/create/utils';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
import { Label } from '@aws-amplify/ui-react';
import { start } from 'node:repl';

interface ITaskFormProps {
  closed?: boolean;
  onClose?: () => void;
  posSave?: () => void;
  // userSelected?: User;
  // taskSelected?: Task;
  shiftId?: number | string;
  users?: IOption[];
  keywordsSelected?: string[];
  timeBeforeSelected?: number;
  externalSelected?: string;
}

export const TaskForm = ({
  closed,
  onClose,
  shiftId,
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
  const forms = useSignal<IOption[]>([]);
  const currentSchedule = useSignal<any>(null);

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
    const isInSchedule = isStartAndEndInSchedules(
      DateUtils.dateToInput(model.start),
      DateUtils.dateToInput(model.end),
      currentSchedule.value
    );

    if (!isInSchedule) {
      ToastManager.warning('s_updated_error_schedule');
      return;
    }

    const request_model: IShiftRequest = {
      ...model,
      employeeId: employeeId?.value,
      serviceId: serviceId?.value,
      task: tasksResponse,
    };

    if (shiftId) {
      const response = await ShiftService.updateActivity(
        request_model,
        shiftId
      );
      if (!response.getStatus()) return;
      ToastManager.success('s_updated_success');
    } else {
      const response = await ShiftService.createActivity(request_model);
      if (!response.getStatus()) return;
      ToastManager.success('s_created_success');
    }

    form.reset();
    onClose?.();
    posSave?.();
    setTasksResponse([]);
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
          label={shiftId ? 'edit' : 'save'}
          form='form-shift-create-update'
          icon='041'
        />
      </div>
    ),
    [onClose]
  );

  useEffect(() => {
    if (shiftId) {
      getInitialData();
    }
  }, [shiftId]);

  const getInitialData = async () => {
    if (!shiftId) return;
    const response = await ShiftService.get_shift(shiftId);
    if (!response.getStatus()) return;
    const model = response.getOne();

    const initialData = {
      employeeId: {
        value: model.employee.name,
        label: model.employee.id,
      },
      serviceId: {
        value: model.service.name,
        label: model.service.id,
      },
      type: {
        value: model.type,
        label: model.type,
      },
      start: model.start,
      end: model.end,
      timeBefore: model.timeBefore,
      keywords: [],
    };
    console.log(response.getOne());
  };

  /*
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
  */

  const onChangeShift = async (id: number, start: string, end: string) => {
    const response = await ShiftService.get_related({
      id,
      start: DateUtils.dateToBackend(start),
      end: DateUtils.dateToBackend(end),
    });
    if (!response.getStatus()) return;
    const outputs = response.getMany();
    relatedShifts.value = shiftId
      ? outputs.filter((shift) => shift.id !== shiftId)
      : outputs;
  };

  const onChangeService = async (id: number) => {
    const response = await ServiceService.getServiceById(String(id));
    if (!response.getStatus()) return;
    const model = response.getOne();

    if (model.tasks && model.tasks.length > 0) {
      onTaskAdd(model.tasks, 1);
    }

    const length = model.schedules.length;
    if (length < 1) return;
    schedules.value = model.schedules;
  };

  const onChangeSchedule = async (id: number) => {
    const { schedule } = schedules.value.find(
      (value) => value.scheduleId === id
    );
    currentSchedule.value = schedule;
    const days = schedule.days.reduce(
      (acc: any, day: any) => {
        acc[day.day] = day.blocks.map((block: any) => {
          return { start: block.start, end: block.end };
        });
        return acc;
      },
      {} as { [key: string]: { start: number; end: number }[] }
    );
    setSelectedCells(convertBlocksToCells(days));
  };

  const onTaskAdd = (model: any, t: number = 2) => {
    const size = tasksResponse.length + 1;
    const task = _onTaskAddWithId(model, size, t);
    setTasksResponse((prevTasks) => [...prevTasks, ...task]);
    isNewTask.value = false;
  };

  const cleanServiceSelected = () => {
    setSelectedCells([]);
    //@ts-ignore
    setTasksResponse(tasksResponse.filter((task) => task.t === 2));
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
      header={<h3>{shiftId ? t('udpate') : t('create')}</h3>}
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
                    <strong>{t('h_start_date')}: </strong>
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
              schedules={schedules.value.map((value: any) => ({
                value: value.schedule.id,
                label: value.schedule.name,
              }))}
              cleanServiceSelected={cleanServiceSelected}
              onChangeSchedule={onChangeSchedule}
              tasks={tasks}
            />
          )}
        />

        <TaskFormCreate
          onSubmit={onTaskAdd}
          forms={forms.value}
          append={isNewTask.value}
          taskList={tasksResponse}
          add
          icon='146'
        />

        {/*
        {userSelected && userSelected.tasks && (
          <div className='mt-4 flex flex-row flex-wrap gap-4 w-full justify-center p-4 max-h-60 overflow-y-auto vox-scroll-design'>
            {userSelected?.tasks.map((task) => (
              <TaskCard task={task}></TaskCard>
            ))}
          </div>
        )}
        */}
      </div>
    </Modal>
  );
};
