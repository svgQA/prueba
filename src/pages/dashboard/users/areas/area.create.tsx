import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { UserService } from '@/services/user';
import { toast } from 'react-toastify';
import { useParams } from 'wouter';
import { Signal } from '@preact/signals';
import { IUserAreaRequest } from '@/types/user/user.request';
import { useLocation } from 'wouter';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

export const AreaCreatePage: FunctionComponent = () => {
  const { id } = useParams();
  const initialValues: Signal<Partial<IUserAreaRequest>> = useSignal({});
  const [_, navigate] = useLocation();

  useEffect(() => {
    setInitialValues();
  }, []);

  const onSubmit = async (model: IUserAreaRequest) => {
    let request;
    let message: string;

    if (id) {
      request = await UserService.updateArea(id, model);
      message = 'Área actualizada exitosamente!';
    } else {
      request = await UserService.createArea(model);
      message = 'Área creada exitosamente!';
    }

    if (!request.getStatus()) return;
    toast.success(message, { position: 'top-right' });
    navigate('/users/areas/');
  };

  const setInitialValues = async () => {
    if (!id) return;

    const request = await UserService.getArea(id);
    if (!request.getStatus()) return;

    const { name, description } = request.getOne();
    initialValues.value = {
      name,
      description,
    };
  };

  return (
    <Section className='pt-2'>
      <Form
        onSubmit={onSubmit}
        initialValues={{ ...initialValues.value, companyId: 1 }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field name='name'>
                  {({ input, meta }) => (
                    <Input
                      id='name'
                      name='name'
                      placeholder='Ingrese el nombre de la área...'
                      meta={meta}
                      label='Nombre'
                      value={input.value}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='description'>
                  {({ input, meta }) => (
                    <Input
                      id='description'
                      name='description'
                      placeholder='Ingrese la descripción de la área...'
                      label='Descripción'
                      value={input.value}
                      meta={meta}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className='flex justify-end space-x-4'>
              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label={id ? 'Actualizar' : 'Guardar'}
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
