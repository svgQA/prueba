import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { required } from '@/utils/utilities';
import { IUserRequest } from '@/types/auth';
import { UserService } from '@/services/general/user';
import { getUserMode, USER_MODE_SERVICE } from './store/user';
import { navigate } from 'wouter/use-browser-location';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';
import { Section } from '@/components/common/section/section';
import { useSignal } from '@preact/signals';

export const UserCreateSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = t('p_setting');
    getDocumentTypes();
  }, []);

  const onSubmit = async (values: IUserRequest) => {
    loading.value = true;
    if (getUserMode.value.mode === USER_MODE_SERVICE.UPDATE) {
      const request = await UserService.update(values, 1);
      if (!request.getStatus()) return loading.value = false;
    } else {
      const request = await UserService.create(values);
      if (!request.getStatus()) return loading.value = false;
    }
    navigate('/dashboard/setting/setting');
    loading.value = false;
  };

  const getDocumentTypes = async (): Promise<void> => {
    await UserService.getDocumentTypes();
  };

  return (
    <Section loading={loading.value}>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className='p-4'>
          <div className='grid grid-cols-2 gap-4 py-3'>
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

            <Field<string> name='address' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Dirección'
                  label='Dirección'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>

            <Field<string> name='userType' validate={required}>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Tipo de Usuario'
                  label='Tipo de Usuario'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>
            <datalist id='userTypes'>
              <option value='USER'>Usuario</option>
              <option value='ADMIN'>Administrador</option>
              <option value='CLIENT'>Cliente</option>
            </datalist>

            <Field<string> name='cardType'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  placeholder='Tipo de Documento'
                  label='Tipo de Documento'
                  type='text'
                  meta={meta}
                />
              )}
            </Field>
          </div>
          {/* Botonera */}
          <div className='w-full flex-row flex justify-end items-center'>
            <Button
              id='btn-clean'
              name='btn-clean'
              type='button'
              label='Limpiar'
            />

            <Button
              id='btn-save'
              name='btn-save'
              type='submit'
              label='Crear Usuario'
              className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
            />
          </div>
        </form>
      )}
    />
    </Section>
  );
};
{
  /*
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
            */
}
