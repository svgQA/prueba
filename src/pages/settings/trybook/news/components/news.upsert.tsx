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
import { IOption } from '@/components/common/multi/interface';
// import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { PlaceService } from '@/services';
import { File } from '@/components/common/file/file';
import { IPresignedRequest } from '@/types/file';
import { MultipleInput } from '@/components/common/multi/multi';
import { TextArea } from '@/components/common/text.area/text.area';

export const NewsForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();
  const { selectedCompany, /*user*/ } = useUserStore();

  const [initialValues, setInitialValues] = useState<any>();
  const loading = useSignal<boolean>(false);
  const places = useSignal<IOption[]>([]);
  const files = useSignal<IPresignedRequest[]>([]);
  const links = useSignal<IOption[]>([]);

  useEffect(() => {
    document.title = 'h_common_areas';
    fetchInitialValues();
  }, []);

  useEffect(() => {
    fetchInitialValues();
    getPlaces();
  }, [selectedCompany, id]);

  const fetchInitialValues = async () => {
    if (!id) {
      setInitialValues({
        name: '',
        description: '',
      });
      files.value = [];
      links.value = [];
      return;
    }

    const response = await NewsService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      name: initialData.name || '',
      description: initialData.description || '',
      place: {
        value: initialData.place?.id || '',
        label: initialData.place?.name || '',
      },
    });

    files.value = initialData.resource || [];
    links.value =
      initialData.keylinks.map((e: string, index: number) => {
        return { label: e, value: index };
      }) || [];
  };

  const getPlaces = async () => {
    const response = await PlaceService.getSimpleList();
    if (!response.getStatus()) return;
    places.value = response.getMany();
  };

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;
    let news: INews = {
      name: model.name,
      description: model.description,
      place: model.place,
      resource: files.value && files.value.length > 0 ? files.value : undefined,
      keylinks:
        links.value && links.value.length > 0
          ? links.value.map((e) => e.label)
          : undefined,
    };

    let response = id
      ? await NewsService.update(id, news)
      : await NewsService.create(news);

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

  const handleAttachmentUpload = (e: any) => {
    const fileInput: IPresignedRequest = e.target.value[0];
    files.value = [...files.value, fileInput];
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
               {/* {user?.userType !== 'ADMIN_CLIENT' && (
                <Field<IOption> name='place'>
                  {({ input, meta }) => (
                    <SmartSelector<IOption>
                      {...input}
                      meta={meta}
                      id='select-place'
                      label={t('h_place')}
                      icon='231'
                      options={places.value}
                      multiple={false}
                      allowAll={true}
                      menuPortalTarget={document.body}
                      placeholder={t('h_place')}
                      onChange={() => {}}
                    />
                  )}
                </Field>
              )} */}
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
              <div className='col-span-1'>
                <MultipleInput
                  name='input-links'
                  value={links.value}
                  onChange={(value: IOption[], _name?: string) => {
                    links.value = value;
                  }}
                  placeholder='p_select'
                  label='h_links'
                  buttonIcon='044'
                  icon='086'
                  bottom
                />
              </div>
              <div className='col-span-1'>
                <Field name='attachments'>
                  {() => (
                    <File
                      name='attachments'
                      onChange={handleAttachmentUpload}
                      value={files.value}
                      accept='image/*, video/*'
                      label='h_attachment'
                      area='trybook'
                      showFiles={true}
                      multiple={false}
                      disabled={files.value.length === 1}
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
