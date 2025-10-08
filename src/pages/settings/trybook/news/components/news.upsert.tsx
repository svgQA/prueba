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
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { PlaceService } from '@/services';

// Archivos / imágenes
import { File } from '@/components/common/file/file';
import ShowFiles from '@/components/common/file/show.file';
import { IPresignedRequest } from '@/types/file';

type LinkRow = { label: string; url: string };

export const NewsForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();
  const { selectedCompany, user } = useUserStore();

  const loading = useSignal<boolean>(false);
  const places = useSignal<IOption[]>([]);
  const [initialValues, setInitialValues] = useState<any>();

  // imágenes y enlaces
  const images = useSignal<IPresignedRequest[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([{ label: '', url: '' }]);

  useEffect(() => {
    document.title = t('h_title_news');
    fetchInitialValues();
  }, []);

  useEffect(() => {
    fetchInitialValues();
  }, [selectedCompany, id]);

  const getPlaces = async () => {
    const response = await PlaceService.getSimpleList();
    if (!response.getStatus()) return;
    places.value = response.getMany();
  };

  const safeParseArray = (value: any): any[] => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string' && value.trim().length) {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  const fetchInitialValues = async () => {
    await getPlaces(); // cargar lugares siempre

    if (!id) {
      setInitialValues({ name: '', description: '' });
      images.value = [];
      setLinks([{ label: '', url: '' }]);
      return;
    }

    const response = await NewsService.get_by_id(id);
    if (!response.getStatus()) return;
    const data = response.getOne();

    setInitialValues({
      name: data?.name || '',
      description: data?.description || '',
      place: data?.place ? { value: data.place.id, label: data.place.name } : undefined,
    });

    images.value = safeParseArray(data?.image); // puede venir como string o array
    const parsedLinks = safeParseArray(data?.link);
    setLinks(parsedLinks.length ? parsedLinks : [{ label: '', url: '' }]);
  };

  // archivos/imágenes
  const handleImageUpload = (e: any) => {
    const fileInputs: IPresignedRequest[] = e?.target?.value ?? [];
    if (!Array.isArray(fileInputs)) return;
    images.value = [...images.value, ...fileInputs];
  };
  const removeImage = (uuid: string) => {
    images.value = images.value.filter((f) => f.uuid !== uuid);
  };

  // enlaces
  const updateLink = (idx: number, field: keyof LinkRow, value: string) => {
    setLinks((prev) => {
      const draft = [...prev];
      draft[idx] = { ...draft[idx], [field]: value };
      return draft;
    });
  };
  const addLink = () => setLinks((p) => [...p, { label: '', url: '' }]);
  const removeLink = (idx: number) =>
    setLinks((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = async (model: INews, _form?: any) => {
    loading.value = true;

    // filtra enlaces vacíos y envía como string JSON (tipos backend ICNews)
    const linksClean = links.filter((r) => (r.label?.trim() || r.url?.trim()));

    const payload: any = {
      name: model.name,
      description: model.description,
      place: user?.userType !== 'ADMIN_CLIENT' ? model.place : undefined,
      image: JSON.stringify(images.value),   // <- string JSON
      link: JSON.stringify(linksClean),      // <- string JSON
    };

    const response = id
      ? await NewsService.update(id, payload)
      : await NewsService.create(payload);

    if (!response.getStatus()) {
      loading.value = false;
      return;
    }

    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    setInitialValues({});
    images.value = [];
    setLinks([{ label: '', url: '' }]);

    go({ to: '/trybook/news', label: 'News', id: 'trybook:news:state', base: 'setting' });
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

              {user?.userType !== 'ADMIN_CLIENT' && (
                <div className='col-span-2'>
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
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>
              )}

              {/* Imágenes */}
              <div className='col-span-2'>
                <div className='mb-2 font-medium'>{t('h_image') ?? 'Imágenes'}</div>
                <File
                  name='images'
                  onChange={handleImageUpload}
                  value={[]}
                  accept='image/*'
                  multiple={true}
                  label='h_image'
                  area='news'
                  showFiles={false}
                  disabled={loading.value}
                />
                <div className='mt-2'>
                  <ShowFiles resources={images.value} removeFile={removeImage} />
                </div>
              </div>

              {/* Enlaces */}
              <div className='col-span-2'>
                <div className='mb-2 font-medium'>{t('h_links') ?? 'Enlaces'}</div>
                <div className='space-y-2'>
                  {links.map((row, idx) => (
                    <div key={idx} className='grid grid-cols-12 gap-2 items-end'>
                      <div className='col-span-5'>
                        <Input
                          name={`links.${idx}.label`}
                          value={row.label}
                          onChange={(e: any) => updateLink(idx, 'label', e.target.value)}
                          placeholder={t('h_title') ?? 'Título'}
                          label={t('h_title') ?? 'Título'}
                          icon='120'
                          type='text'
                          disabled={loading.value}
                        />
                      </div>
                      <div className='col-span-6'>
                        <Input
                          name={`links.${idx}.url`}
                          value={row.url}
                          onChange={(e: any) => updateLink(idx, 'url', e.target.value)}
                          placeholder='https://...'
                          label='URL'
                          icon='120'
                          type='url'
                          disabled={loading.value}
                        />
                      </div>
                      <div className='col-span-1'>
                        <button
                          type='button'
                          className='px-3 py-2 rounded-md bg-b-light dark:bg-b-dark text-sm'
                          onClick={() => removeLink(idx)}
                          disabled={loading.value || links.length === 1}
                          title={t('remove') ?? 'Eliminar'}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      type='button'
                      className='px-3 py-2 rounded-md bg-primary text-white text-sm'
                      onClick={addLink}
                      disabled={loading.value}
                    >
                      {t('add') ?? 'Agregar enlace'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};
