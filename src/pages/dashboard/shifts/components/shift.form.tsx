import { Field } from 'react-final-form';
import { useShiftWatcher } from '../utils/wath.hook';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Input } from '@/components/common/input/input';
import { useSignal } from '@preact/signals';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { useCallback } from 'preact/hooks';
import { DateField } from '@/components/compose/forms';
import { MultipleInput } from '@/components/common/multi/multi';

interface Props {
  handleSubmit: (model: any) => void;
  values: any;
  onChangeShift: (id: number, start: string, end: string) => void;
  onChangeService: (id: number) => void;
  onChangeSchedule: (id: number) => void;
  users?: IOption[];
  services?: IOption[];
  schedules?: IOption[];
  cleanServiceSelected: any;
}

export const ShiftFormContent = ({
  handleSubmit,
  onChangeShift,
  onChangeService,
  onChangeSchedule,
  users,
  services = [],
  schedules = [],
  cleanServiceSelected,
}: Props) => {
  const inputKeywords = useSignal<IOption[]>([]);
  useShiftWatcher(onChangeShift);

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
      id='form-shift-create-update'
      onKeyDown={preventKeyDown}
    >
      <div className='grid grid-cols-2 gap-3 z-50 grid-cols-en'>
        <div class='col-span-1'>
          <Field<IOption> name='employeeId' validate={required}>
            {({ input, meta }) => (
              <SmartSelector
                {...input}
                meta={meta}
                id='select-employeeId'
                icon='191'
                label='h_employee'
                options={users || []}
                menuPortalTarget={document.body}
                placeholder='p_select'
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
                id='select-service'
                placeholder='p_select'
                label='h_service'
                icon='094'
                options={services}
                menuPortalTarget={document.body}
                onChange={(e) => {
                  if (e?.value) {
                    const id = Number(e.value);
                    onChangeService(id);
                  }
                  if (!e) {
                    cleanServiceSelected();
                  }
                  input.onChange(e);
                }}
              />
            )}
          </Field>
        </div>

        <div class='col-span-1'>
          <Field<IOption> name='scheduleId' validate={required}>
            {({ input, meta }) => (
              <SmartSelector
                {...input}
                meta={meta}
                id='select-schedule'
                placeholder='p_select'
                label='h_schedule'
                icon='094'
                options={schedules}
                menuPortalTarget={document.body}
                onChange={(e) => {
                  if (e?.value) {
                    const id = Number(e.value);
                    onChangeSchedule(id);
                  }
                  if (!e) {
                    cleanServiceSelected();
                  }
                  input.onChange(e);
                }}
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
                placeholder='p_select'
                label='h_type'
                icon='252'
                options={[
                  {
                    value: 'EXTERNAL',
                    label: 'EXTERNAL',
                  },
                  {
                    value: 'INTERNAL',
                    label: 'INTERNAL',
                  },
                ]}
              />
            )}
          </Field>
        </div>

        <div class='col-span-1'>
          <DateField name='start' label='h_date_start' validate={required} />
        </div>

        <div class='col-span-1'>
          <DateField name='end' label='h_date_end' validate={required} />
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
                type='number'
                icon='325'
                label='h_time_before'
              />
            )}
          </Field>
        </div>

        <div class='col-span-1'>
          <MultipleInput
            name='input-keywords'
            value={inputKeywords.value}
            onChange={(value: IOption[], _name?: string) => {
              inputKeywords.value = value;
            }}
            placeholder='p_select'
            label='l_keywords'
            buttonIcon='044'
            icon='086'
            bottom
          />
        </div>

        {/*
        <div class='col-span-2'>
          <Field<IOption> name='task'>
            {({ input, meta }) => (
              <SmartSelector
                {...input}
                meta={meta}
                id='select-task'
                placeholder='p_select'
                label='h_task'
                button
                buttonIcon='044'
                icon='086'
                options={[
                  ...tasks.value.map((e: any) => ({
                    value: e.id,
                    label: e.description,
                  })),
                ]}
                menuPortalTarget={document.body}
                onClick={onToggleTask}
              />
            )}
          </Field>
        </div>
        */}
      </div>
    </form>
  );
};
