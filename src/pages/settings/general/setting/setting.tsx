import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Switch } from '@/components/common/switch/switch';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useEffect, useState } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import {
  CURRENCY,
  IAppSetting,
  IGeneralSetting,
  LANGUAGE,
  TIME_ZONE,
} from '@/types/settings';
import { ModuleService } from '@/services';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { Preview } from './preview';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../components/custom.button';
import { ColorPicker } from '@/components/common/color-picker/color-picker';

export const GeneralSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const [iconPreview, setIconPreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const settingsIds = useSignal<{ app: number; general: number }>({
    app: 0,
    general: 0,
  });
  const initialAppValues: Signal<IAppSetting> = useSignal({
    id: 0,
    primaryColor: '#000000',
    secondaryColor: '#000000',
    iconApp: '',
    logo: '',
    availableActivity: true,
  });

  const initialGeneralValues: Signal<IGeneralSetting> = useSignal({
    id: 0,
    multicompany: false,
    modules: [],
    language: LANGUAGE.ENGLISH,
    time_zone: TIME_ZONE.UTC,
    currency: CURRENCY.USD,
    date_format: 'dd/mm/yyyy',
    logo: '',
  });

  useEffect(() => {
    document.title = 'VX - App Settings';
    getSettings();
  }, []);

  const getSettings = async () => {
    const [responseApp, responseGeneral] = await Promise.all([
      ModuleService.getAppSetting(),
      ModuleService.getGeneralSetting(),
    ]);

    if (responseApp.getStatus()) {
      const settingsResponse = responseApp.getOne();
      initialAppValues.value = {
        ...settingsResponse.settings,
        id: settingsResponse.id,
      };
      settingsIds.value.app = settingsResponse.id;
      if (settingsResponse.settings.iconApp) {
        setIconPreview(settingsResponse.settings.iconApp);
      }
      if (settingsResponse.settings.logo) {
        setLogoPreview(settingsResponse.settings.logo);
      }
    }
    if (responseGeneral.getStatus()) {
      const settingsResponse = responseGeneral.getOne();
      initialGeneralValues.value = {
        ...settingsResponse.settings,
        id: settingsResponse.id,
      };
      settingsIds.value.general = settingsResponse.id;
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
        initialAppValues.value[field] = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitApp = async (values: IAppSetting) => {
    const response = await ModuleService.setAppSetting(
      values,
      settingsIds.value.app
    );
    if (response.getStatus()) {
      ToastManager.success(t('settings.general.success'));
    }
  };

  const onSubmitGeneral = async (values: IGeneralSetting) => {
    const response = await ModuleService.setGeneralSetting(
      values,
      settingsIds.value.general
    );
    if (response.getStatus()) {
      ToastManager.success(t('settings.general.success'));
    }
  };

  return (
    <Section className='p-5'>
      <Form<IGeneralSetting>
        onSubmit={onSubmitGeneral}
        initialValues={initialGeneralValues.value}
        validate={(values) => {
          const errors: Partial<any> = {};
          if (!values.language) errors.language = 'Idioma requerido';
          if (!values.time_zone) errors.time_zone = 'Zona horaria requerida';
          if (!values.currency) errors.currency = 'Moneda requerida';
          if (!values.date_format)
            errors.date_format = 'Formato de fecha requerido';
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-settings-general'
          >
            <h2 className='text-2xl font-bold'>Configuración General</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field name='language' type='select'>
                  {({ input, meta }) => (
                    <Dropdown
                      {...input}
                      id='language'
                      name='language'
                      label='Idioma'
                      meta={meta}
                      options={Object.values(LANGUAGE).map((language) => ({
                        label: language,
                        value: language,
                      }))}
                    />
                  )}
                </Field>
                <Field name='time_zone' type='select'>
                  {({ input, meta }) => (
                    <Dropdown
                      {...input}
                      id='time_zone'
                      name='time_zone'
                      label='Zona horaria'
                      meta={meta}
                      options={Object.values(TIME_ZONE).map((time_zone) => ({
                        label: time_zone,
                        value: time_zone,
                      }))}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='currency' type='select'>
                  {({ input }) => (
                    <Dropdown
                      {...input}
                      id='currency'
                      name='currency'
                      label='Moneda'
                      options={Object.values(CURRENCY).map((currency) => ({
                        label: currency,
                        value: currency,
                      }))}
                    />
                  )}
                </Field>
                <Field name='date_format' type='select'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      id='date_format'
                      name='date_format'
                      label='Formato de fecha'
                      placeholder='dd/mm/yyyy'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-2'>
                <Field name='multicompany' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='multicompany'
                      name='multicompany'
                      label='Multicompañía'
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
              submitting={submitting}
              pristine={pristine}
              form='form-settings-general'
            />
          </form>
        )}
      />
      <Form<IAppSetting>
        onSubmit={onSubmitApp}
        initialValues={initialAppValues.value}
        validate={(values) => {
          const errors: Partial<any> = {};
          if (!values.primaryColor)
            errors.primaryColor = 'Color primario requerido';
          if (!values.secondaryColor)
            errors.secondaryColor = 'Color secundario requerido';
          if (!values.iconApp) errors.iconApp = 'Ícono de la app requerido';
          if (!values.logo) errors.logo = 'Logo requerido';
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-settings-app'
          >
            <h2 className='text-2xl font-bold'>Configuración de la App</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field<string> name='primaryColor' validate={required}>
                  {({ input, meta }) => (
                    <ColorPicker
                      {...input}
                      label='Color Primario'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='secondaryColor' validate={required}>
                  {({ input, meta }) => (
                    <ColorPicker
                      {...input}
                      label='Color Secundario'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <Preview
                preview={iconPreview}
                label='Ícono de la App'
                onChange={(e) => handleFileChange(e, 'iconApp', setIconPreview)}
              />

              <Preview
                preview={logoPreview}
                label='Logo'
                onChange={(e) => handleFileChange(e, 'logo', setLogoPreview)}
              />

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
            <StatusButton
              onClickClean={() => {
                form.reset();
                setIconPreview('');
                setLogoPreview('');
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-settings-app'
            />
          </form>
        )}
      />
    </Section>
  );
};
