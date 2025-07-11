import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Form, Field } from 'react-final-form';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { useLocation } from 'wouter';
import { Signal, useSignal } from '@preact/signals';
import { IResource } from './type';
import { GeneralService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { StatusButton } from '../../components/custom.button';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TextArea } from '@/components/common/text.area/text.area';
import { Input } from '@/components/common/input/input';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { required } from '@/utils/utilities';
import { useResourceStore } from '@/store/slices/optimusAccess/access.slice';

export const ResourceMemoSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const resources = useSignal<IResource[]>([]);

  useEffect(() => {
    document.title = t('p_resource');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      getResources();
    }
  }, [selectedCompany, location]);

  const getResources = async () => {
    const response = await GeneralService.resource();
    if (!response.getStatus()) return;
    resources.value = response.getMany();
  };
  const { setSelectedResource } = useResourceStore();
  const onSubmit = async (values: IResource) => {
    const output = {
      ...values,
      type: values.type || 'WHATSAPP',
      image: values.image || '',
      icon: values.icon || '',
    };
    const response = await GeneralService.createResource(output);
    if (!response.getStatus()) {
      ToastManager.error('s_created_error');
      return;
    }
    ToastManager.success('s_created_success');
    navigate('/memo/resource');
  };

  const handleEdit = (title: string, subtitle: string, imageUrl: string) => {
    setSelectedResource({ title, subtitle, imageUrl }); // Guardamos en el estado global
    navigate('/access/createResource'); // Redirigimos a la página de edición
  };

  const initialValues: Signal<Partial<IResource>> = useSignal({
    type: 'WHATSAPP',
  });

  return (
    <Section className='pt-2 w-full flex flex-row'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-8/12'>
        {resources.value.map((data) => (
          <CardAccess
            title={data.name}
            subtitle={data.description}
            icon='123'
            imageUrl={data.image}
            type={data.type}
            link={data.link}
            onEdit={() => handleEdit(data.name, data.description, data.image)} //vvv
          />
        ))}
      </div>
      <div className='w-4/12'>
        <div className='dark:bg-b-dark-light bg-b-light-dark p-2 rounded-md'>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues.value}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <form onSubmit={handleSubmit} id='form-resource-create'>
                <div className='flex flex-col gap-4'>
                  {/* Title field - full width */}
                  <div className='w-full'>
                    <Field<string> name='name' validate={required}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='text'
                          placeholder='Agregar Título'
                          label='Título'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  {/* Description field - full width */}
                  <div className='w-full'>
                    <Field<string> name='description' validate={required}>
                      {({ input, meta }) => (
                        <TextArea
                          {...input}
                          id='Description'
                          className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:border-cyan-500'
                          placeholder='Descripción'
                          label='Descripción'
                          type='text'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  {/* Two-column layout for remaining fields */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Left column */}
                    <div className='space-y-4'>
                      <Field<string>
                        name='type'
                        validate={required}
                        initialValue='WHATSAPP'
                      >
                        {({ input, meta }) => (
                          <Dropdown
                            id='type'
                            name={input.name}
                            value={input.value}
                            onChange={input.onChange}
                            label='Tipo de comunicación'
                            options={[
                              { value: 'WHATSAPP', label: 'WhatsApp' },
                              { value: 'EMAIL', label: 'Email' },
                              { value: 'LINK', label: 'Link' },
                            ]}
                            meta={meta}
                          />
                        )}
                      </Field>

                      <Field<string> name='link'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type='text'
                            placeholder='URL del enlace'
                            label='URL del enlace'
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>

                    {/* Right column */}
                    <div className='space-y-4'>
                      <Field<string> name='icon'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type='text'
                            placeholder='URL del icono'
                            label='URL del icono'
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  <div className='flex justify-end mt-6'>
                    <StatusButton
                      onClickClean={() => {
                        form.reset({ type: 'WHATSAPP' });
                      }}
                      submitting={submitting}
                      pristine={pristine}
                      form='form-resource-create'
                      label={'Guardar'}
                    />
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Section>
  );
};
