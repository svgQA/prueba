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
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

interface IFormData {
  userId: IOption;
  newPassword: string;
  confirmPassword: string;
}

export const UserPasswordPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const users = useSignal<IOption[]>([]);
  const [_, navigate] = useLocation();

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getUsers();
    }
  }, [selectedCompany, location]);

  const onSubmit = async (values: IFormData) => {
    if (
      !values.userId.value ||
      !values.newPassword ||
      !values.confirmPassword
    ) {
      ToastManager.error('s_all_required');
      return;
    }
    const response = await UserService.changePassword(
      Number(values.userId.value),
      values.newPassword,
      values.confirmPassword
    );

    if (response.getStatus()) {
      ToastManager.success('s_updated_success');
      navigate('/settings/users');
    } else {
      ToastManager.error('s_udpated_error');
    }
  };

  const getUsers = async () => {
    const _users = await UserService.getListUsers();
    if (_users.getStatus()) {
      users.value = _users.getMany();
    }
  };

  return (
    <Section className='pt-2 px-40'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='text-2xl font-bold text-primary'>
            {t('change_password')}
          </h1>
        </div>
      </div>
      <div className='flex flex-col justify-center mt-16'>
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
                        meta={meta}
                        label='g_user'
                        placeholder='p_select'
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
                        {...input}
                        id='newPassword'
                        type='password'
                        placeholder='p_new_password'
                        meta={meta}
                        label='m_password'
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
                        {...input}
                        id='confirmPassword'
                        type='password'
                        placeholder='p_confirm_password'
                        label='p_confirm_password'
                        meta={meta}
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
