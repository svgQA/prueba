import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { UserService } from '@/services/general/user';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { Signal } from '@preact/signals';
import { IUserAreaRequest } from '@/types/user/user.request';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { required } from '@/utils/utilities/validate';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';
import { StatusButton } from '@/pages/settings/components/custom.button';

export const AreaCreatePage: FunctionComponent = () => {
  const { id } = useParams();
  const initialValues: Signal<Partial<IUserAreaRequest>> = useSignal({});
  const { go } = useNavigation();
  const loading = useSignal<boolean>(false);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      setInitialValues();
    }
  }, [selectedCompany, location]);

  const onSubmit = async (model: IUserAreaRequest) => {
    loading.value = true;
    let request;
    let message: string;

    if (id) {
      request = await UserService.updateArea(id, model);
      message = 's_updated_success';
    } else {
      request = await UserService.createArea(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return (loading.value = false);
    ToastManager.success(message);
    go({
      to: '/users/areas',
      label: 'areas',
      id: 'user:areas:state',
      base: 'setting',
    });
    loading.value = false;
  };

  const setInitialValues = async () => {
    loading.value = true;
    if (!id) return (loading.value = false);

    const request = await UserService.getArea(id);
    if (!request.getStatus()) return (loading.value = false);

    const { name, description } = request.getOne();
    initialValues.value = {
      name,
      description,
    };
    loading.value = false;
  };

  return (
    <Section className='pt-2' loading={loading.value}>
      <Form
        onSubmit={onSubmit}
        initialValues={{ ...initialValues.value, companyId: 1 }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-area-change'
          >
            <div className='grid grid-cols-2 gap-4'>
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting}
                pristine={pristine}
                form='form-area-change'
                label={id ? 'update' : 'save'}
              />
              <div className='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      id='name'
                      name='name'
                      placeholder='p_name'
                      meta={meta}
                      label='l_name'
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
                      placeholder='p_description'
                      label='h_description'
                      value={input.value}
                      meta={meta}
                      onChange={input.onChange}
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
