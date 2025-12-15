import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useSignal } from '@preact/signals';
import { FormData, IShiftRequest } from '../interface';
import { Modal } from '@/components/common/modal/modal';
import { Button } from '@/components/common/button/button';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ServiceService, ShiftService } from '@/services';
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
import { Loading } from '@/components/common/loading/loading';

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
}: ITaskFormProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const [selectedCells, setSelectedCells] = useState<any>([]);
  const services = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});
  const schedules = useSignal<any[]>([]);
  const [tasksResponse, setTasksResponse] = useState<ITask[]>([]);
  const relatedShifts = useSignal<any[]>([]);

  const currentSchedule = useSignal<any>(null);
  const loading = useSignal<boolean>(false);

  const handleOnClose = useCallback(() => {
    setTasksResponse([]);
    setInitialValues({});
    onClose && onClose();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      Promise.all([getServices()]);
    }
  }, [selectedCompany, location]);

  const onSubmit = async (model: any, form: any) => {
    if (relatedShifts.value.length > 0) {
      ToastManager.error('s_replicate_duplicate_range_error');
      return;
    }

    const isInSchedule = isStartAndEndInSchedules(
      model.start,
      model.end,
      currentSchedule.value
    );

    if (!isInSchedule) {
      ToastManager.warning('s_updated_error_schedule');
      return;
    }

    const { employeeId, serviceId, scheduleId } = model;
    const request_model: IShiftRequest = {
      ...model,
      employeeId: employeeId?.value,
      serviceId: serviceId?.value,
      scheduleId: scheduleId?.value,
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
    handleOnClose();
    posSave?.();
  };

  const getServices = useCallback(async () => {
    const request = await ServiceService.getServicesSimpleList();
    if (request.getStatus()) {
      services.value = request.getMany();
    }
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-form-shift-close'
          label='CANCELED'
          type='button'
          onClick={handleOnClose}
          icon='041'
        />
        <Button
          id='btn-form-shift-save'
          name='btn-form-shift-save'
          type='submit'
          label={shiftId ? 'edit' : 'save'}
          form='form-shift-create-update'
          icon='041'
        />
      </div>
    ),
    []
  );

  useEffect(() => {
    if (shiftId) {
      getInitialData();
    }
  }, [shiftId]);

  const getInitialData = async () => {
    loading.value = true;
    if (!shiftId) return (loading.value = false);
    const response = await ShiftService.get_shift(shiftId);
    if (!response.getStatus()) return (loading.value = false);
    const model = response.getOne();

    await onChangeService(model.service.id, true);
    if (model.schedule.id) await onChangeSchedule(model.schedule.id);

    setInitialValues({
      employeeId: {
        value: model.employee.id,
        label: model.employee.name,
      },
      serviceId: {
        value: model.service.id,
        label: model.service.name,
      },
      scheduleId: {
        value: model.schedule?.id,
        label: model.schedule?.name,
      },
      type: model.type,
      start: model.start,
      end: model.end,
      timeBefore: model.timeBefore,
      // keywords: model.keywords.map((data) => ({ value: data, label: data })),
    });
    onTaskAdd(model.task);
    loading.value = false;
  };

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

  const onChangeService = async (id: number, initalData: boolean = false) => {
    const response = await ServiceService.getServiceById(String(id));
    if (!response.getStatus()) return;
    const model = response.getOne();

    if (model.tasks && model.tasks.length > 0 && !initalData) {
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
        acc[day.day] = day.blocks?.map((block: any) => {
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
  };

  const onTaskDelete = (id: string) => {
    setTasksResponse(tasksResponse.filter((task) => task.id !== id));
  };

  const cleanServiceSelected = () => {
    setSelectedCells([]);
    //@ts-ignore
    setTasksResponse(tasksResponse.filter((task) => task.t === 2));
  };

  const schedulesOptions = useMemo(
    () =>
      schedules.value?.map((value: any) => ({
        value: value.schedule.id,
        label: value.schedule.name,
      })),
    [schedules.value]
  );

  return (
    <Modal
      open={!!closed}
      onClose={handleOnClose}
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

        {loading.value && <Loading />}

        {relatedShifts.value.length > 0 && (
          <div className='mb-2 rounded-lg p-4 bg-b-light-light dark:bg-b-dark-light'>
            <ul className='flex flex-wrap gap-1 justify-center'>
              {relatedShifts.value?.map((shift) => (
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
                    <strong>{t('h_end_date')}: </strong>
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
              schedules={schedulesOptions}
              cleanServiceSelected={cleanServiceSelected}
              onChangeSchedule={onChangeSchedule}
              disabled={loading}
            />
          )}
        />

        <TaskFormCreate
          onSubmit={onTaskAdd}
          taskList={tasksResponse}
          onDelete={onTaskDelete}
          type='GENERAL'
          add
          selector
          disabled={loading.value}
        />
      </div>
    </Modal>
  );
};
