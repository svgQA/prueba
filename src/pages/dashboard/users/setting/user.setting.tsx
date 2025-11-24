import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { Switch } from '@/components/common/switch/switch';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { ModuleService } from '@/services';
import { IUserSetting } from '@/types/settings';
import { useSignal } from '@preact/signals';
import { Signal } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useUserStore } from '@/store/slices';

export const SUserSettingsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const settingsIds = useSignal<{ user: number }>({ user: 0 });
  const initialValues: Signal<IUserSetting> = useSignal({
    id: 0,
    name: '',
    allow_areas: false,
    allow_roles: false,
    allow_users: false,
    allow_groups: false,
    allow_departments: false,
    allow_positions: false,
    allow_permissions: false,
    allow_update_password: false,
    allow_update_profile: false,
  });

  useEffect(() => {
    document.title = t('p_setting');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getModules();
    }
  }, [selectedCompany, location]);

  const onSubmit = async (values: IUserSetting) => {
    const response = await ModuleService.setUserSetting(
      values,
      settingsIds.value.user
    );
    if (response.getStatus()) {
      ToastManager.success('s_updated_success');
    }
  };

  const getModules = async () => {
    const modules = await ModuleService.getUserSetting();
    if (!modules.getStatus()) return;
    settingsIds.value.user = modules.getOne().id;
    const userResponse = modules.getOne();
    initialValues.value = {
      ...userResponse.settings,
    };
  };

  return (
    <Section className='p-5'>
      <Form<IUserSetting>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-settings-users'
          >
            <h2 className='text-lg font-bold'>{t('setting')}</h2>
            <div className='grid grid-cols-1 gap-3'>
              <div className='col-span-3'>
                <Field<string> name='name'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='h_name'
                      placeholder='p_write'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>

            <h2 className='text-lg font-bold'>{t('m_module')}</h2>
            <div className='grid grid-cols-7 gap-4 flex-wrap'>
              <div className='col-span-1'>
                <Field name='allow_areas' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_areas'
                      name='allow_areas'
                      label={t('area')}
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_roles' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_roles'
                      name='allow_roles'
                      label='m_role'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_users' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_users'
                      name='allow_users'
                      label='h_user'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_groups' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_groups'
                      name='allow_groups'
                      label='group'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_departments' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_departments'
                      name='allow_departments'
                      label='h_department'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_positions' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_positions'
                      name='allow_positions'
                      label='h_location'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='allow_permissions' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_permissions'
                      name='allow_permissions'
                      label='h_permission'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
            </div>

            <h2 className='text-lg font-bold'>{t('profile')}</h2>
            <div className='grid grid-cols-1 gap-3'>
              <div className='col-span-3'>
                <Field name='allow_update_password' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_update_password'
                      name='allow_update_password'
                      label='m_password'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-3'>
                <Field name='allow_update_profile' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_update_profile'
                      name='allow_update_profile'
                      label='update'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
            </div>

            <StatusButton
              onClickClean={() => {
                form.reset();
              }}
              top={false}
              submitting={submitting}
              pristine={pristine}
              form='form-settings-users'
            />
          </form>
        )}
      />
    </Section>
  );
};
