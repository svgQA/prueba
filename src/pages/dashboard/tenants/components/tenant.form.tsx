import { type FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';

interface ICreateTenantFormProps {
  onSubmit: (values: any) => Promise<void>;
}

export const CreateTenantForm: FunctionComponent<ICreateTenantFormProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();

  const onFormSubmit = (values: any) => {
    const { phone, manager_phone, manager_email, email } = values;
    values.phone = phone.startsWith('+57') ? phone : `+57${phone}`;
    values.manager_phone = manager_phone ?? values.phone;
    values.manager_email = manager_email ?? email;
    return onSubmit(values);
  };
  return (
    <div>
      <Form
        onSubmit={onFormSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className='mb-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <h1>[TENANT] {t('h_tenant_info')}</h1>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      id='name'
                      label='l_name'
                      placeholder='h_company'
                      meta={meta}
                    />
                  )}
                </Field>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='description'
                      placeholder='p_service_software'
                      label='h_description'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
                <Field name='manager_name'>
                  {({ input }) => (
                    <Input
                      {...input}
                      id='manager_name'
                      placeholder='p_usuario_test'
                      label='l_manager_name'
                      type='text'
                    />
                  )}
                </Field>
                <Field name='manager_email'>
                  {({ input }) => (
                    <Input
                      {...input}
                      type='email'
                      id='manager_email'
                      placeholder='p_user_email'
                      label='l_manager_email'
                    />
                  )}
                </Field>
                <Field name='manager_phone'>
                  {({ input }) => (
                    <Input
                      {...input}
                      id='manager_phone'
                      placeholder='p_manager_phone'
                      label='l_manager_phone'
                      type='tel'
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <h1>[OWNER] {t('h_user_info')}</h1>
                <Field<string> name='email' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='email'
                      id='email'
                      placeholder='p_owner_email'
                      label='h_email'
                      meta={meta}
                    />
                  )}
                </Field>
                <Field<string> name='phone' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='phone'
                      placeholder='p_owner_phone'
                      label='h_phone'
                      type='tel'
                      meta={meta}
                    />
                  )}
                </Field>
                <Field<string> name='password' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      id='password'
                      placeholder='p_enter_password'
                      label='l_password'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              <button
                type='submit'
                className='px-4 py-2 bg-primary text-white rounded'
              >
                {t('h_create_tenant')}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};
