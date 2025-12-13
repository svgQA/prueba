import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { TextArea } from '@/components/common/text.area/text.area';

import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices/access/user.slice';

import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import { useParams } from 'wouter';

import { PrioritiesService } from "@/services/pqrs/priorities";
import { ICPrioritiesResponse } from '../utils/interface';

export const PrioritiesForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();

  const initialValues = useSignal<ICPrioritiesResponse>();
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = 'h_common_priorities';
    fetchInitialValues();
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      fetchInitialValues();
    }
  }, [selectedCompany, id]);

  const fetchInitialValues = async () => {
    loading.value = true;
    if (!id) {
      initialValues.value = {
        name: '',
        description: '',
      };
      loading.value = false;
      return;
    }

    const response = await PrioritiesService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    initialValues.value = {
      name: initialData.name || '',
      description: initialData.description || '',
    };
    loading.value = false;
  };


  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;
    let body: ICPrioritiesResponse = {
      name: model.name,
      description: model.description,
    };

    let response = id
      ? await PrioritiesService.update(id, body)
      : await PrioritiesService.create(body);

    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    initialValues.value = {} as ICPrioritiesResponse;

    go({
      to: '/pqrs/priorities',
      label: 'priorities',
      id: 'pqrs:priorities:state',
      base: 'setting',
    });
    loading.value = false;
  };

  return (
    <Section
      className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'
      loading={loading.value}
    >
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues.value}
        enableReinitialize={true}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-news-upsert'
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-news-upsert'
              label={id ? 'edit' : 'save'}
            />
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Field<string> name='name'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder={t('h_name')}
                      label={t('h_name')}
                      meta={meta}
                      icon='120'
                      type='text'
                      disabled={loading.value}
                      required
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-2'>
                <Field<string> name='description'>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      icon='120'
                      type='text'
                      min='3'
                      max='300'
                      placeholder={t('h_description')}
                      label={t('h_description')}
                      meta={meta}
                      disabled={loading.value}
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
