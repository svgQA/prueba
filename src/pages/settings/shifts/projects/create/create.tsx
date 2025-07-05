import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { UserService } from '@/services/general/user';
import { ContractService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { DateField } from '@/components/compose/forms/DateField';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  state: string;
  priority: string;
  clientId: IOption;
}

export const ProjectCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  const users = useSignal<IOption[]>([]);

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    const output = {
      ...model,
      clientId: Number(model.clientId.value),
    };

    if (id) {
      request = await ContractService.updateProject(output, id);
      message = 's_updated_success';
    } else {
      request = await ContractService.createProject(output);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/rounds/projects');
  };

  const getUsers = async () => {
    const request = await UserService.getListClients();

    if (!request.getStatus()) return;
    users.value = request.getMany();
  };

  const setInitialValues = async () => {
    if (!id) return;
    const userKeys = [
      'name',
      'description',
      'startDate',
      'endDate',
      'state',
      'priority',
      'clientId',
    ] as const;

    const request: any = await ContractService.getProject(id);
    let clientId: IOption | undefined;

    if (request.getStatus()) {
      const model = request.getOne();
      if (model?.client) {
        clientId = {
          value: model?.client?.id,
          label: model?.client?.name + ' ' + model?.client?.surname,
        };
      }
    }

    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = {
      ...model,
      clientId,
    };
  };

  useEffect(() => {
    Promise.all([getUsers(), setInitialValues()]);
  }, []);

  return (
    <Section className='pt-2'>
      <div>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues.value}
          validate={(values) => {
            const errors: Partial<FormData> = {};
            if (!values.name) errors.name = 'Campo obligatorio';
            if (!values.description) errors.description = 'Campo obligatorio';
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-project-create'
            >
              {/** FORMULARIO PRINCIPAL */}
              <div className='grid grid-cols-2 gap-3'>
                <div class='col-span-1'>
                  <Field<string> name='name' validate={required}>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type='text'
                        placeholder='Ingrese nombre...'
                        label='name'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field<IOption> name='clientId' validate={required}>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        placeholder='Selecione cliente...'
                        label='client'
                        icon='252'
                        options={users.value}
                      />
                      /*
                      <Select
                        {...input}
                        meta={meta}
                        placeholder='Selecione cliente...'
                        label='Cliente'
                        name='Cliente'
                        icon='252'
                        options={users.value}
                        optionValue='id'
                        optionLabel='fullname'
                        onChange={(e) => {
                          const id = parseInt(e.currentTarget.value);
                          input.onChange(id);
                        }}
                      />
*/
                    )}
                  </Field>
                </div>
                <div class='col-span-2'>
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        min='3'
                        max='300'
                        placeholder='Ingrese Descripción...'
                        label='description'
                        type='text'
                        meta={meta}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <Field name='priority'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione prioridad...'
                        label='priority'
                        icon='252'
                        options={[
                          { value: 'HIGH', label: 'Alta' },
                          { value: 'MEDIUM', label: 'Media' },
                          { value: 'LOW', label: 'Baja' },
                        ]}
                      />
                    )}
                  </Field>
                </div>
                <div class='col-span-1'>
                  <Field name='state'>
                    {({ input }) => (
                      <Select
                        {...input}
                        placeholder='Selecione estado...'
                        label='status'
                        icon='252'
                        options={[
                          { value: 'IN_PROGRESS', label: 'En progreso' },
                          { value: 'COMPLETED', label: 'Compleado' },
                          { value: 'PENDING', label: 'Pendiente' },
                        ]}
                      />
                    )}
                  </Field>
                </div>

                <div class='col-span-1'>
                  <DateField
                    name='startDate'
                    label='Fecha inicio'
                    validate={required}
                  />
                </div>
                <div class='col-span-1'>
                  <DateField
                    name='endDate'
                    label='Fecha fin'
                    validate={required}
                  />
                </div>
              </div>

              {/* Botonera */}
              <div className='w-full flex-row flex justify-end items-center'>
                <StatusButton
                  onClickClean={() => form.reset()}
                  submitting={submitting}
                  pristine={pristine}
                  form='form-project-create'
                  label={id ? 'edit' : 'save'}
                />
              </div>
            </form>
          )}
        />
      </div>
    </Section>
  );
};
