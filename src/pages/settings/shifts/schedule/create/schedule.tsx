import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import WeeklyScheduler from '../components/weekly.scheduler';
import { convertBlocksToCells, getSelectedHoursByDay } from '../utils';
import { ICScheduleRequest } from '@/types/shift/shift.request';
import { ScheduleService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useTranslation } from 'react-i18next';
const START_HOUR = 0;
const END_HOUR = 24;

export const ScheduleCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<ICScheduleRequest>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  const { t } = useTranslation();

  const daysOfWeek = [
    { value: 'monday', label: t('schedule.monday') },
    { value: 'tuesday', label: t('schedule.tuesday') },
    { value: 'wednesday', label: t('schedule.wednesday') },
    { value: 'thursday', label: t('schedule.thursday') },
    { value: 'friday', label: t('schedule.friday') },
    { value: 'saturday', label: t('schedule.saturday') },
    { value: 'sunday', label: t('schedule.sunday') },
  ];

  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  // Estado compartido para las celdas seleccionadas
  const selectedCells = useSignal<{ [key: string]: boolean }>({});

  // Función para limpiar la selección - EXACTAMENTE LA MISMA que usará el botón interno
  const handleClearSelection = () => {
    selectedCells.value = {};
  };

  // Función para actualizar las celdas seleccionadas
  const handleCellChange = (newCells: { [key: string]: boolean }) => {
    selectedCells.value = newCells;
  };

  const onSubmit = async (model: ICScheduleRequest) => {
    const hoursByDay = getSelectedHoursByDay(
      daysOfWeek.map((day) => day.label),
      hours,
      selectedCells.value
    ).filter((day) => day.blocks.length > 0);
    model.daysAllowed = hoursByDay.map((day) => day.day);
    model.days = hoursByDay;

    let request;
    let message: string = id
      ? t('schedule.successEdit')
      : t('schedule.successCreate');

    if (id) {
      request = await ScheduleService.updateSchedule(model, id);
    } else {
      request = await ScheduleService.createSchedule(model);
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/rounds/schedule');
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
        acc[day.day] = day.blocks.map((block) => {
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
    <Section>
      <Form<ICScheduleRequest>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            id='form-schedule-create'
            className='space-y-6'
          >
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-1'>
              <div className='col-span-1 px-5'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      placeholder={t('schedule.namePlaceholder')}
                      label={t('schedule.name')}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <WeeklyScheduler
                  startHour={0}
                  endHour={24}
                  title=''
                  clearSelection={false}
                  selectedCells={selectedCells.value}
                  onClearSelection={handleClearSelection}
                  onCellChange={handleCellChange}
                  daysOfWeek={daysOfWeek.map((day) => day.label)}
                  hours={hours}
                />
              </div>
            </div>

            <StatusButton
              onClickClean={() => {
                handleClearSelection();
                form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-schedule-create'
              label={id ? t('schedule.edit') : t('schedule.save')}
            />
          </form>
        )}
      />
    </Section>
  );
};
