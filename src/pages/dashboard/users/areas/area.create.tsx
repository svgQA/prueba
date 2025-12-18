import { FunctionComponent } from 'preact';
import { Signal } from '@preact/signals';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';

import { required } from '@/utils/utilities/validate';
import { useNavigation } from '@/utils/hooks/navigation';
import { ToastManager } from '@/utils/toast/toast-manager';


import { AreaService } from '@/services/general/area';
import { useUserStore } from '@/store/slices';

import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { useParams } from 'wouter';

import { IUserAreaRequest } from '@/types/user/user.request';
import { GeneralService } from '@/services';
import { MultiSelect } from '@/pages/settings/forms/create/MultiSelect';
import { IMultiSelect } from '@/types/general/general';

export const AreaCreatePage: FunctionComponent = () => {
  const { id } = useParams();
  const { go } = useNavigation();

  const initialValues: Signal<Partial<IUserAreaRequest>> = useSignal({});
  const loading = useSignal<boolean>(false);
  const group = useSignal<number[]>([]);
  const smartGroups = useSignal<IMultiSelect[]>([]);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      setInitialValues();
    }
  }, [selectedCompany, location]);

  const setInitialValues = async () => {
    loading.value = true;
    await getGroups();
    if (!id) return (loading.value = false);

    const request = await AreaService.get_one(id);
    if (!request.getStatus()) return (loading.value = false);

    const { name, description, children, groups } = request.getOne();
    initialValues.value = {
      name,
      description,
      children: children || [],
    };
    group.value = groups?.map((g) => g?.group?.id) || [];
    loading.value = false;
  };

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    smartGroups.value = response.getMany();
  };

  const onSubmit = async (model: IUserAreaRequest) => {
    loading.value = true;
    let request;
    let message: string;
    model.smartGroups = group.value;

    if (id) {
      request = await AreaService.update(id, model);
      message = 's_updated_success';
    } else {
      request = await AreaService.create(model);
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

  return (
    <Section className='pt-2' loading={loading.value}>
      <Form
        onSubmit={onSubmit}
        initialValues={{ children: [], ...initialValues.value, companyId: 1 }}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit, submitting, form }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-3 gap-4'>
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
              <div className='col-span-1'>
                <MultiSelect<IMultiSelect>
                  options={smartGroups.value}
                  selectedIds={group.value}
                  onChange={(selectedIds) =>
                    (group.value = selectedIds as number[])
                  }
                  getLabel={(item) => item.name}
                  getId={(item) => item.id}
                  placeholder='p_iteam'
                  label='h_smart_groups'
                />
              </div>
            </div>

            {/* Children (sub-areas) */}
            <section className='rounded-lg border border-gray-border dark:border-b-dark-dark bg-b-light dark:bg-b-dark-light p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium text-t-light dark:text-t-dark'>
                  children
                </h3>

                <Button
                  name='add-child-button'
                  type='button'
                  icon='039'
                  onClick={() =>
                    form.mutators.push('children', {
                      name: '',
                      description: '',
                    })
                  }
                  disabled={loading.value}
                  className='px-3 py-1 text-xs bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary'
                  label='add'
                />
              </div>

              <FieldArray name='children'>
                {({ fields }) =>
                  fields.length === 0 ? (
                    <p className='text-sm text-gray-text-light dark:text-t-dark italic text-center py-4'>
                      No children added
                    </p>
                  ) : (
                    <div className='space-y-4'>
                      {fields.map((name, index) => (
                        <div
                          key={name}
                          className='rounded-lg p-2 bg-white/40 dark:bg-black/10 text-t-light dark:text-t-dark'
                        >
                          <div className='flex flex-row w-full items-end justify-between py-1 gap-x-2'>
                            {/* ID (read-only if present) */}
                            <div className='w-24'>
                              <Field<number | string> name={`${name}.id`}>
                                {({ input, meta }) => (
                                  <Input
                                    id={`child-id-${index}`}
                                    name={input.name}
                                    placeholder='id'
                                    label='id'
                                    meta={meta}
                                    value={input.value as any}
                                    onChange={input.onChange}
                                    disabled={!!input.value}
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Name */}
                            <div className='flex-1'>
                              <Field<string> name={`${name}.name`} validate={required}>
                                {({ input, meta }) => (
                                  <Input
                                    id={`child-name-${index}`}
                                    name={input.name}
                                    placeholder='p_name'
                                    label='l_name'
                                    meta={meta}
                                    value={input.value}
                                    onChange={input.onChange}
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Description */}
                            <div className='flex-1'>
                              <Field<string> name={`${name}.description`}>
                                {({ input, meta }) => (
                                  <Input
                                    id={`child-description-${index}`}
                                    name={input.name}
                                    placeholder='p_description'
                                    label='h_description'
                                    meta={meta}
                                    value={input.value}
                                    onChange={input.onChange}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className='pb-2'>
                              <Button
                                name='remove-child-button'
                                type='button'
                                onClick={() => fields.remove(index)}
                                disabled={loading.value}
                                icon='181'
                                square
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </FieldArray>
            </section>
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
