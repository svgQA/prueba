import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { Switch } from '@/components/common/switch/switch';
import { Button } from '@/components/common/button/button';
import { toast } from 'react-toastify';
import { useLocation } from 'wouter';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { FormValues, IShiftSetting } from './interface';
import { ShiftService } from '@/services/shift';

export const ShiftSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormValues>> = useSignal({
    status: true,
    has_service: false,
    has_contract: false,
    has_shift: false,
    has_round: false,
    has_task: false,
    has_report: false,
    field_shift_table: [],
    max_check_range: '0',
    max_check_time: '0',
    min_check_time: '0',
  });

  useEffect(() => {
    document.title = 'VX - Shift Settings';
    getSettings();
  }, []);

  const getSettings = async () => {
    try {
      const response = await ShiftService.getShiftSetting();
      if (!response.getStatus()) return;
      const shiftResponse = response.getOne();

      initialValues.value = {
        ...shiftResponse.settings,
        max_check_range: shiftResponse.settings.max_check_range.toString(),
        max_check_time: shiftResponse.settings.max_check_time.toString(),
        min_check_time: shiftResponse.settings.min_check_time.toString(),
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error al cargar la configuración', {
        position: 'top-right',
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Convertir los strings a números para el envío
      const model: IShiftSetting = {
        ...values,
        max_check_range: parseInt(values.max_check_range, 10),
        max_check_time: parseInt(values.max_check_time, 10),
        min_check_time: parseInt(values.min_check_time, 10),
      };

      await ShiftService.setShiftSetting(model);
      toast.success('Configuración actualizada exitosamente!', {
        position: 'top-right',
      });
      navigate('/rounds');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error al actualizar la configuración', {
        position: 'top-right',
      });
    }
  };

  return (
    <Section className='p-5'>
      <Form<FormValues>
        onSubmit={onSubmit}
        initialValues={initialValues.value}
        validate={(values) => {
          const errors: Partial<FormValues> = {};
          if (!values.name) errors.name = 'Campo obligatorio';
          if (!values.description) errors.description = 'Campo obligatorio';

          const maxRange = parseInt(values.max_check_range, 10);
          const maxTime = parseInt(values.max_check_time, 10);
          const minTime = parseInt(values.min_check_time, 10);

          if (!maxRange || maxRange <= 0)
            errors.max_check_range = 'Debe ser mayor a 0';
          if (!maxTime || maxTime <= 0)
            errors.max_check_time = 'Debe ser mayor a 0';
          if (!minTime || minTime <= 0)
            errors.min_check_time = 'Debe ser menor al tiempo máximo';
          if (minTime >= maxTime) {
            errors.min_check_time = 'Debe ser menor al tiempo máximo';
          }
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-3 gap-3'>
              <div className='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Nombre'
                      placeholder='Ingrese nombre...'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='max_check_range'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Rango máximo de verificación'
                      placeholder='Ingrese rango...'
                      type='number'
                      min='1'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='max_check_time'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Tiempo máximo de verificación'
                      placeholder='Ingrese tiempo máximo...'
                      type='number'
                      min='1'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='min_check_time'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      label='Tiempo mínimo de verificación'
                      placeholder='Ingrese tiempo mínimo...'
                      type='number'
                      min='1'
                      value={input.value}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='300'
                      placeholder='Ingrese descripción...'
                      label='Descripción'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='col-span-1'>
                <Field name='status' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='status'
                      name='status'
                      label='Estado'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_service' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_service'
                      name='has_service'
                      label='Tiene servicio'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_contract' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_contract'
                      name='has_contract'
                      label='Tiene contrato'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_shift' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_shift'
                      name='has_shift'
                      label='Tiene turno'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_round' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_round'
                      name='has_round'
                      label='Tiene ronda'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_task' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_task'
                      name='has_task'
                      label='Tiene tarea'
                      value={input.checked}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='has_report' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='has_report'
                      name='has_report'
                      label='Tiene reporte'
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
