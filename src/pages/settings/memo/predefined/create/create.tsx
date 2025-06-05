import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { lengthSize } from '@/utils/utilities';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { PredefinedService } from '@/services/shift/predefined';
import { StatusButton } from '@/pages/settings/components/custom.button';

interface FormData {
  name: string;
  description: string;
  priority: number;
}

export const PredefinedCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    if (id) {
      request = await PredefinedService.updatePredefined(model, id);
      message = 'Predefinido editado exitosamente!';
    } else {
      request = await PredefinedService.createPredefined(model);
      message = 'Predefinido creado exitosamente!';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/memo/predefined');
  };

  const setInitialValues = async () => {
    if (!id) return;
    const userKeys = ['name'] as const;
    const request: any = await PredefinedService.getPredefinedById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
  };

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <Section>
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
            id='form-predefined-create'
          >
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-4 gap-3'>
              <div class='col-span-3'>
                <Field<string> name='name' validate={lengthSize(5, 30)}>
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
            </div>

            {/* Botonera */}
            <div className='w-full flex-row flex justify-end items-center'>
              <StatusButton
                onClickClean={() => {
                  () => form.reset();
                }}
                submitting={submitting}
                pristine={pristine}
                form='form-predefined-create'
                label={id ? 'Editar' : 'Guardar'}
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
