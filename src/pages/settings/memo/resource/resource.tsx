import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form, Field } from 'react-final-form';
import { CardAccess } from '@/components/compose/cards/company/cardAccess';
import { Signal, useSignal } from '@preact/signals';
import { IResourceRequest } from '@/types/memo/memo.request';
import { IResourceResponse } from '@/types/memo/memo.response';
import { GeneralService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { StatusButton } from '../../components/custom.button';
import { ToastManager } from '@/utils/toast/toast-manager';
import { TextArea } from '@/components/common/text.area/text.area';
import { Input } from '@/components/common/input/input';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { required } from '@/utils/utilities';
import { MultiSelect } from '../../forms/create/MultiSelect';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { INPUT_TYPES } from '@/components/common/input/interface';
import { validateContactByType, validateOptionalUrl } from './utils';

interface IMultiSelect {
  id: number;
  name: string;
}

export const ResourceMemoSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const resources = useSignal<IResourceResponse[]>([]);
  const smartGroups = useSignal<{ name: string; id: number }[]>([]);
  const initialValues: Signal<Partial<IResourceRequest>> = useSignal({});

  useEffect(() => {
    document.title = t('p_resource');
  }, []);

  const { selectedCompany } = useUserStore();

  useEffect(() => {
    if (selectedCompany) {
      getResources();
      getGroups();
    }
  }, [selectedCompany, location]);

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    smartGroups.value = response.getMany();
  };

  const getResources = async () => {
    const response = await GeneralService.resource();
    if (!response.getStatus()) return;
    resources.value = response.getMany();
  };

  const onSubmit = async (values: IResourceRequest, form: any) => {
    // TODO: Revalidación estricta del link según el tipo antes de enviar
    const err = validateContactByType(values.link, values);
    if (err) {
      ToastManager.error(err);
      return;
    }

    const output = {
      ...values,
      type: values.type || 'WHATSAPP',
      image: values.image || '',
      icon: values.icon || '',
    };

    let response;
    if (values.id) {
      response = await GeneralService.updateResource(values.id, output);
    } else {
      response = await GeneralService.createResource(output);
    }
    if (!response.getStatus()) return;

    ToastManager.success(values.id ? 's_updated_success' : 's_created_success');
    getResources();
    form?.reset();
    initialValues.value = {};
  };

  const handleEdit = (id: number) => {
    const resource = resources.value.find((resource) => resource.id === id);
    if (resource) {
      initialValues.value = {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        image: resource.image,
        type: resource.type,
        icon: resource.icon,
        link: resource.link,
        groups: resource.groups.map((group) => group.group.id),
      };
    }
  };

  const handleDelete = async (id: number) => {
    const response = await GeneralService.deleteResource(id);
    if (!response.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getResources();
  };

  return (
    <>
      <div className='p-5 w-full'>
        <div className='flex flex-row justify-between gap-2 items-start'>
          <div className='flex flex-row gap-2 justify-center flex-wrap overflow-y-auto vox-scroll-design h-[60vh]'>
            {resources.value.map((data) => (
              <CardAccess
                key={data.id}
                title={data.name}
                subtitle={data.description}
                icon={data.icon}
                imageUrl={data.image}
                type={data.type}
                id={data.id}
                link={data.link}
                groups={data.groups}
                updatedAt={data.updatedAt}
                onEdit={() => handleEdit(data.id)}
                onDelete={() =>
                  showAlert({
                    title: t('l_delete_resource'),
                    message: t('l_delete_resource_confirm'),
                    onConfirm: () => {
                      handleDelete(data.id);
                    },
                    onCancel: () => {},
                  })
                }
                selected={data.id === initialValues.value?.id}
              />
            ))}
              {resources.value.length === 0 && (
              <div className='text-center text-gray-500'>
              {t('l_no_resources')}
              </div>
            )}
          </div>

          <div className='min-w-[600px] h-fit bg-white dark:bg-b-dark-dark p-4 rounded shadow m-2'>
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues.value}
              render={({ handleSubmit, form, submitting, pristine }) => (
                <form onSubmit={handleSubmit} id='form-resource-create'>
                  <StatusButton
                    onClickClean={() => {
                      form.reset();
                      if (initialValues.value.id) {
                        initialValues.value = {};
                      }
                    }}
                    submitting={initialValues.value.id ? false : submitting}
                    pristine={initialValues.value.id ? false : pristine}
                    form='form-resource-create'
                    label={t('btnSave')}
                  />
                  <h2 className='text-2xl font-bold'>
                    {initialValues.value.id
                      ? t('l_edit_resource')
                      : t('l_new_resource')}
                  </h2>

                  <div className='flex flex-col gap-4'>
                    {/* Title field - full width */}
                    <div className='w-full'>
                      <Field<string> name='name' validate={required}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type='text'
                            placeholder={t('l_title')}
                            label={t('l_title')}
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>

                    {/* Description field - full width */}
                    <div className='w-full'>
                      <Field<string> name='description' validate={required}>
                        {({ input, meta }) => (
                          <TextArea
                            {...input}
                            id='Description'
                            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:border-cyan-500'
                            placeholder={t('description')}
                            label={t('description')}
                            type='text'
                            meta={meta}
                          />
                        )}
                      </Field>
                    </div>

                    {/* Two-column layout for remaining fields */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Left column */}
                      <div className='space-y-4'>
                        <Field<string>
                          name='type'
                          validate={required}
                          initialValue='WHATSAPP'
                        >
                          {({ input }) => (
                            <Dropdown
                              id='type'
                              name={input.name}
                              value={input.value}
                              // @ts-ignore
                              onChange={(nextVal: string) => {
                                input.onChange(nextVal);
                                form.change('link', '');
                              }}
                          label={t('l_type_communication')} 
                          options={[
                            { value: 'WHATSAPP', label: t('l_whatsapp') },
                            { value: 'EMAIL', label: t('l_email') },     
                            { value: 'LINK', label: t('l_link') },        
                          ]}
                            />
                          )}
                        </Field>
                      </div>

                      <div className='space-y-4'>
                        <Field<string>
                          name='image'
                          validate={validateOptionalUrl}
                        >
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              type='url'
                              placeholder={t('l_image_url_png')}
                              label={t('l_image_url_png')}
                              meta={meta}
                              onBlur={(e: any) => {
                                const v = (e?.target?.value ?? '').trim();
                                input.onBlur(e);
                                form.change('image', v);
                              }}
                            />
                          )}
                        </Field>
                      </div>

                      <div className='col-span-2'>
                        <Field<string>
                          name='link'
                          validate={(value, allValues) =>
                            validateContactByType(value, allValues)
                          }
                        >
                          {({ input, meta }) => {
                            const currentType =
                              (form.getState().values?.type as string) ||
                              'WHATSAPP';

                            const { label, placeholder, typeAttr } =
                              currentType === 'WHATSAPP'
                                ? {
                                    label: t('l_whatsapp_number'),
                                    placeholder: t('l_example_phone'),
                                    typeAttr: 'tel',
                                  }
                                : currentType === 'EMAIL'
                                  ? {
                                      label: t('l_email_address'),
                                      placeholder: t('l_example_email'),
                                      typeAttr: 'email',
                                    }
                                  : {
                                      label: t('l_link_url'),
                                      placeholder: t('l_example_url'),
                                      typeAttr: 'url',
                                    };

                            return (
                              <Input
                                {...input}
                                type={typeAttr as INPUT_TYPES}
                                placeholder={placeholder}
                                label={label}
                                meta={meta}
                                onBlur={(e: any) => {
                                  const v = (e?.target?.value ?? '').trim();
                                  input.onBlur(e);
                                  form.change('link', v);
                                }}
                              />
                            );
                          }}
                        </Field>
                      </div>

                      <div className='w-full col-span-2'>
                        <Field<number[]> name='groups'>
                          {({ input }) => (
                            <MultiSelect<IMultiSelect>
                              {...input}
                              options={smartGroups.value}
                              selectedIds={input.value || []}
                              onChange={(selectedIds) => {
                                form.change('groups', selectedIds as number[]);
                              }}
                              label={t('l_select_group')}
                              getLabel={(item) => item.name}
                              getId={(item) => item.id}
                              placeholder={t('l_select_smart_groups')}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};
