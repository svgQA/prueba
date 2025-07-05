import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { UserService } from '@/services/general/user';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { Signal } from '@preact/signals';
import { IUserAreaRequest } from '@/types/user/user.request';
import { useLocation } from 'wouter';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { required } from '@/utils/utilities/validate';
import { useTranslation } from 'react-i18next';

export const AreaCreatePage: FunctionComponent = () => {
  const { t } = useTranslation();
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
      message = 's_updated_success';
    } else {
      request = await UserService.createArea(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return;
    ToastManager.success(message);
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
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      id='name'
                      name='name'
                      placeholder={t('user.area.placeholder.name')}
                      meta={meta}
                      label={t('user.area.form.name')}
                      value={input.value}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      id='description'
                      name='description'
                      placeholder={t('user.area.placeholder.description')}
                      label={t('user.area.form.description')}
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
                label={id ? 'update' : 'save'}
                icon='022'
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
