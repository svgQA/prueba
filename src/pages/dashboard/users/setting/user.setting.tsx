import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { Switch } from '@/components/common/switch/switch';
import { ModuleService } from '@/services';
import { ISettingModuleUser } from '@/types/user/user.request';
import { useSignal } from '@preact/signals';
import { Signal } from '@preact/signals';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { toast } from 'react-toastify';

export const UserSettingsPage: FunctionComponent = () => {
  const initialValues: Signal<Partial<ISettingModuleUser>> = useSignal({
    type: 'USER',
    title: 'Usuarios',
    description: 'Configuración de usuarios',
    settings: { company: false, area: false, password: false },
  });
  useEffect(() => {
    document.title = 'VX - App Settings';
    getModules();
  }, []);

  const onSubmit = async (values: ISettingModuleUser) => {
    try {
      await ModuleService.setModule(values);
      toast.success('Configuración actualizada exitosamente!', {
        position: 'top-right',
      });
    } catch (error) {
      toast.error('Error al actualizar la configuración', {
        position: 'top-right',
      });
    }
  };

  const getModules = async () => {
    const modules = await ModuleService.getModules('USER');
    const module = modules.getOne();
    // console.log(module);
    if (modules.getStatus() && module) {
      initialValues.value = {
        id: module.id,
        type: module.type,
        title: module.title,
        description: module.description,
        settings: module.settings,
      };
    }
  };

  return (
    <Section className='pt-2'>
      <Form<ISettingModuleUser>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='mb-4'>
              <h1 className='text-2xl font-bold text-primary'>
                Configuración de módulo
              </h1>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-1'>
                <Field name='settings.company' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='company'
                      name='company'
                      label='Empresa'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='settings.area' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='area'
                      name='area'
                      label='Área'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='settings.password' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='password'
                      name='password'
                      label='Contraseña'
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
