import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useSignal } from '@preact/signals';
import { FormData, IShiftRequest, ITask } from '../interface';
import { Modal } from '@/components/common/modal/modal';
import { Button } from '@/components/common/button/button';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ServiceService, ShiftService, TaskService } from '@/services';
import { Task, User } from '@/components/compose/gantt/types/public-types';
import { Badge } from '@/components/common/badge/badge';
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
import dayjs from 'dayjs';
import { ShiftFormContent } from './shift.form';
import { TextEllipsis } from '@/components/common/text-ellipsis';

type TimeBlock = {
  start: number;
  end: number;
};

type DaySchedule = {
  day: string;
  dayIndex: number;
  blocks: TimeBlock[];
};

type Schedule = {
  days: DaySchedule[];
  daysAllowed: string[];
};

type ScheduleItem = {
  schedule: Schedule;
};

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

const START_HOUR = 0;
const END_HOUR = 24;
const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);
const daysOfWeek = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

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

  const [selectedCells, setSelectedCells] = useState<any>([]);
  const services = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});
  const schedules = useSignal<any[]>([]);
  const tasks = useSignal<ITask[]>([]);
  const relatedShifts = useSignal<any[]>([]);

  const { selectedCompany } = useUserStore();
  const onSubmit = async (model: any, form: any) => {
    if (relatedShifts.value.length > 0) {
      ToastManager.error(
        'No se puede crear el turno porque existen otros en el mismo rango'
      );
      return;
    }
    const isInSchedule = isStartAndEndInSchedules(
      DateUtils.dateToInput(model.start),
      DateUtils.dateToInput(model.end),
      schedules.value
    );

    if (!isInSchedule) {
      ToastManager.warning(t('shift.upsert.errorSchedule'));
      return;
    }

    const {
      task,
      employeeId,
      serviceId,
      task_name,
      task_description,
      task_time,
    } = model;

    const model_task = tasks.value.find(
      (_task: ITask) => _task.id === task?.value
    );

    delete model.task_name;
    delete model.task_description;
    delete model.task_time;

    // TODO: Hacer la validaciòn de los horarios
    // const fecha_start = dayjs(model.start);
    // const start_day = fecha_start.format('dddd');
    // const fecha_end = dayjs(model.end);
    // const start_end = fecha_end.format('dddd');

    // TODO: Agregar lo de formulario
    const task_output =
      model_task && !task_name
        ? {
            id: model_task.id,
            name: model_task.name,
            description: model_task.description,
            hourStart: model_task.hourStart,
            type: model_task.type,
          }
        : {
            name: task_name,
            description: task_description,
            hourStart: task_time,
            type: 'GENERAL',
          };

    const request_model: IShiftRequest = {
      ...model,
      employeeId: employeeId?.value,
      serviceId: serviceId?.value,
      task: task_output,
    };

    const request = taskSelected?.id
      ? await ShiftService.updateActivity(request_model, taskSelected.id)
      : await ShiftService.createActivity(request_model);

    if (!request.getStatus()) return;
    const message = taskSelected?.id
      ? t('shifts.upsert.successEdit')
      : t('shifts.upsert.successCreate');
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

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices(), getTasks()]);
    }
  }, [selectedCompany, location]);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          id='btn-form-shift-close'
          name='btn-form-shift-close'
          label={t('shifts.upsert.buttons.cancel')}
          type='button'
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
          form='form-shift-update'
          icon='041'
        />
      </div>
    ),
    [taskSelected, onClose]
  );

  const headerContent = useMemo(
    () => (
      <h3>
        {taskSelected
          ? t('shifts.upsert.editShift')
          : t('shifts.upsert.createShift')}
      </h3>
    ),
    [taskSelected]
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
              <i className='fas fa-calendar-alt mx-1'></i>
              {DateUtils.dateToFrontend(task.start, { mode: '12' })}
            </div>
            <div>
              <i className='fas fa-flag-checkered mx-1'></i>
              {DateUtils.dateToFrontend(task.end, { mode: '12' })}
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

  const isStartAndEndInSchedules = (
    startDateStr: string,
    endDateStr: string,
    schedules: ScheduleItem[]
  ): boolean => {
    const start = dayjs.utc(startDateStr);
    const end = dayjs.utc(endDateStr);

    return schedules.some(({ schedule }) => {
      const checkTime = (date: dayjs.Dayjs) => {
        const dayIndex = date.day();
        const dayName = daysOfWeek[dayIndex];

        if (!schedule.daysAllowed.includes(dayName)) return false;

        const scheduleDay = schedule.days.find((d) => d.dayIndex === dayIndex);
        if (!scheduleDay) return false;

        const hourDecimal = date.hour() + date.minute() / 60;
        return scheduleDay.blocks.some(
          (block) => hourDecimal >= block.start && hourDecimal <= block.end
        );
      };

      return checkTime(start) && checkTime(end);
    });
  };

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
    schedules.value = model?.schedules || [];
    const schedule = model?.schedules[0]?.schedule;
    if (!schedule) return;
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
        {selectedCells && (
          <div className='mb-2 rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light'>
            <ul className='flex flex-wrap gap-1 justify-center'>
              {getSelectedHoursByDay(daysOfWeek, hours, selectedCells).map(
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
              users={users}
              services={services.value}
              setSelectedCells={setSelectedCells}
              tasks={tasks}
            />
          )}
        />
        <div className='mt-4 flex flex-row flex-wrap gap-4 w-full justify-center p-4 max-h-60 overflow-y-auto vox-scroll-design'>
          {userSelected?.tasks.map(renderTaskCard)}
        </div>
      </div>
    </Modal>
  );
};
