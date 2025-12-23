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
    // CORREGIDO: Título traducido
    document.title = t('pqrs.stages.title');
    fetchInitialValues();
  }, [t]);

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
              module: {
                value: res.internal.module,
                label: res.internal.module,
              },
            },
          };
        }
        // Fallback for external or legacy
        const ext = res.external || (res as any);
        return {
          type: { value: 'external', label: 'External' },
          external: {
            method: ext.method
              ? { value: ext.method, label: ext.method }
              : null,
            requestUrl: ext.requestUrl || '',
          },
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

          const moduleConfig = listModulesUrls.find(
            (m) => m.module === selectedModule
          );
          if (!moduleConfig) return null;

          return {
            type: 'internal',
            internal: {
              module: selectedModule,
              service: moduleConfig.service,
              endpoint: moduleConfig.endpoint,
            },
          };
        } else {
          // External
          if (!res.external?.method || !res.external?.requestUrl) return null;
          return {
            type: 'external',
            external: {
              method: res.external.method?.value || res.external.method,
              requestUrl: res.external.requestUrl,
            },
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
      className='pr-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design dark:bg-b-dark dark:text-t-dark'
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
            {/* Acciones */}
            <div className='flex justify-end'>
              <StatusButton
                onClickClean={() => form.reset()}
                submitting={submitting || loading.value}
                pristine={pristine}
                form='form-stages-upsert'
                label={id ? 'edit' : 'save'}
              />
            </div>

            <div className='space-y-1'>
              <div className='flex flex-row flex-wrap w-full gap-1 justify-between'>
                {/* 1) Información básica */}
                <section className='flex-1 min-w-[450px] rounded-lg border border-gray-border dark:border-b-dark-dark bg-b-light dark:bg-b-dark-light p-4 relative'>
                  <h3 className='mb-4 text-sm font-medium text-t-light dark:text-t-dark'>
                    {t('pqrs.stages.general')}
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='md:col-span-2'>
                      <Field<string> name='stageName'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            placeholder={t('pqrs.stages.name')}
                            label={t('pqrs.stages.name')}
                            meta={meta}
                            icon='120'
                            type='text'
                            disabled={loading.value}
                            required
                          />
                        )}
                      </Field>
                    </div>

                    <div className='md:col-span-1'>
                      <Field<string> name='status'>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            placeholder={t('pqrs.stages.status')}
                            label={t('pqrs.stages.status')}
                            meta={meta}
                            icon='120'
                            type='text'
                            disabled={loading.value}
                            required
                          />
                        )}
                      </Field>
                    </div>

                    <div className='md:col-span-1'>
                      <Field name='type'>
                        {({ input, meta }) => (
                          <SmartSelector
                            {...input}
                            meta={meta}
                            id='select-stage-type'
                            icon='191'
                            label={t('pqrs.stages.type')}
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

                    <div className='absolute top-0 right-0 bg-teal-900 p-2 rounded-bl-lg flex flex-row items-center justify-center'>
                      <Field<boolean> name='visibility' type='checkbox'>
                        {({ input }) => (
                          <Switch
                            id='visibility-switch'
                            name={input.name}
                            label={t('pqrs.stages.visibility')}
                            value={input.checked}
                            onChange={input.onChange}
                            disabled={loading.value}
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </section>

                {/* 2) Configuración del stage */}
                <section className='flex-1 min-w-[450px] rounded-lg border border-gray-border dark:border-b-dark-dark bg-b-light dark:bg-b-dark-light p-4 relative'>
                  <h3 className='mb-4 text-sm font-medium text-t-light dark:text-t-dark'>
                    {t('pqrs.stages.type')}
                  </h3>

                  <div className='grid grid-cols-1 gap-4'>
                    <div className='absolute top-0 right-0 bg-teal-900 p-2 rounded-bl-lg flex flex-row items-center justify-center'>
                      <Field<boolean>
                        name='hasArea'
                        type='checkbox'
                        initialValue={false}
                      >
                        {({ input }) => (
                          <Switch
                            id='has-area-switch'
                            name={input.name}
                            label={t('pqrs.stages.attach_area')}
                            value={input.checked}
                            onChange={input.onChange}
                            disabled={loading.value}
                          />
                        )}
                      </Field>
                    </div>

                    {form.getState().values.hasArea ? (
                      <div className='md:col-span-1'>
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
                          <div className='md:col-span-1'>
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

                          <div className='md:col-span-1'>
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
                        </>
                      )
                    )}
                  </div>
                </section>
              </div>

              {/* 3) Contenido / textos */}
              <section className='rounded-lg border border-gray-border dark:border-b-dark-dark bg-b-light dark:bg-b-dark-light p-4'>
                <h3 className='mb-4 text-sm font-medium text-t-light dark:text-t-dark'>
                  {t('pqrs.stages.content')}
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='md:col-span-1'>
                    <Field<string> name='goal'>
                      {({ input, meta }) => (
                        <TextArea
                          {...input}
                          type='text'
                          rows={3}
                          placeholder={t('pqrs.stages.goal')}
                          label={t('pqrs.stages.goal')}
                          meta={meta}
                          disabled={loading.value}
                          className='bg-white dark:bg-b-dark text-t-light dark:text-white resize-none'
                        />
                      )}
                    </Field>
                  </div>
                  <div className='md:col-span-1'>
                    <Field<string> name='executionNotes'>
                      {({ input, meta }) => (
                        <TextArea
                          {...input}
                          type='text'
                          rows={3}
                          placeholder={t('pqrs.stages.execution_notes')}
                          label={t('pqrs.stages.execution_notes')}
                          meta={meta}
                          disabled={loading.value}
                          className='bg-white dark:bg-b-dark text-t-light dark:text-white resize-none'
                        />
                      )}
                    </Field>
                  </div>
                  <div className='md:col-span-2'>
                    <Field<string> name='prompt'>
                      {({ input, meta }) => (
                        <TextArea
                          {...input}
                          type='text'
                          rows={5}
                          placeholder={t('pqrs.stages.prompt')}
                          label={t('pqrs.stages.prompt')}
                          meta={meta}
                          disabled={loading.value}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </section>

              {/* 4) Resources */}
              <section className='rounded-lg border border-gray-border dark:border-b-dark-dark bg-b-light dark:bg-b-dark-light p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-medium text-t-light dark:text-t-dark'>
                    {t('pqrs.stages.resources')}
                  </h3>

                  <Button
                    name='add-resource-button'
                    type='button'
                    icon='039'
                    onClick={() =>
                      form.mutators.push('resources', {
                        type: { value: 'external', label: 'External' },
                        external: { method: null, requestUrl: '' },
                      })
                    }
                    disabled={loading.value}
                    className='px-3 py-1 text-xs bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary'
                    label={t('general.add')}
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
                          const resourceValues = fields.value
                            ? fields.value[index]
                            : {};
                          const isInternal =
                            resourceValues.type?.value === 'internal';

                          return (
                            <div
                              key={name}
                              className='rounded-lg p-2 bg-white/40 dark:bg-black/10 text-t-light dark:text-t-dark'
                            >
                              <div className='flex flex-row w-full items-end justify-between py-1 gap-x-2'>
                                {/* Type */}
                                <Field name={`${name}.type`}>
                                  {({ input, meta }) => (
                                    <SmartSelector
                                      {...input}
                                      meta={meta}
                                      id={`select-resource-type-${index}`}
                                      icon='041'
                                      label={t('pqrs.stages.type')}
                                      options={[
                                        {
                                          value: 'internal',
                                          label: 'Internal',
                                        },
                                        {
                                          value: 'external',
                                          label: 'External',
                                        },
                                      ]}
                                      menuPortalTarget={document.body}
                                      placeholder='p_select'
                                    />
                                  )}
                                </Field>

                                {isInternal ? (
                                  <div className='md:col-span-2'>
                                    <Field name={`${name}.internal.module`}>
                                      {({ input, meta }) => (
                                        <SmartSelector
                                          {...input}
                                          meta={meta}
                                          id={`select-resource-module-${index}`}
                                          icon='191'
                                          label='Module'
                                          options={listModulesUrls.map((m) => ({
                                            value: m.module,
                                            label: m.module,
                                          }))}
                                          menuPortalTarget={document.body}
                                          placeholder='Select Module'
                                        />
                                      )}
                                    </Field>
                                  </div>
                                ) : (
                                  <>
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

                                    <Field<string>
                                      name={`${name}.external.requestUrl`}
                                    >
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
                                  </>
                                )}
                                <div className='pb-2'>
                                  <Button
                                    name='remove-resource-button'
                                    type='button'
                                    onClick={() => fields.remove(index)}
                                    disabled={loading.value}
                                    icon='181'
                                    square
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
              </section>
            </div>
          </form>
        )}
      />
    </Section>
  );
};