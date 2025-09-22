import { useEffect, useState } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices/access/user.slice';
import { FunctionComponent } from 'preact';
import { useNavigation } from '@/utils/hooks/navigation';
import { useParams } from 'wouter';
import { INews } from '@/types/trybook/news';
import { Section } from '@/components/common/section/section';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { NewsService } from '@/services/trybook/news';

export const NewsForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();
  const { selectedCompany } = useUserStore();

  const loading = useSignal<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>();

  useEffect(() => {
    document.title = 'Zonas Comunes';
    fetchInitialValues();
  }, []);

  useEffect(() => {
    fetchInitialValues();
  }, [selectedCompany, id]);

  const fetchInitialValues = async () => {
    if (!id) {
      setInitialValues({
        name: '',
        description: '',
      });
      return;
    }

    const response = await NewsService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      name: initialData.name || '',
      description: initialData.description || '',
    });
  };

  const handleSubmit = async (model: INews, _form?: any) => {
    console.log('model', model);
    loading.value = true;

    let response = id
      ? await NewsService.update(id, model)
      : await NewsService.create(model);

    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    setInitialValues({} as INews);

    go({
      to: '/trybook/news',
      label: 'News',
      id: 'trybook:news:state',
      base: 'setting',
    });
    loading.value = false;
  };

  return (
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
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
              <div className='col-span-1'>
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
              <div className='col-span-1'>
                <Field<string> name='description'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder={t('h_description')}
                      label={t('h_description')}
                      meta={meta}
                      icon='120'
                      type='text'
                      disabled={loading.value}
                      required
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
