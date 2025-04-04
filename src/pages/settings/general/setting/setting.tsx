import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Switch } from '@/components/common/switch/switch';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { useLocation } from 'wouter';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { IAppSetting } from '@/types/settings';
import { GeneralService } from '@/services/general';

export const GeneralSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
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

      initialValues.value = {
        ...settingsResponse,
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error al cargar la configuración', {
        position: 'top-right',
      });
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
                    <Input
                      {...input}
                      label='Color Primario'
                      placeholder='#000000'
                      type='color'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='secondaryColor' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Color Secundario'
                      placeholder='#000000'
                      type='color'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='iconApp' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Ícono de la App'
                      placeholder='URL del ícono...'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='logo' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Logo'
                      placeholder='URL del logo...'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
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
                onClick={() => form.reset()}
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
