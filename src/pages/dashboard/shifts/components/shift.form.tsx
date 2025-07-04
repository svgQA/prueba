import { Field } from 'react-final-form';
import { useShiftWatcher } from '../utils/wath.hook';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { useTranslation } from 'react-i18next';
import { FieldArray } from 'react-final-form-arrays';
import { Input } from '@/components/common/input/input';
import { useSignal } from '@preact/signals';
import { Chip } from '@/components/common/chip/chip';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { Button } from '@/components/common/button/button';
import { useCallback } from 'preact/hooks';
import { DateField } from '@/components/compose/forms';

export const ShiftFormContent = ({
  handleSubmit,
  values,
  onChangeShift,
  onChangeService,
  users,
  services,
  setSelectedCells,
  tasks,
}: any) => {
  const { t } = useTranslation();
  const inputKeywords = useSignal('');
  const isNewTask = useSignal(false);

  useShiftWatcher(onChangeShift);

  const renderNewTask = useCallback(() => {
    return (
      <div className='col-span-2 mt-4 border-t pt-3 border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium mb-4'>
          {t('shift.upsert.newTask')}
        </h3>
        <div className='grid grid-cols-2 gap-4'>
          <Field<string> name='task_name' validate={required}>
            {({ input, meta }) => (
              <Input
                {...input}
                id='input-task-name'
                type='text'
                meta={meta}
                label={t('shift.upsert.form.taskName')}
                placeholder={t('shift.upsert.form.taskNamePlaceholder')}
              />
            )}
          </Field>

          <Field<string> name='task_description' validate={required}>
            {({ input, meta }) => (
              <Input
                {...input}
                id='input-task-description'
                type='text'
                meta={meta}
                label={t('shift.upsert.form.taskDescription')}
                placeholder={t('shift.upsert.form.taskDescriptionPlaceholder')}
              />
            )}
          </Field>
        </div>
        <div className='grid grid-cols-2'>
          <Field<string> name='task_time' validate={required}>
            {({ input, meta }) => (
              <Input
                {...input}
                id='input-task-hour-start'
                type='time'
                meta={meta}
                label={t('shift.upsert.form.taskHourStart')}
                placeholder={t('shift.upsert.form.taskHourStartPlaceholder')}
              />
            )}
          </Field>
        </div>
      </div>
    );
  }, []);

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
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
                menuPortalTarget={document.body}
                placeholder={t('shifts.upsert.form.employeePlaceholder')}
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
                options={services}
                menuPortalTarget={document.body}
                onChange={(e) => {
                  if (e?.value) {
                    const id = Number(e.value);
                    onChangeService(id);
                  }
                  if (!e) {
                    setSelectedCells([]);
                  }
                  input.onChange(e);
                }}
              />
            )}
          </Field>
        </div>

        <div class='col-span-1'>
          <DateField
            name='start'
            label={t('shifts.upsert.form.startDate')}
            validate={required}
          />
        </div>

        <div class='col-span-1'>
          <DateField
            name='end'
            label={t('shifts.upsert.form.endDate')}
            validate={required}
          />
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
          <Field
            name='timeBefore'
            parse={(value) => Number(value) || undefined}
          >
            {({ input }) => (
              <Input
                {...input}
                id='input-time-before'
                type='number'
                label={t('shifts.upsert.form.timeBefore')}
              />
            )}
          </Field>
        </div>

        <div class='col-span-2'>
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
                      placeholder={t('shifts.upsert.form.keywordPlaceholder')}
                      button
                      label={t('shifts.upsert.form.keywords')}
                      buttonIcon='044'
                      onKeyUp={appendElement}
                      onClick={appendElement}
                    />
                  </div>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {values.keywords?.map((keyword: string, index: number) => (
                      <Chip
                        key={`chip-shift-word-${index}`}
                        label={keyword}
                        onDelete={() => fields.remove(index)}
                        width='lg'
                      />
                    ))}
                  </div>
                </div>
              );
            }}
          </FieldArray>
        </div>

        <div class='col-span-2 flex flex-row justify-between items-end'>
          <Field<IOption> name='task'>
            {({ input, meta }) => (
              <SmartSelector
                {...input}
                meta={meta}
                id='select-task'
                placeholder={t('shift.upsert.form.taskPlaceholder')}
                label={t('shift.upsert.form.task')}
                disabled={isNewTask.value}
                options={[
                  ...tasks.value.map((e: any) => ({
                    value: e.id,
                    label: e.description,
                  })),
                ]}
                menuPortalTarget={document.body}
              />
            )}
          </Field>
          <div className='py-1.5 mx-3'>
            <Button
              name='btn-create-task'
              icon={isNewTask.value ? '124' : '123'}
              square
              onClick={() => (isNewTask.value = !isNewTask.value)}
            />
          </div>
        </div>

        {isNewTask.value && renderNewTask()}
      </div>
    </form>
  );
};
