import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { GeneralService, UserService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useNavigation } from '@/utils/hooks/navigation';
import {
  IOption,
  SmartSelector,
} from '@/components/common/smart-selector/smart-select';
import { Button } from '@/components/common/button/button';
import { USER_TYPE } from '@/types/user/user.enum';
import { Select } from '@/components/common/select/select';
import { type TargetedEvent } from 'preact/compat';
import { Section } from '@/components/common/section/section';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

type FormData = {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  groups?: IOption[];
};

type UserFormData = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
};

type UserInList = {
  id: string;
  oldUser: boolean;
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
  owner?: boolean | null;
};

export const ClientsCreateSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const groups = useSignal<IOption[]>([]);
  const { id } = useParams();
  const { t } = useTranslation();

  const currentUsers = useSignal<IOption[]>([]);
  const usersData = useSignal<any[]>([]);

  const loading = useSignal<boolean>(false);
  const showUserForm = useSignal<boolean>(false);
  const usersList = useSignal<UserInList[]>([]);
  const searchTerm = useSignal<string>('');
  const selectedUserId = useSignal<string | number>('');
  const clientEmail = useSignal<string>('');
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    if (selectedCompany) {
      getUsers();
    }
  }, [selectedCompany]);

  const convertPhone = (phone: string): string => {
    if (!phone) return '';
    const trimmedPhone = phone.trim();
    if (trimmedPhone.startsWith('+57')) return trimmedPhone;
    if (trimmedPhone.startsWith('57')) return `+${trimmedPhone}`;
    return `+57${trimmedPhone}`;
  };

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    let request;
    let message: string;

    const clientData = {
      name: model.name,
      description: model.description,
      email: model.email,
      phone: convertPhone(model.phone!!),
      groups: model.groups,
      users: usersList.value,
    };

    if (id) {
      request = await UserService.updateClient(id, clientData as any);
      message = 's_updated_success';
    } else {
      request = await UserService.createClient(clientData as any);
      message = 's_created_success';
    }

    if (!request.getStatus()) return (loading.value = false);
    ToastManager.success(message);
    go({
      to: '/users/clients',
      label: 'm_client',
      id: 'memo:novelty:state:update',
      base: 'setting',
    });
    loading.value = false;
  };

  const setInitialValues = async () => {
    loading.value = true;
    if (!id) return;

    const userKeys = [
      'name',
      'description',
      'email',
      'phone',
      'groups',
      'users',
    ] as const;

    const request: any = await UserService.getClient(id);
    const model = pick(omitBy(request.model, isNull), userKeys);

    initialValues.value = {
      ...model,
      groups: model.groups.map(
        (value: { group: { name: string; id: number } }) => ({
          label: value.group.name,
          value: value.group.id,
        })
      ),
    };

    clientEmail.value = model.email || '';

    usersList.value =
      model.users?.map((user: any) => ({
        id: user.userId.toString(),
        name: user.user.name,
        surname: user.user.surname,
        email: user.user.email,
        phone: user.user.phone,
        address: user.user.address,
        owner: user.owner,
        oldUser: true,
      })) || [];
    loading.value = false;
  };

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    groups.value = response.getMany().map((group) => ({
      label: group.name,
      value: group.id,
    }));
  };

  const toggleUserForm = () => {
    showUserForm.value = !showUserForm.value;
  };

  const getUsers = async () => {
    const response = await UserService.get_all({
      userType: USER_TYPE.EXTERNAL,
      page: 1,
      items: 1000,
    });
    if (!response.getStatus()) return;
    const users = response.getMany();
    usersData.value = users;
    currentUsers.value = users.map((user) => ({
      label: user.name,
      value: user.id,
    }));
  };

  const isEmailAlreadyInList = (email: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();

    if (
      clientEmail.value &&
      clientEmail.value.toLowerCase().trim() === normalizedEmail
    ) {
      return true;
    }

    return usersList.value.some(
      (user) => user.email.toLowerCase().trim() === normalizedEmail
    );
  };

  const addUserToList = (userData: UserFormData) => {
    if (isEmailAlreadyInList(userData.email)) {
      const normalizedEmail = userData.email.toLowerCase().trim();
      const isClientEmail =
        clientEmail.value &&
        clientEmail.value.toLowerCase().trim() === normalizedEmail;
      ToastManager.warning(
        isClientEmail
          ? 'Este correo electrónico pertenece al cliente'
          : 'Este correo electrónico ya está en la lista'
      );
      return;
    }

    userData.phone = convertPhone(userData.phone);
    const newUser: UserInList = {
      id: Date.now().toString(),
      oldUser: false,
      ...userData,
    };
    usersList.value = [...usersList.value, newUser];
    showUserForm.value = false;
  };

  const handleUserSelect = (event: TargetedEvent<HTMLSelectElement>) => {
    const userId = event.currentTarget.value;
    if (!userId) return;

    selectedUserId.value = userId;

    const userExists = usersList.value.some(
      (user) => user.id === userId.toString()
    );
    if (userExists) {
      ToastManager.warning('Este usuario ya está en la lista');
      selectedUserId.value = '';
      return;
    }

    const selectedUser = usersData.value.find(
      (user) => user.id.toString() === userId.toString()
    );

    if (!selectedUser) {
      ToastManager.error('Usuario no encontrado');
      selectedUserId.value = '';
      return;
    }

    const userEmail = selectedUser.email || '';
    if (isEmailAlreadyInList(userEmail)) {
      const normalizedEmail = userEmail.toLowerCase().trim();
      const isClientEmail =
        clientEmail.value &&
        clientEmail.value.toLowerCase().trim() === normalizedEmail;
      ToastManager.warning(
        isClientEmail
          ? 'Este correo electrónico pertenece al cliente'
          : 'Este correo electrónico ya está en la lista'
      );
      selectedUserId.value = '';
      return;
    }

    const newUser: UserInList = {
      id: selectedUser.id.toString(),
      oldUser: true,
      name: selectedUser.name || '',
      surname: selectedUser.surname || '',
      phone: selectedUser.phone || '',
      email: userEmail,
      address: selectedUser.address || '',
    };

    usersList.value = [...usersList.value, newUser];
    selectedUserId.value = '';
  };

  const removeUserFromList = (userId: string) => {
    usersList.value = usersList.value.filter((user) => user.id !== userId);
  };

  const filteredUsers = () => {
    if (!searchTerm.value.trim()) {
      return usersList.value;
    }
    return usersList.value.filter((user) =>
      `${user.name} ${user.surname}`
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
  };

  useEffect(() => {
    setInitialValues();
    getGroups();
  }, []);

  const validatedPhone = (phone: string) => {
    const trimmedPhone = phone.trim();
    if (!/^\+?57\d{10}$/.test(trimmedPhone.replace(/\s/g, ''))) {
      return 'El formato debe ser +57 seguido de 10 dígitos';
    }
    return '';
  };

  return (
    <Section
      className='space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'
      loading={loading.value}
    >
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<FormData> = {};
          if (!values.name) errors.name = t('missing_required_field');
          if (values.phone) {
            const phoneError = validatedPhone(values.phone!!);
            if (phoneError) errors.phone = phoneError;
          }
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          if (values.email && clientEmail.value !== values.email) {
            clientEmail.value = values.email || '';
          }
          return (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-place-create'
            >
              <StatusButton
                onClickClean={() => {
                  () => form.reset();
                }}
                submitting={submitting}
                pristine={pristine}
                form='form-place-create'
                label={id ? 'edit' : 'btnSave'}
              />
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                <div class='col-span-1'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='h_name'
                        label='h_name'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<string> name='email'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='email'
                        placeholder='h_email'
                        label='h_email'
                        meta={meta}
                        onChange={(e) => {
                          input.onChange(e);
                          clientEmail.value = e.currentTarget.value;
                        }}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field<string> name='phone'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='tel'
                        placeholder='h_phone'
                        label='h_phone'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-3'>
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        min='3'
                        max='300'
                        placeholder='h_description'
                        label='h_description'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-3'>
                  <Field<IOption> name='groups'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='groups'
                        label='l_groups'
                        placeholder='p_select'
                        icon='231'
                        multiple={true}
                        allowAll={true}
                        options={groups.value}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </form>
          );
        }}
      />

      <div className='mt-6 shadow-sm p-4 rounded-lg border bg-b-light-light dark:bg-b-dark-light '>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
            {t('users.client.users_client.title')}
          </h3>

          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
            <div className='flex-1 sm:flex-initial sm:min-w-[300px]'>
              <Select
                name='users'
                placeholder='h_user_existing'
                label='h_user_existing'
                icon='252'
                options={currentUsers.value}
                optionValue='value'
                optionLabel='label'
                value={selectedUserId.value}
                onChange={handleUserSelect}
              />
            </div>

            <Button
              name='toggle-user-form'
              onClick={toggleUserForm}
              mode='primary'
              label={showUserForm.value ? 'h_hide_form' : 'h_add_user'}
            />
          </div>
        </div>

        {showUserForm.value && (
          <div className='mb-6 bg-white p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto'>
            <Form
              onSubmit={(values: UserFormData) => {
                addUserToList(values);
                return {};
              }}
              validate={(values) => {
                const errors: Partial<UserFormData> = {};
                if (!values.name) errors.name = t('missing_required_field');
                if (!values.surname)
                  errors.surname = t('missing_required_field');
                if (!values.phone) errors.phone = t('missing_required_field');
                if (!values.email) {
                  errors.email = t('missing_required_field');
                } else if (isEmailAlreadyInList(values.email)) {
                  const normalizedEmail = values.email.toLowerCase().trim();
                  const isClientEmail =
                    clientEmail.value &&
                    clientEmail.value.toLowerCase().trim() === normalizedEmail;
                  errors.email = isClientEmail
                    ? t('email_have_client')
                    : t('email_already_in_list');
                }
                if (values.phone) {
                  const phoneError = validatedPhone(values.phone!!);
                  if (phoneError) errors.phone = phoneError;
                }
                if (!values.address)
                  errors.address = t('missing_required_field');
                if (!values.name) errors.name = t('missing_required_field');
                if (!values.name) errors.surname = t('missing_required_field');
                return errors;
              }}
              render={({ handleSubmit, submitting, pristine }) => (
                <form onSubmit={handleSubmit} className='space-y-4 pb-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Field<string> name='name' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='h_name'
                          label='h_name'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='surname' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='h_surname'
                          label='h_surname'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='phone' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='tel'
                          placeholder='h_phone'
                          label='h_phone'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='email' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='email'
                          placeholder='h_email'
                          label='h_email'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='address' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='h_address'
                          label='h_address'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <div className='flex items-end justify-end'>
                      <Button
                        name='add-user-to-list'
                        type='submit'
                        mode='primary'
                        disabled={submitting || pristine}
                        label='btnSave'
                        big={true}
                      />
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        )}

        {usersList.value.length > 0 && (
          <div className='space-y-3'>
            <div className='mb-4'>
              <Input
                name='search-users'
                type='text'
                placeholder='h_search_users'
                label='h_search_users'
                value={searchTerm.value}
                onChange={(e) => (searchTerm.value = e.currentTarget.value)}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredUsers().map((user) => (
                <div
                  key={user.id}
                  className='bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between'
                >
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900 mb-2'>
                      {user.name} {user.surname}
                    </div>
                    <div className='text-sm text-gray-600 mb-1'>
                      {user.email}
                    </div>
                    <div className='text-sm text-gray-600 mb-1'>
                      {user.phone}
                    </div>
                    <div className='text-sm text-gray-500'>{user.address}</div>
                  </div>
                  <div className='mt-3 flex justify-end'>
                    <Button
                      name={`remove-user-${user.id}`}
                      onClick={() => removeUserFromList(user.id)}
                      mode='primary'
                      label='clean'
                      big={true}
                      disabled={user.owner === true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
