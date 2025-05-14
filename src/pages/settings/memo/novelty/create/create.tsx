import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { lengthSize } from '@/utils/utilities';
import { Select } from '@/components/common/select/select';
import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useLocation, useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { NoveltyService } from '@/services';

interface FormData {
  name: string;
  description: string;
  priority: number;
}

export const NoveltyCreateSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL

  const onSubmit = async (model: FormData) => {
    let request;
    let message: string;

    if (id) {
      request = await NoveltyService.updateNovelty(model, id);
      message = 'Novedad editado exitosamente!';
    } else {
      request = await NoveltyService.createNovelty(model);
      message = 'Novedad creado exitosamente!';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
    navigate('/memo/novelty');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = ['name', 'description', 'priority'] as const;

    const request: any = await NoveltyService.getNoveltyById(id);
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
          if (!values.description) errors.description = 'Campo obligatorio';
          if (!values.priority) errors.description = 'Campo obligatorio';

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
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
              <div class='col-span-1'>
                <Field
                  name='priority'
                  parse={(value) => (value ? Number(value) : undefined)}
                >
                  {({ input }) => {
                    return (
                      <div>
                        <Select
                          {...input}
                          placeholder='Selecione prioridad...'
                          label='Prioridad'
                          name='priority'
                          icon='252'
                          options={Array.from({ length: 10 }, (_, i) => ({
                            value: i + 1,
                            label: i + 1,
                          }))}
                        />
                      </div>
                    );
                  }}
                </Field>
              </div>
              <div class='col-span-4'>
                <Field<string> name='description' validate={lengthSize(5, 250)}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='300'
                      placeholder='Ingrese Descripción...'
                      label='Descripción'
                      type='text'
                      meta={meta}
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
                label={id ? 'Editar' : 'Guardar'}
                className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
                disabled={submitting}
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
