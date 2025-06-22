import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { useSignal } from '@preact/signals';
import { UserService } from '@/services/general/user';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useLocation } from 'wouter';

interface IFormData {
  userId: IOption;
  newPassword: string;
  confirmPassword: string;
}

export const UserPasswordPage: FunctionComponent = () => {
  const users = useSignal<IOption[]>([]);
  const [_, navigate] = useLocation();

  useEffect(() => {
    getUsers();
  }, []);

  const onSubmit = async (values: IFormData) => {
    if (
      !values.userId.value ||
      !values.newPassword ||
      !values.confirmPassword
    ) {
      ToastManager.error('Todos los campos son requeridos');
      return;
    }
    const response = await UserService.changePassword(
      Number(values.userId.value),
      values.newPassword,
      values.confirmPassword
    );

    if (response.getStatus()) {
      ToastManager.success('Contraseña actualizada exitosamente!');
      navigate('/settings/users');
    } else {
      ToastManager.error('Error al actualizar la contraseña');
    }
  };

  const getUsers = async () => {
    const _users = await UserService.getListUsers();
    if (_users.getStatus()) {
      users.value = _users.getMany();
    }
  };

  return (
    <Section className='pt-2'>
      <div className='space-y-6'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-primary'>
            Cambio de Contraseña
          </h1>
        </div>

        <Form
          onSubmit={onSubmit}
          initialValues={{}}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-password-change'
            >
              <div className='grid grid-cols-1 gap-4'>
                <div className='col-span-1'>
                  <Field<IOption> name='userId'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        id='userId'
                        meta={meta}
                        name='userId'
                        label='Usuario'
                        placeholder='Seleccione un usuario...'
                        options={users.value}
                      />
                    )}
                  </Field>
                </div>

                <div className='col-span-1'>
                  <Field
                    name='newPassword'
                    validate={(value) => {
                      const passwordRegex =
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
                      if (!passwordRegex.test(value)) {
                        return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
                      }
                    }}
                  >
                    {({ input, meta }) => (
                      <Input
                        id='newPassword'
                        name='newPassword'
                        type='password'
                        placeholder='Ingrese la nueva contraseña...'
                        meta={meta}
                        label='Nueva Contraseña'
                        value={input.value}
                        onChange={input.onChange}
                        autoComplete='new-password'
                      />
                    )}
                  </Field>
                </div>

                <div className='col-span-1'>
                  <Field
                    name='confirmPassword'
                    validate={(value) => {
                      if (value !== values.newPassword) {
                        return 'Las contraseñas no coinciden';
                      }
                    }}
                  >
                    {({ input, meta }) => (
                      <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        placeholder='Confirmar contraseña...'
                        label='Confirmar Contraseña'
                        value={input.value}
                        meta={meta}
                        onChange={input.onChange}
                        autoComplete='new-password'
                      />
                    )}
                  </Field>
                </div>
              </div>
              <div className='flex justify-end space-x-4'>
                <StatusButton
                  onClickClean={() => form.reset()}
                  submitting={submitting}
                  pristine={pristine}
                  form='form-password-change'
                  label='save'
                />
              </div>
            </form>
          )}
        />
      </div>
    </Section>
  );
};
