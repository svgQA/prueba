import { ComponentType } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { UserSelector } from '@/components/common/user-selector/user-selector';
import { required } from '@/utils/utilities';
import { IOption } from '@/components/common/multi/interface';
import { ShiftService } from '@/services';
import { toast } from 'react-toastify';

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
  const formRef = useRef<any>(null);

  // const hasFetchedUsers = useRef(false);
  // useEffect(() => {
  //   if (!hasFetchedUsers.current) {
  //     getUsers();
  //   }
  // }, []);

  // const getUsers = async () => {
  //   const response = await UserService.get_all({
  //     userType: USER_TYPE.USER,
  //     items: 1000,
  //     page: 1,
  //   });
  //   if (!response.getStatus()) return;
  //   // const fetchedUsers = response.getMany();
  //   // setUsers(fetchedUsers);
  //   hasFetchedUsers.current = true;
  // };

  if (selectedUsers.size === 0) return null;

  const onSubmit = async (values: FormValues) => {
    // const selectedUserIds = values.users.map(user => user.value);
    // onDateSubmit(values.startDate, values.endDate, selectedUserIds);
    const response = await ShiftService.setReplicateV2(values);
    if (!response.getStatus()) {
      toast.error('Error replicating shifts');
      return;
    }
    toast.success('Shifts replicated successfully');
    setShowDateForm((prev) => !prev);
    onReloadSignal?.();
  };

  // const handleMouseLeave = (e: MouseEvent) => {
  //   const target = e.target as HTMLElement;
  //   const relatedTarget = e.relatedTarget as HTMLElement;
  //
  //   // Solo cerrar si el mouse sale completamente del modal y no entra en ningún elemento hijo
  //   if (!target.contains(relatedTarget)) {
  //     setShowDateForm(false);
  //   }
  // };

  return (
    <div className='relative'>
      <button
        className='px-2 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
        onClick={() => setShowDateForm((prev) => !prev)}
      >
        Replicar
      </button>

      {showDateForm && (
        <div
          className='my-3 absolute right-0 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200 w-[500px]'
          // onMouseLeave={handleMouseLeave}
        >
          <Form<FormValues>
            ref={formRef}
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
              // Inicializar el array de reemplazos si es necesario
              if (
                selectedUsers.size > 0 &&
                (!form.getState().values.replacements ||
                  form.getState().values.replacements.length === 0)
              ) {
                // Usar un efecto de una sola vez para inicializar
                const initialReplacements = Array.from(selectedUsers).map(
                  (userId) => ({
                    originalUserId: userId,
                    replacementUserId: [],
                  })
                );

                // Inicializar de inmediato sin setTimeout
                form.change('replacements', initialReplacements);
              }

              return (
                <form onSubmit={handleSubmit} className='space-y-4'>
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

                  <div className='py-3 border-y border-gray-100 border-dashed'>
                    <div className='space-y-4 max-h-96 overflow-y-auto vox-scroll-design'>
                      <div className='grid grid-cols-2 gap-4 font-medium text-sm text-gray-500 uppercase tracking-wider bg-gray-50 p-2 rounded-md'>
                        <div>Usuario Original</div>
                        <div>Usuario de Reemplazo</div>
                      </div>
                      <FieldArray name='replacements'>
                        {({ fields }) => (
                          <div>
                            {fields.map((name, index) => {
                              // Obtener el ID del usuario original del valor actual
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
                                  <div className='text-sm text-gray-900'>
                                    {originalUser.label}
                                  </div>
                                  <div>
                                    <Field<IOption[]>
                                      name={`${name}.replacementUserId`}
                                      validate={required}
                                    >
                                      {({ input, meta }) => {
                                        return (
                                          <UserSelector
                                            {...input}
                                            meta={meta}
                                            name={`${name}.replacementUserId`}
                                            options={users || []}
                                            multiple={true}
                                          />
                                        );
                                      }}
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
                      className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
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
