import { TextArea } from '@/components/common/text.area/text.area';
import { Input } from '@/components/common/input/input';
import { FunctionComponent } from 'preact';
// import { useResourceStore } from '@/store/slices/optimusAccess/access.slice';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Form, Field } from 'react-final-form';
import { required } from '@/utils/utilities';
import { Signal, useSignal } from '@preact/signals';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { Section } from '@/components/common/section/section';
import { IResource } from '../type';
import { GeneralService } from '@/services';
import { useLocation } from 'wouter';
import { Dropdown } from '@/components/common/dropdown/dropdown';

export const CreateResourceSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const { selectedResource, clearSelectedResource } = useResourceStore();
  const initialValues: Signal<Partial<IResource>> = useSignal({
    type: 'WHATSAPP',
  });

  // useEffect(() => {
  //   if (selectedResource) {
  //     initialValues.value = {
  //       name: selectedResource.title,
  //       subtitle: selectedResource.subtitle,
  //     };
  //   }
  // }, [selectedResource]);

  // const handleClickSubir = () => {
  //   fileInputRef.current?.click();
  // };

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

  return (
    <Section>
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
                  {/*
                  <div>
                    <label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200'>
                      Imagen
                    </label>
                    <Button
                      onClick={handleClickSubir}
                      className='text-gray-500 py-2 px-4 hover:bg-gray-100 transition-opacity focus:border-cyan-500'
                      id='setting-create'
                      name='setting-create'
                      type='button'
                      label='Subir Imagen'
                      icon='187'
                    />
                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          form.change('image', file);
                          ToastManager.success('Archivo seleccionado');
                        }
                      }}
                      accept='image/*'
                    />

                    {values.image && (
                      <span className='ml-2 text-sm text-gray-600'>
                        {typeof values.image === 'string'
                          ? values.image
                          : values.image.name}
                      </span>
                    )}
                  </div>
                  */}
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
    </Section>
  );
};
