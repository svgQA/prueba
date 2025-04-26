import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { Select } from '@/components/common/select/select';
import { IUserResponse } from '@/types/auth';
import { useSignal } from '@preact/signals';
import { UserService } from '@/services/user';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { toast } from 'react-toastify';

export const UserPasswordPage: FunctionComponent = () => {
  const users = useSignal<IUserResponse[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const onSubmit = async (values: any) => {
    const response = await UserService.changePassword(
      values.userId,
      values.newPassword,
      values.confirmPassword
    );
    if (response.getStatus()) {
      toast.success('Contraseña actualizada exitosamente!', {
        position: 'top-right',
      });
    } else {
      toast.error('Error al actualizar la contraseña', {
        position: 'top-right',
      });
    }
  };

  const getUsers = async () => {
    const _users = await UserService.get_all();
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
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 gap-4'>
                <div className='col-span-1'>
                  <Field name='userId'>
                    {({ input, meta }) => (
                      <Select
                        id='userId'
                        meta={meta}
                        name='userId'
                        label='Usuario'
                        placeholder='Seleccione un usuario...'
                        value={input.value}
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
                        optionLabel='name'
                        optionValue='id'
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
                      />
                    )}
                  </Field>
                </div>
              </div>
              <div className='flex justify-end space-x-4'>
                <Button
                  id='btn-clean'
                  name='btn-clean'
                  type='button'
                  label='Limpiar'
                  onClick={() => form.reset()}
                  disabled={submitting || pristine}
                />

                <Button
                  id='btn-save'
                  name='btn-save'
                  type='submit'
                  label='Guardar'
                  className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
                  disabled={submitting}
                />
              </div>
            </form>
          )}
        />
      </div>
    </Section>
  );
};
