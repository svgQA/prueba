import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useParams } from 'wouter';
import { useEffect } from 'preact/hooks';
import { omitBy, isNull, pick } from 'lodash';
import { NoveltyService } from '@/services';
import { StatusButton } from '@/pages/settings/components/custom.button';
import { useNavigation } from '@/utils/hooks/navigation';
import {
  IOption,
  SmartSelector,
} from '@/components/common/smart-selector/smart-select';
import { Section } from '@/components/common/section/section';
import { Switch } from '@/components/common/switch/switch';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  description: string;
  priority: any;
  autoResolve: boolean;
}

// Mantenemos esto para compatibilidad con otros archivos
export const selectPriority: IOption[] = [
  { value: 5, label: 'Alta' },
  { value: 4, label: 'Media' },
  { value: 3, label: 'Baja' },
];

export const NoveltyCreateSettingPage: FunctionComponent = () => {
  const { t } = useTranslation(); // React-i18next activará el re-render al cambiar idioma
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams();

  // Función auxiliar para generar la lista traducida
  const getTranslatedPriorities = () => [
    { value: 5, label: t('l_priority_high') },
    { value: 4, label: t('l_priority_medium') },
    { value: 3, label: t('l_priority_low') },
  ];

  // Inicializamos con el idioma actual
  const priorities = useSignal<IOption[]>(getTranslatedPriorities());

  const loading = useSignal<boolean>(false);

  // 1. NUEVO: Este useEffect escucha cambios en 't' (cambio de idioma) y actualiza la lista
  useEffect(() => {
    priorities.value = getTranslatedPriorities();
  }, [t]);

  const onSubmit = async (model: FormData) => {
    loading.value = true;
    let request;
    let message: string;

    model = { ...model, priority: model.priority.value };

    if (id) {
      request = await NoveltyService.updateNovelty(model, id);
      message = 's_updated_success';
    } else {
      request = await NoveltyService.createNovelty(model);
      message = 's_created_success';
    }

    if (!request.getStatus()) return (loading.value = false);
    ToastManager.success(message);
    go({
      to: '/memo/novelty',
      label: 'm_novelty',
      id: 'memo:novelty:state',
      base: 'setting',
    });
    loading.value = false;
  };

  const setInitialValues = async () => {
    loading.value = true;
    if (!id) return (loading.value = false);

    const userKeys = [
      'name',
      'description',
      'priority',
      'autoResolve',
    ] as const;

    const request: any = await NoveltyService.getNoveltyById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    
    // Busca en la lista actual (priorities.value ya tiene el idioma correcto al inicio)
    const priority = priorities.value.find((p) => p.value === model.priority);

    initialValues.value = {
      ...model,
      priority: priority,
    };
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
          if (!values.description) errors.description = 'Campo obligatorio';
          if (!values.priority) errors.priority = 'Campo obligatorio';

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-place-create'
          >
            <StatusButton
              onClickClean={() => {
                form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-place-create'
              label={id ? 'edit' : 'save'}
            />
            
            <div className='grid grid-cols-2 gap-3 relative pt-8'>
              <div className='col-span-1'>
                <Field<string> name='name' validate={required}>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type='text'
                      placeholder='p_enter_name'
                      label='l_name'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-1'>
                <Field<IOption> name='priority' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      id='select-priority'
                      icon='191'
                      label='h_priority'
                      options={priorities.value} // Esto ahora se actualiza automáticamente
                      menuPortalTarget={document.body}
                      placeholder='p_select'
                    />
                  )}
                </Field>
              </div>
              <div className='absolute top-0 right-0 bg-ternary flex items-center py-2 px-3 rounded-es-lg'>
                <Field<boolean> name='autoResolve' defaultValue={false}>
                  {({ input }) => (
                    <Switch
                      {...input}
                      name='autoResolve'
                      label='l_auto_resolve'
                      value={input.checked}
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-2'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='300'
                      placeholder={t('p_enter_description')}
                      label='description'
                      type='text'
                      rows={2}
                      meta={meta}
                      className='resize-none'
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