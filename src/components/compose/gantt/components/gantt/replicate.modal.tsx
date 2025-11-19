import { ComponentType } from 'preact';
import { useState } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { required, validate_min_len } from '@/utils/utilities';
import { IOption } from '@/components/common/multi/interface';
import { ShiftService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { DateUtils } from '@/utils/utilities/dates';
import { useTranslation } from 'react-i18next';

interface ReplicateModalProps {
  selectedUsers: Set<string | number>;
  users?: IOption[];
  onDateSubmit: (
    startDate: string,
    endDate: string,
    selectedUserIds: number[]
  ) => void;
  onReloadSignal?: () => void;
}

export interface FormValues {
  startDate: string;
  endDate: string;
  replacements: {
    originalUserId: string | number;
    replacementUserId: IOption[];
  }[];
  iterations: string;
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  replacements?: string;
  iterations?: string;
}

const initialValues: FormValues = {
  startDate: '',
  endDate: '',
  replacements: [],
  iterations: '1',
};

export const ReplicateModal: ComponentType<ReplicateModalProps> = ({
  selectedUsers,
  users,
  onReloadSignal,
}) => {
  const [showDateForm, setShowDateForm] = useState(false);
  const { t } = useTranslation();
  if (selectedUsers.size === 0) return null;

  const onSubmit = async (values: FormValues, form: any) => {
    values.endDate = DateUtils.dateToBackend(values.endDate);
    values.startDate = DateUtils.dateToBackend(values.startDate);

    const response = await ShiftService.setReplicateV2(values);
    if (!response.getStatus()) {
      ToastManager.error('Error replicating shifts');
      return;
    }
    ToastManager.success('Shifts replicated successfully');
    form.reset();
    setShowDateForm((prev) => !prev);
    onReloadSignal?.();
  };

  return (
    <div className='relative'>
      <Button
        name='btn-replicate'
        label='Replicar'
        icon='039'
        rounded={false}
        mode='primary'
        onClick={() => setShowDateForm((prev) => !prev)}
      />

      {showDateForm && (
        <div className='my-3 absolute right-0 bg-white dark:bg-b-dark-dark rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700 w-[600px]'>
          <Form<FormValues>
            onSubmit={onSubmit}
            initialValues={initialValues}
            mutators={{
              ...arrayMutators,
            }}
            validate={(values) => {
              const errors: FormErrors = {};
              if (!values.startDate)
                errors.startDate = t('error.missing_required_field');
              if (!values.endDate)
                errors.endDate = t('error.missing_required_field');

              if (values.startDate && values.endDate) {
                const start = new Date(values.startDate);
                const end = new Date(values.endDate);
                if (start > end) {
                  errors.endDate = t('error.invalid_end_date');
                }
              }

              return errors;
            }}
            render={({ handleSubmit, submitting, pristine, form }) => {
              if (
                selectedUsers.size > 0 &&
                (!form.getState().values.replacements ||
                  form.getState().values.replacements.length === 0 ||
                  form.getState().values.replacements.length !==
                    selectedUsers.size)
              ) {
                const initialReplacements = Array.from(selectedUsers).map(
                  (userId) => ({
                    originalUserId: userId,
                    replacementUserId: [],
                  })
                );

                form.change('replacements', initialReplacements);
              }

              return (
                <form
                  onSubmit={handleSubmit}
                  className='space-y-4 relative'
                  id='replicate-form-id'
                >
                  <div className='grid grid-cols-2 gap-4'>
                    <Field<string> name='startDate' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='h_date_start'
                          type='date'
                          meta={meta}
                        />
                      )}
                    </Field>

                    <Field<string> name='endDate' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='h_date_end'
                          type='date'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <Field<string> name='iterations' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        label='h_iteration'
                        type='number'
                        min='1'
                        max='100'
                        meta={meta}
                      />
                    )}
                  </Field>

                  <div className='py-3 border-y border-gray-100 dark:border-gray-700 border-dashed'>
                    <div className='space-y-4 max-h-[400px] overflow-y-auto vox-scroll-design px-1 overflow-x-hidden py-2'>
                      <div className='grid grid-cols-2 gap-4 font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md'>
                        <div>Usuario Original</div>
                        <div>Usuario de Reemplazo</div>
                      </div>
                      <FieldArray name='replacements'>
                        {({ fields }) => (
                          <div className='space-y-4'>
                            {fields.map((name, index) => {
                              const fieldValue = fields.value[index];
                              const originalUserId = fieldValue
                                ? fieldValue.originalUserId
                                : null;
                              const originalUser = users?.find(
                                (u) => u.value === originalUserId
                              );

                              if (!originalUser) return null;

                              return (
                                <div
                                  key={originalUserId}
                                  className='grid grid-cols-2 items-center'
                                >
                                  <div className='text-sm text-gray-900 dark:text-gray-200'>
                                    {originalUser.label}
                                  </div>
                                  <div className='relative'>
                                    <Field<IOption[]>
                                      name={`${name}.replacementUserId`}
                                      validate={validate_min_len(1)}
                                    >
                                      {({ input, meta }) => (
                                        <SmartSelector<IOption[]>
                                          {...input}
                                          meta={meta}
                                          name={`${name}.replacementUserId`}
                                          options={users || []}
                                          multiple={true}
                                          allowAll={true}
                                          menuPortalTarget={document.body}
                                          placeholder='h_selected_user_replacement'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  <div className='flex justify-end gap-2 items-center'>
                    <Button
                      id='btn-submit'
                      name='btn-submit'
                      type='submit'
                      label='save'
                      icon='332'
                      mode='primary'
                      form='replicate-form-id'
                      disabled={submitting || pristine}
                    />
                    <Button
                      id='btn-cancel'
                      name='btn-cancel'
                      type='button'
                      label='cancel'
                      icon='231'
                      onClick={() => setShowDateForm(false)}
                      disabled={submitting}
                    />
                  </div>
                </form>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
