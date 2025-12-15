import { useEffect, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { FunctionComponent } from 'preact';

import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { TextArea } from '@/components/common/text.area/text.area';

import { StatusButton } from '@/pages/settings/components/custom.button';

import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices/access/user.slice';

import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';

import { StageService } from '@/services/pqrs/stage';
import { IStages, TypesOfStages } from '../utils/interface';
import { listModulesUrls, IResourceStage } from '../utils/resoruce.interface';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';
import { AreaService } from '@/services/general/area';

export const StageForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();

  const [initialValues, setInitialValues] = useState<any>();
  const loading = useSignal<boolean>(false);
  const stageList = useSignal<IOption[]>([]);
  const areaList = useSignal<IOption[]>([]);
  const resource = useSignal<IResourceStage[]>([]);

  useEffect(() => {
    document.title = 'h_stages';
    fetchInitialValues();
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      loadData();
    }
  }, [selectedCompany, id]);

  const loadData = async () => {
    await getSimpleStageList();
    await getSimpleAreaList();
    await fetchInitialValues();
  };

  const getSimpleStageList = async () => {
    const response = await StageService.getSimpleList();
    if (!response.getStatus()) return;
    stageList.value = response.getMany();
  };

  const getSimpleAreaList = async () => {
    const response = await AreaService.get_simple_List();
    if (!response.getStatus()) return;
    areaList.value = response.getMany();
  };

  const fetchInitialValues = async () => {
    loading.value = true;
    if (!id) {
      resource.value = [];
      setInitialValues({
        stageName: '',
        goal: '',
        executionNotes: '',
        outputFormat: '',
        resultText: '',
        prompt: '',
        resources: [],
        nextStageId: null,
        prevStageId: null,
        errorStageId: null,
        status: 'active',
        visibility: true,
      });
      return (loading.value = false);
    }

    const response = await StageService.get_by_id(id);
    if (!response.getStatus()) return (loading.value = false);
    const initialData = response.getOne();

    resource.value = initialData.resource || [];

    const findStageOption = (stageId: number | null) => {
      if (!stageId || !stageList.value.length) return null;
      return stageList.value.find((stage) => stage.value === stageId) || null;
    };

    const promptValue = initialData.prompt
      ? typeof initialData.prompt === 'object'
        ? JSON.stringify(initialData.prompt, null, 2)
        : initialData.prompt
      : '';

    const resourcesForForm = (initialData.resource || []).map(
      (res: IResourceStage) => {
        if (res.type === 'internal' && res.internal) {
          return {
            type: { value: 'internal', label: 'Internal' },
            internal: {
              module: { value: res.internal.module, label: res.internal.module }
            }
          };
        }
        // Fallback for external or legacy
        const ext = res.external || (res as any);
        return {
          type: { value: 'external', label: 'External' },
          external: {
            method: ext.method ? { value: ext.method, label: ext.method } : null,
            requestUrl: ext.requestUrl || '',
          }
        };
      }
    );

    setInitialValues({
      stageName: initialData.stageName || '',
      goal: initialData.goal || '',
      executionNotes: initialData.executionNotes || '',
      outputFormat: initialData.outputFormat || '',
      resultText: initialData.resultText || '',
      prompt: promptValue || null,
      resources: resourcesForForm,
      nextStageId: findStageOption(initialData.nextStageId),
      prevStageId: findStageOption(initialData.prevStageId),
      errorStageId: findStageOption(initialData.errorStageId),
      status: initialData.status || 'active',
      visibility: initialData.visibility ?? true,
      hasArea: initialData.areaId ? true : false,
      type: initialData.type
        ? {
          value: initialData.type,
          label:
            initialData.type === TypesOfStages.CONTINUE
              ? t('h_automatic')
              : t('h_manual'),
        }
        : null,
      areaId: initialData.areaId
        ? areaList.value.find((area) => area.value === initialData.areaId) ||
        null
        : null,
    });
    loading.value = false;
  };

  const handleSubmit = async (model: any) => {
    loading.value = true;
    let promptValue = model.prompt;
    if (typeof model.prompt === 'string' && model.prompt.trim())
      promptValue = JSON.parse(model.prompt);

    const resources = (model.resources || [])
      .map((res: any) => {
        const type = res.type?.value || 'external';

        if (type === 'internal') {
          const selectedModule = res.internal?.module?.value;
          if (!selectedModule) return null;

          const moduleConfig = listModulesUrls.find(m => m.module === selectedModule);
          if (!moduleConfig) return null;

          return {
            type: 'internal',
            internal: {
              module: selectedModule,
              service: moduleConfig.service,
              endpoint: moduleConfig.endpoint
            }
          };
        } else {
          // External
          if (!res.external?.method || !res.external?.requestUrl) return null;
          return {
            type: 'external',
            external: {
              method: res.external.method?.value || res.external.method,
              requestUrl: res.external.requestUrl
            }
          };
        }
      })
      .filter(Boolean);

    let stage: IStages = {
      stageName: model.stageName,
      status: model.status?.replace(/\s+/g, '_') || model.status,
      goal: model.goal,
      executionNotes: model.executionNotes,
      prompt: promptValue,
      resource: resources,
      nextStageId: model.hasArea ? null : model.nextStageId?.value || null,
      prevStageId: model.hasArea ? null : model.prevStageId?.value || null,
      // errorStageId: model.hasArea ? null : model.errorStageId?.value || null,
      errorStageId: null,
      areaId: model.hasArea ? model.areaId?.value || null : null,
      visibility: model.visibility ?? true,
      type: model.type?.value || null,
    };

    let response = id
      ? await StageService.update(id, stage)
      : await StageService.create(stage);

    if (!response.getStatus()) {
      loading.value = false;
      return;
    }

    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    setInitialValues({} as IStages);

    go({
      to: '/pqrs/stages',
      label: 'Stages',
      id: 'pqrs:stages:state',
      base: 'setting',
    });
    loading.value = false;
  };

  return (
    <Section
      className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design dark:bg-b-dark dark:text-t-dark'
      loading={loading.value}
    >
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
            id='form-stages-upsert'
          >
            <StatusButton
              onClickClean={() => form.reset()}
              submitting={submitting || loading.value}
              pristine={pristine}
              form='form-stages-upsert'
              label={id ? 'edit' : 'save'}
            />
            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-2'>
                <Field<string> name='stageName'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder={t('h_stage_name')}
                      label={t('h_stage_name')}
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
                <Field<string> name='status'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder={t('h_status')}
                      label={t('h_status')}
                      meta={meta}
                      icon='120'
                      type='text'
                      disabled={loading.value}
                      required
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<boolean> name='visibility' type='checkbox'>
                  {({ input }) => (
                    <Switch
                      id='visibility-switch'
                      name={input.name}
                      label='h_visibility'
                      value={input.checked}
                      onChange={input.onChange}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<string> name='goal'>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      icon='120'
                      type='text'
                      placeholder={t('h_goal')}
                      label={t('h_goal')}
                      meta={meta}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<string> name='executionNotes'>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      icon='120'
                      type='text'
                      placeholder={t('h_execution_notes')}
                      label={t('h_execution_notes')}
                      meta={meta}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<string> name='prompt'>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      icon='120'
                      type='text'
                      placeholder={t('h_prompt')}
                      label={t('h_prompt')}
                      meta={meta}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field name='type'>
                  {({ input, meta }) => (
                    <SmartSelector
                      {...input}
                      meta={meta}
                      id={`select-stage-type`}
                      icon='191'
                      label='h_type'
                      options={[
                        {
                          value: TypesOfStages.CONTINUE,
                          label: t('h_automatic'),
                        },
                        {
                          value: TypesOfStages.MANUAL,
                          label: t('h_manual'),
                        },
                      ]}
                      menuPortalTarget={document.body}
                      placeholder='p_select'
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-3'>
                <Field<boolean>
                  name='hasArea'
                  type='checkbox'
                  initialValue={false}
                >
                  {({ input }) => (
                    <Switch
                      id='has-area-switch'
                      name={input.name}
                      label='¿Anexar área al stage?'
                      value={input.checked}
                      onChange={input.onChange}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              {form.getState().values.hasArea ? (
                <div className='col-span-3'>
                  <Field<IOption> name='areaId'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        meta={meta}
                        id='select-areaId'
                        icon='191'
                        label='h_area'
                        options={areaList.value || []}
                        menuPortalTarget={document.body}
                        placeholder='p_select'
                      />
                    )}
                  </Field>
                </div>
              ) : (
                stageList.value &&
                stageList.value.length > 0 && (
                  <>
                    <div className='col-span-1'>
                      <Field<IOption> name='nextStageId'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='select-next-stageId'
                            icon='191'
                            label='h_next_stage'
                            options={stageList.value || []}
                            menuPortalTarget={document.body}
                            placeholder='p_select'
                          />
                        )}
                      </Field>
                    </div>

                    <div className='col-span-1'>
                      <Field<IOption> name='prevStageId'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='select-prev-stageId'
                            icon='191'
                            label='h_prev_stage'
                            options={stageList.value || []}
                            menuPortalTarget={document.body}
                            placeholder='p_select'
                          />
                        )}
                      </Field>
                    </div>

                    {/* <div className='col-span-1'>
                      <Field<IOption> name='errorStageId'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='select-error-stageId'
                            icon='191'
                            label='h_error_stage'
                            options={stageList.value || []}
                            menuPortalTarget={document.body}
                            placeholder='p_select'
                          />
                        )}
                      </Field>
                    </div> */}
                  </>
                )
              )}

              <div className='col-span-3 border-t border-gray-border dark:border-b-dark-dark pt-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-medium text-t-light dark:text-t-dark'>{t('h_resource')}</h3>
                  <Button
                    name='add-resource-button'
                    type='button'
                    onClick={() =>
                      form.mutators.push('resources', {
                        type: { value: 'external', label: 'External' },
                        external: { method: null, requestUrl: '' }
                      })
                    }
                    disabled={loading.value}
                    className='px-3 py-1 text-xs bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary'
                    label='add'
                  />
                </div>

                <FieldArray name='resources'>
                  {({ fields }) =>
                    fields.length === 0 ? (
                      <p className='text-sm text-gray-text-light dark:text-t-dark italic text-center py-4'>
                        {t('pqrs.no_resources_added')}
                      </p>
                    ) : (
                      <div className='space-y-4'>
                        {fields.map((name, index) => {
                          const resourceValues = fields.value ? fields.value[index] : {};
                          const isInternal = resourceValues.type?.value === 'internal';

                          return (
                            <div
                              key={name}
                              className='border border-gray-border dark:border-b-dark-dark rounded-lg p-4 bg-b-light dark:bg-b-dark-light text-t-light dark:text-t-dark'
                            >
                              <div className='grid grid-cols-4 gap-4'>
                                {/* Type Selector */}
                                <div className='col-span-4 md:col-span-1'>
                                  <Field name={`${name}.type`}>
                                    {({ input, meta }) => (
                                      <SmartSelector
                                        {...input}
                                        meta={meta}
                                        id={`select-resource-type-${index}`}
                                        icon='191'
                                        label='Type'
                                        options={[
                                          { value: 'internal', label: 'Internal' },
                                          { value: 'external', label: 'External' },
                                        ]}
                                        menuPortalTarget={document.body}
                                        placeholder='p_select'
                                      />
                                    )}
                                  </Field>
                                </div>

                                {isInternal ? (
                                  <div className='col-span-3'>
                                    <Field name={`${name}.internal.module`}>
                                      {({ input, meta }) => (
                                        <SmartSelector
                                          {...input}
                                          meta={meta}
                                          id={`select-resource-module-${index}`}
                                          icon='191'
                                          label='Module'
                                          options={listModulesUrls.map(m => ({
                                            value: m.module,
                                            label: m.module
                                          }))}
                                          menuPortalTarget={document.body}
                                          placeholder='Select Module'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                ) : (
                                  <>
                                    <div className='col-span-1'>
                                      <Field name={`${name}.external.method`}>
                                        {({ input, meta }) => (
                                          <SmartSelector
                                            {...input}
                                            meta={meta}
                                            id={`select-resource-method-${index}`}
                                            icon='191'
                                            label='h_method'
                                            options={[
                                              { value: 'GET', label: 'GET' },
                                              { value: 'POST', label: 'POST' },
                                            ]}
                                            menuPortalTarget={document.body}
                                            placeholder='p_select'
                                          />
                                        )}
                                      </Field>
                                    </div>

                                    <div className='col-span-2'>
                                      <Field<string> name={`${name}.external.requestUrl`}>
                                        {({ input, meta }) => (
                                          <Input
                                            {...input}
                                            icon='120'
                                            type='text'
                                            placeholder={t('h_request_url')}
                                            label={t('h_request_url')}
                                            meta={meta}
                                            disabled={loading.value}
                                          />
                                        )}
                                      </Field>
                                    </div>
                                  </>
                                )}

                                <div className='col-span-4 flex justify-end'>
                                  <Button
                                    name='remove-resource-button'
                                    type='button'
                                    onClick={() => fields.remove(index)}
                                    disabled={loading.value}
                                    label='remove'
                                    icon='312'
                                    className='mt-2'
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  }
                </FieldArray>
              </div>
            </div>
          </form>
        )}
      />
    </Section>
  );
};
