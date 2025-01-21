import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { required } from '@/utils/utilities';
import { IUserRequest } from '@/types/auth';
import { UserService } from '@/services/user';
import { getUserMode, USER_MODE_SERVICE } from './store/user';
import { navigate } from 'wouter/use-browser-location';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';

export const UserCreateSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'User Create Settings';
  }, []);

  const onSubmit = async (values: IUserRequest) => {
    if (getUserMode.value.mode === USER_MODE_SERVICE.UPDATE) {
      const request = await UserService.update(values, 1);
      if (!request.getStatus()) return;
    } else {
      const request = await UserService.create(values);
      if (!request.getStatus()) return;
    }
    navigate('/dashboard/setting/setting');
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className='p-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Field<string> name='name' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Nombre'
                  label='Nombre'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='surname' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Apellido'
                  label='Apellido'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='email' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Email'
                  label='Email'
                  type='email'
                  meta={meta}
                  normal
                />
              )}
            </Field>

            <Field<string> name='phone'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Teléfono'
                  label='Teléfono'
                  type='tel'
                  meta={meta}
                  normal
                />
              )}
            </Field>

            {/*
            <Field<string> name='cardId'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='ID de Tarjeta'
                  label='ID de Tarjeta'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.country'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='País'
                  label='País'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.state'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Estado/Provincia'
                  label='Estado/Provincia'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.city'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Ciudad'
                  label='Ciudad'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.job'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Trabajo'
                  label='Trabajo'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.area'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Área'
                  label='Área'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='extraData.sucursal'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Sucursal'
                  label='Sucursal'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>
            */}
          </div>

          <Button
            type='submit'
            id='btn-save-user'
            name='btn-save-user'
            icon='123'
            label='Crear Usuario'
          />
        </form>
      )}
    />
  );
};
