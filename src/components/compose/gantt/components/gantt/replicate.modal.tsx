import { ComponentType } from 'preact';
import { useState } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { required } from '@/utils/utilities';
import { IOption } from '@/components/common/multi/interface';
import { ShiftService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';

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
  if (selectedUsers.size === 0) return null;

  const onSubmit = async (values: FormValues) => {
    const response = await ShiftService.setReplicateV2(values);
    if (!response.getStatus()) {
      ToastManager.error('Error replicating shifts');
      return;
    }
    ToastManager.success('Shifts replicated successfully');
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
              if (!values.startDate) errors.startDate = 'Campo obligatorio';
              if (!values.endDate) errors.endDate = 'Campo obligatorio';

              if (values.startDate && values.endDate) {
                const start = new Date(values.startDate);
                const end = new Date(values.endDate);
                if (start > end) {
                  errors.endDate =
                    'La fecha final debe ser posterior a la fecha inicial';
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
                <form onSubmit={handleSubmit} className='space-y-4 relative'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field<string> name='startDate' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='Fecha de Inicio'
                          type='date'
                          meta={meta}
                        />
                      )}
                    </Field>

                    <Field<string> name='endDate' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          label='Fecha Final'
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
                        label='Iteraciones'
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
                                      validate={required}
                                    >
                                      {({ input, meta }) => (
                                        <SmartSelector
                                          {...input}
                                          meta={meta}
                                          name={`${name}.replacementUserId`}
                                          options={users || []}
                                          multiple={true}
                                          allowAll={true}
                                          menuPortalTarget={document.body}
                                          placeholder='Selecciona usuarios de reemplazo'
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
                      id='btn-cancel'
                      name='btn-cancel'
                      type='button'
                      label='Cancelar'
                      onClick={() => setShowDateForm(false)}
                      disabled={submitting}
                    />
                    <Button
                      id='btn-submit'
                      name='btn-submit'
                      type='submit'
                      label='Crear'
                      mode='primary'
                      disabled={submitting || pristine}
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
