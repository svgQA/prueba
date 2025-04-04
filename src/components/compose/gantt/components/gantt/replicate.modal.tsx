import { ComponentType } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { UserSelector } from '@/components/common/user-selector/user-selector';
import { required } from '@/utils/utilities';
import { UserService, USER_TYPE } from '@/services/user';
import { IOption } from '@/components/common/multi/interface';

interface DateSelectorProps {
  selectedUsers: Set<string | number>;
  onDateSubmit: (
    startDate: string,
    endDate: string,
    selectedUserIds: number[]
  ) => void;
}

interface FormValues {
  startDate: string;
  endDate: string;
  users: IOption[];
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  users?: string;
}

const initialValues: FormValues = {
  startDate: '',
  endDate: '',
  users: [],
};

export const DateSelector: ComponentType<DateSelectorProps> = ({
  selectedUsers,
}) => {
  const [showDateForm, setShowDateForm] = useState(false);
  const [users, _] = useState<IOption[]>([
    {
      value: 1,
      label: 'John Doe',
    },
    {
      value: 2,
      label: 'Jo Doe',
    },
  ]);
  const hasFetchedUsers = useRef(false);
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (!hasFetchedUsers.current) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    const response = await UserService.get_all({
      userType: USER_TYPE.USER,
      items: 1000,
      page: 1,
    });
    if (!response.getStatus()) return;

    // const fetchedUsers = response.getMany();
    // setUsers(fetchedUsers);
    hasFetchedUsers.current = true;
  };

  if (selectedUsers.size === 0) return null;

  const onSubmit = (/*values: FormValues*/) => {
    // const selectedUserIds = values.users.map(user => user.value);
    // onDateSubmit(values.startDate, values.endDate, selectedUserIds);
    setShowDateForm(false);
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
          className='my-1 absolute right-0 w-96 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200'
          // onMouseLeave={handleMouseLeave}
        >
          <Form<FormValues>
            ref={formRef}
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={(values) => {
              const errors: FormErrors = {};
              if (!values.startDate) errors.startDate = 'Campo obligatorio';
              if (!values.endDate) errors.endDate = 'Campo obligatorio';
              if (!values.users || values.users.length === 0) {
                errors.users = 'Debe seleccionar al menos un usuario';
              }

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
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='text-sm text-gray-600 mb-2'>
                  Usuarios seleccionados: {selectedUsers.size}
                </div>

                <Field<IOption[]> name='users' validate={required}>
                  {({ input, meta }) => (
                    <UserSelector
                      {...input}
                      meta={meta}
                      name='users'
                      options={users}
                      multiple
                    />
                  )}
                </Field>

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
            )}
          />
        </div>
      )}
    </div>
  );
};
