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
import { Section } from '@/components/common/section/section';

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
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
};

export const ClientsCreateSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const groups = useSignal<IOption[]>([]);
  const { id } = useParams();

  const loading = useSignal<boolean>(false);
  const showUserForm = useSignal<boolean>(false);
  const usersList = useSignal<UserInList[]>([]);
  const searchTerm = useSignal<string>('');

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    let request;
    let message: string;

    const clientData = {
      name: model.name,
      description: model.description,
      email: model.email,
      phone: model.phone,
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

    if (!request.getStatus()) return loading.value = false;
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

    usersList.value =
      model.users?.map((user: any) => ({
        id: user.id.toString(),
        name: user.user.name,
        surname: user.user.surname,
        email: user.user.email,
        phone: user.user.phone,
        address: user.user.address,
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

  const addUserToList = (userData: UserFormData) => {
    const newUser: UserInList = {
      id: Date.now().toString(),
      ...userData,
    };
    usersList.value = [...usersList.value, newUser];
    showUserForm.value = false;
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

  return (
    <Section className='space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design' loading={loading.value}>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<FormData> = {};
          if (!values.name) errors.name = 'Campo obligatorio';

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
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
              label={id ? 'edit' : 'save'}
            />
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-3 gap-3'>
              <div class='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      placeholder='Ingrese nombre...'
                      label='Nombre'
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
                      placeholder='Ingrese email...'
                      label='Email'
                      meta={meta}
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
                      placeholder='Ingrese teléfono...'
                      label='Teléfono'
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
                      placeholder='Ingrese Descripción...'
                      label='Descripción'
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
        )}
      />

      {/* SECCIÓN DE USUARIOS */}
      <div className='mt-6 shadow-sm p-4 rounded-lg border bg-b-light-light dark:bg-b-dark-light '>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Usuarios del cliente
          </h3>

          <Button
            name='toggle-user-form'
            onClick={toggleUserForm}
            mode='primary'
            label={showUserForm.value ? 'Ocultar Formulario' : 'Añadir Usuario'}
          />
        </div>

        {/* Formulario de Usuario */}
        {showUserForm.value && (
          <div className='mb-6 bg-white p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto'>
            <Form
              onSubmit={(values: UserFormData) => {
                addUserToList(values);
                return {}; // Reset form
              }}
              validate={(values) => {
                const errors: Partial<UserFormData> = {};
                if (!values.name) errors.name = 'Campo obligatorio';
                if (!values.surname) errors.surname = 'Campo obligatorio';
                if (!values.phone) errors.phone = 'Campo obligatorio';
                if (!values.email) errors.email = 'Campo obligatorio';
                if (!values.address) errors.address = 'Campo obligatorio';
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
                          placeholder='Ingrese nombre...'
                          label='Nombre'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='surname' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='Ingrese apellido...'
                          label='Apellido'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='phone' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='tel'
                          placeholder='Ingrese teléfono...'
                          label='Teléfono'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='email' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='email'
                          placeholder='Ingrese email...'
                          label='Email'
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field<string> name='address' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='Ingrese dirección...'
                          label='Dirección'
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
                        label='Agregar a la Lista'
                        big={true}
                      />
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        )}

        {/* Lista de Usuarios */}
        {usersList.value.length > 0 && (
          <div className='space-y-3'>
            {/* Buscador de usuarios */}
            <div className='mb-4'>
              <Input
                name='search-users'
                type='text'
                placeholder='Buscar usuarios por nombre...'
                label='Buscar usuarios'
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
                      label='Eliminar'
                      big={true}
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
