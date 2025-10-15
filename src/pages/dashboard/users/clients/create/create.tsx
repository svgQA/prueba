import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
// import { Select } from '@/components/common/select/select';
// import { Section } from '@/components/common/section/section';
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

// Interfaz para el formulario sin companyId (se envía por header)
// Solo name es obligatorio, los demás campos son opcionales
type FormData = {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  groups?: IOption[];
};

export const ClientsCreateSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const groups = useSignal<IOption[]>([]);
  const { id } = useParams();

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    // companyId se envía automáticamente por header en el backend
    const clientData = {
      name: model.name,
      description: model.description,
      email: model.email,
      phone: model.phone,
      groups: model.groups,
    };

    if (id) {
      request = await UserService.updateClient(id, clientData as any);
      message = 's_updated_success';
    } else {
      request = await UserService.createClient(clientData as any);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    go({
      to: '/users/clients',
      label: 'm_client',
      id: 'memo:novelty:state:update',
      base: 'setting',
    });
  };

  const setInitialValues = async () => {
    console.log('setInitialValues', id);
    if (!id) return;

    const userKeys = [
      'name',
      'description',
      'email',
      'phone',
      'groups',
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
  };

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    groups.value = response.getMany().map((group) => ({
      label: group.name,
      value: group.id,
    }));
  };

  useEffect(() => {
    setInitialValues();
    getGroups();
  }, []);

  return (
    <>
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
    </>
  );
};
