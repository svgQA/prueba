import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { lengthSize } from '@/utils/utilities';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { PredefinedService } from '@/services/shift/predefined';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useNavigation } from '@/utils/hooks/navigation';
import { Section } from '@/components/common/section/section';

interface FormData {
  name: string;
  description: string;
  priority: number;
}

export const PredefinedCreateSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  const loading = useSignal<boolean>(false);

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    let request;
    let message: string;

    if (id) {
      request = await PredefinedService.updatePredefined(model, id);
      message = 's_updated_success';
    } else {
      request = await PredefinedService.createPredefined(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return (loading.value = false);
    ToastManager.success(message);
    go({
      to: '/memo/predefined',
      label: 'm_predefined',
      id: 'memo:predefined:state',
      base: 'setting',
    });
    loading.value = false;
  };

  const setInitialValues = async () => {
    loading.value = true;
    if (!id) return (loading.value = false);
    const userKeys = ['name'] as const;
    const request: any = await PredefinedService.getPredefinedById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    initialValues.value = model;
    loading.value = false;
  };

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <Section className='pt-2 px-4 sm:px-8 lg:px-20 xl:px-40'>
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
            className='space-y-1'
            id='form-predefined-create'
          >
            <StatusButton
              onClickClean={() => {
                () => form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-predefined-create'
              label={id ? 'edit' : 'save'}
            />
            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-4 gap-3'>
              <div class='col-span-4'>
                <Field<string> name='name' validate={lengthSize(5, 30)}>
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
            </div>
          </form>
        )}
      />
    </Section>
  );
};
