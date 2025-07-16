import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
// import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import WeeklyScheduler from '../components/weekly.scheduler';
import { convertBlocksToCells, getSelectedHoursByDay } from '../utils';
import { ICScheduleRequest } from '@/types/shift/shift.request';
import { ScheduleService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
// import { useTranslation } from 'react-i18next';
import { DAYS_OF_WEEK, HOURS } from '../constant';
import { DaySelectedModel } from '../type';
import { useNavigation } from '@/utils/hooks/navigation';

export const ScheduleCreateSettingPage: FunctionComponent = () => {
  // const { t } = useTranslation();
  const { go } = useNavigation();

  const initialValues: Signal<Partial<ICScheduleRequest>> = useSignal({});
  const { id } = useParams();

  const selectedCells = useSignal<{ [key: string]: boolean }>({});
  const handleClearSelection = () => {
    selectedCells.value = {};
  };

  const handleCellChange = (newCells: { [key: string]: boolean }) => {
    selectedCells.value = newCells;
  };

  const onSubmit = async (model: ICScheduleRequest) => {
    const hoursByDay: DaySelectedModel[] = getSelectedHoursByDay(
      DAYS_OF_WEEK,
      HOURS,
      selectedCells.value
    ).filter((day) => day.blocks.length > 0);

    model.daysAllowed = hoursByDay.map((day) => day.day.label);
    model.days = hoursByDay.map((day) => ({
      ...day,
      day: day.day.value,
    }));

    let request;
    let message = '';

    if (id) {
      request = await ScheduleService.updateSchedule(model, id);
      message = 's_updated_success';
    } else {
      request = await ScheduleService.createSchedule(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    go({
      to: '/shifts/schedule',
      label: 'm_schedule',
      id: 'shift:schedules:state',
      base: 'setting',
    });
  };

  const setInitialValues = async () => {
    if (!id) return;

    const request = await ScheduleService.getScheduleById(id);
    if (!request.getStatus()) return;
    const model = request.getOne();

    initialValues.value = {
      name: model.name,
      daysAllowed: model.daysAllowed,
      days: model.days,
    };

    const days = model.days.reduce(
      (acc, day) => {
        acc[day.day as string] = day.blocks.map((block) => {
          return { start: block.start, end: block.end };
        });
        return acc;
      },
      {} as { [key: string]: { start: number; end: number }[] }
    );
    selectedCells.value = convertBlocksToCells(days);
  };

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <>
      <Form<ICScheduleRequest>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            id='form-schedule-create'
            className='space-y-1'
          >
            <StatusButton
              onClickClean={() => {
                handleClearSelection();
                form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-schedule-create'
              label={id ? 'edit' : 'save'}
            />
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-1'>
              <div className='col-span-1 px-5'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      placeholder='p_write'
                      label='h_name'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1 max-h-[61vh] overflow-y-auto vox-scroll-design'>
                <WeeklyScheduler
                  startHour={0}
                  endHour={24}
                  title=''
                  clearSelection={false}
                  selectedCells={selectedCells.value}
                  onClearSelection={handleClearSelection}
                  onCellChange={handleCellChange}
                  daysOfWeek={DAYS_OF_WEEK}
                  hours={HOURS}
                />
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};
