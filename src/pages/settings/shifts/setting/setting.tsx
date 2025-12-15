import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';
import { Switch } from '@/components/common/switch/switch';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { IShiftSetting } from '@/types/settings';
import { ModuleService } from '@/services';
import { StatusButton } from '../../components/custom.button';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

export const SShiftSettingPage: FunctionComponent = () => {
  const settingsIds = useSignal<{ shift: number }>({ shift: 0 });
  const initialValues: Signal<IShiftSetting> = useSignal({
    name: '',
    time_checkin_min: 0,
    time_checkin_max: 0,
    time_checkout_min: 0,
    time_checkout_max: 0,
    distance_checkin_max: 0,
    distance_checkout_max: 0,
    allow_shift: false,
    allow_service: false,
    allow_contract: false,
    allow_round: false,
    allow_task: false,
    create_shift: false,
  });

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_setting');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getSettings();
    }
  }, [selectedCompany, location]);

  const getSettings = async () => {
    const response = await ModuleService.getShiftSetting();
    if (!response.getStatus()) return;
    const shiftResponse = response.getOne();
    settingsIds.value.shift = shiftResponse.id;
    initialValues.value = {
      ...shiftResponse.settings,
    };
  };

  const onSubmit = async (values: any) => {
    const model: IShiftSetting = {
      ...values,
      time_checkin_min: parseInt(values.time_checkin_min || '0', 10),
      time_checkin_max: parseInt(values.time_checkin_max || '0', 10),
      time_checkout_min: parseInt(values.time_checkout_min || '0', 10),
      time_checkout_max: parseInt(values.time_checkout_max || '0', 10),
      distance_checkin_max: parseInt(values.distance_checkin_max || '0', 10),
      distance_checkout_max: parseInt(values.distance_checkout_max || '0', 10),
    };

    const response = await ModuleService.setShiftSetting(
      model,
      settingsIds.value.shift
    );
    if (response.getStatus()) {
      ToastManager.success('s_updated_success');
    }
  };

  return (
    <Section className='p-5'>
      <Form<any>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<any> = {};
          if (!values.name) errors.name = t('l_required_field');

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6 relative'
            id='form-settings-shifts'
          >
            <h2 className='text-lg font-bold'>
              {t('l_general_configuration')}
            </h2>
            <div className='grid grid-cols-1 gap-3'>
              <div className='col-span-3'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='name'
                      placeholder='p_enter_name'
                      type='text'
                      icon='122'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
            <h2 className='text-lg font-bold'>
              {t('l_checkin_configuration')}
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              <div className='col-span-1'>
                <Field<string> name='time_checkin_min'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='l_min_verification_range'
                      placeholder='p_enter_range'
                      type='number'
                      min='0'
                      icon='049'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='time_checkin_max'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='l_max_verification_time'
                      placeholder='p_enter_max_time'
                      type='number'
                      min='0'
                      icon='049'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
            <h2 className='text-lg font-bold'>
              {t('l_checkout_configuration')}
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              <div className='col-span-1'>
                <Field<string> name='time_checkout_min'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='l_min_verification_time'
                      placeholder='p_enter_min_time'
                      type='number'
                      min='0'
                      icon='049'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='time_checkout_max'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='l_max_verification_time'
                      placeholder='p_enter_max_time'
                      type='number'
                      min='0'
                      icon='049'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
            <h2 className='text-lg font-bold'>Configuración de Distancia</h2>
            <div className='grid grid-cols-2 gap-3'>
              <div className='col-span-1'>
                <Field<string> name='distance_checkin_max'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Distancia máxima de verificación'
                      placeholder='Ingrese distancia máxima...'
                      type='number'
                      min='0'
                      icon='142'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='distance_checkout_max'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Distancia máxima de verificación'
                      placeholder='Ingrese distancia máxima...'
                      type='number'
                      min='0'
                      icon='142'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
            <h2 className='text-lg font-bold'>Configuración de Permisos</h2>
            <div className='grid grid-cols-3 gap-3'>
              <div className='col-span-1'>
                <Field name='allow_shift' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_shift'
                      name='allow_shift'
                      label='Permitir turno'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='allow_service' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_service'
                      name='allow_service'
                      label='Permitir servicio'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='allow_contract' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_contract'
                      name='allow_contract'
                      label='Permitir contrato'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='allow_round' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_round'
                      name='allow_round'
                      label='Permitir ronda'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='allow_task' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='allow_task'
                      name='allow_task'
                      label='Permitir tarea'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field name='create_shift' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='create_shift'
                      name='create_shift'
                      label='Permitir crear turno'
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
              form='form-settings-shifts'
              top={false}
            />
          </form>
        )}
      />
    </Section>
  );
};