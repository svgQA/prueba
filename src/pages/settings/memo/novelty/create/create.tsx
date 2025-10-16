import { Signal, useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { FunctionComponent } from 'preact';
import { Input } from '@/components/common/input/input';
import { TextArea } from '@/components/common/text.area/text.area';
import { required } from '@/utils/utilities';
// import { Select } from '@/components/common/select/select';
// import { Section } from '@/components/common/section/section';
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
import { Checkbox } from '@/components/common/checkbox/checkbox';
interface FormData {
  name: string;
  description: string;
  priority: any;
  autoResolve: boolean;
}

export const selectPriority: IOption[] = [
  { value: 5, label: 'Alta' },
  { value: 4, label: 'Media' },
  { value: 3, label: 'Baja' },
];

export const NoveltyCreateSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const initialValues: Signal<Partial<FormData>> = useSignal({});
  const { id } = useParams(); // Obtiene el id de la URL
  const priorities = useSignal<IOption[]>(selectPriority);

  const onSubmit = async (model: FormData) => {
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

    if (!request.getStatus()) return;
    ToastManager.success(message);
    go({
      to: '/memo/novelty',
      label: 'm_novelty',
      id: 'memo:novelty:state',
      base: 'setting',
    });
  };

  const setInitialValues = async () => {
    if (!id) return;

    const userKeys = [
      'name',
      'description',
      'priority',
      'autoResolve',
    ] as const;

    const request: any = await NoveltyService.getNoveltyById(id);
    const model = pick(omitBy(request.model, isNull), userKeys);
    const priority = priorities.value.find((p) => p.value === model.priority);

    initialValues.value = {
      ...model,
      priority: priority,
    };
  };

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <>
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
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-place-create'
          >
            <StatusButton
              onClickClean={() => {
                () => form.reset();
              }}
              submitting={submitting}
              pristine={pristine}
              form='form-place-create'
              label={id ? 'edit' : 'save'}
            />

            {/** FORMULARIO PRINCIPAL */}
            <div className='grid grid-cols-4 gap-3'>
              <div class='col-span-2'>
                <Field<string> name='name' validate={required}>
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
                <Field<IOption> name='priority' validate={required}>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      id='select-priority'
                      icon='191'
                      label='h_priority'
                      options={priorities.value}
                      menuPortalTarget={document.body}
                      placeholder='p_select'
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-1 mt-8'>
                <Field<boolean> name='autoResolve' defaultValue={false}>
                  {({ input }) => (
                    <Checkbox
                      {...input}
                      name='autoResolve'
                      label=''
                      options={[
                        {
                          value: 'autoResolve',
                          label: 'Activar resolución automática',
                        },
                      ]}
                      value={input.value ? { autoResolve: true } : {}}
                      checked={input.value}
                    />
                  )}
                </Field>
              </div>
              <div class='col-span-4'>
                <Field<string> name='description' validate={required}>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      min='3'
                      max='300'
                      placeholder='Ingrese Descripción...'
                      label='description'
                      type='text'
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};
