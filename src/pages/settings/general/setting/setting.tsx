import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Switch } from '@/components/common/switch/switch';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { IAppSetting } from '@/types/settings';
import { GeneralService } from '@/services/general';

export const GeneralSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [iconPreview, setIconPreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const initialValues: Signal<Partial<IAppSetting>> = useSignal({
    id: 0,
    primaryColor: '#000000',
    secondaryColor: '#000000',
    iconApp: '',
    logo: '',
    availableActivity: true,
  });

  useEffect(() => {
    document.title = 'VX - App Settings';
    getSettings();
  }, []);

  const getSettings = async () => {
    try {
      const response = await GeneralService.getAppSetting();
      if (!response.getStatus()) return;
      const settingsResponse = response.getOne();
      if (!settingsResponse.primaryColor) return;

      initialValues.value = {
        ...settingsResponse,
      };
      if (settingsResponse.iconApp) setIconPreview(settingsResponse.iconApp);
      if (settingsResponse.logo) setLogoPreview(settingsResponse.logo);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error al cargar la configuración', {
        position: 'top-right',
      });
    }
  };

  const handleFileChange = (
    e: Event,
    field: 'iconApp' | 'logo',
    setPreview: (value: string) => void
  ) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        initialValues.value[field] = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: IAppSetting) => {
    try {
      await GeneralService.setAppSetting(values);
      toast.success('Configuración actualizada exitosamente!', {
        position: 'top-right',
      });
      navigate('/settings');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error al actualizar la configuración', {
        position: 'top-right',
      });
    }
  };

  return (
    <Section className='p-5'>
      <Form<IAppSetting>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<IAppSetting> = {};
          if (!values.primaryColor)
            errors.primaryColor = 'Color primario requerido';
          if (!values.secondaryColor)
            errors.secondaryColor = 'Color secundario requerido';
          if (!values.iconApp) errors.iconApp = 'Ícono de la app requerido';
          if (!values.logo) errors.logo = 'Logo requerido';
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field<string> name='primaryColor' validate={required}>
                  {({ input, meta }) => (
                    <div>
                      <Input
                        {...input}
                        label='Color Primario'
                        placeholder='#000000'
                        type='color'
                        meta={meta}
                      />
                      <div
                        className='mt-2 w-full h-8 rounded'
                        style={{ backgroundColor: input.value }}
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='secondaryColor' validate={required}>
                  {({ input, meta }) => (
                    <div>
                      <Input
                        {...input}
                        label='Color Secundario'
                        placeholder='#000000'
                        type='color'
                        meta={meta}
                      />
                      <div
                        className='mt-2 w-full h-8 rounded'
                        style={{ backgroundColor: input.value }}
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Ícono de la App
                </label>
                <input
                  type='file'
                  accept='.svg'
                  onChange={(e) =>
                    handleFileChange(e, 'iconApp', setIconPreview)
                  }
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100'
                />
                {iconPreview && (
                  <div className='mt-2 p-2 border rounded'>
                    <img
                      src={iconPreview}
                      alt='Icon Preview'
                      className='max-h-20 mx-auto'
                    />
                  </div>
                )}
              </div>

              <div className='col-span-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Logo
                </label>
                <input
                  type='file'
                  accept='.svg'
                  onChange={(e) => handleFileChange(e, 'logo', setLogoPreview)}
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100'
                />
                {logoPreview && (
                  <div className='mt-2 p-2 border rounded'>
                    <img
                      src={logoPreview}
                      alt='Logo Preview'
                      className='max-h-20 mx-auto'
                    />
                  </div>
                )}
              </div>

              <div className='col-span-2'>
                <Field name='availableActivity' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='availableActivity'
                      name='availableActivity'
                      label='Actividad Disponible'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              <Button
                id='btn-clean'
                name='btn-clean'
                type='button'
                label='Limpiar'
                onClick={() => {
                  form.reset();
                  setIconPreview('');
                  setLogoPreview('');
                }}
                disabled={submitting || pristine}
              />

              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label='Guardar'
                className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
                disabled={submitting}
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
