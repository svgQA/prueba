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
import { IResourceStage, IStages } from '../utils/interface';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';
import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';

export const StageForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();

  const [initialValues, setInitialValues] = useState<any>();
  const loading = useSignal<boolean>(false);
  const stageList = useSignal<IOption[]>([]);
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
    await fetchInitialValues();
  };

  const getSimpleStageList = async () => {
    const response = await StageService.getSimpleList();
    if (!response.getStatus()) return;
    stageList.value = response.getMany();
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
      return stageList.value.find(stage => stage.value === stageId) || null;
    };

    const promptValue = initialData.prompt 
      ? (typeof initialData.prompt === 'object' 
          ? JSON.stringify(initialData.prompt, null, 2) 
          : initialData.prompt)
      : '';

    const resourcesForForm = (initialData.resource || []).map((res: IResourceStage) => ({
      method: res.method ? { value: res.method, label: res.method } : null,
      requestUrl: res.requestUrl || '',
    }));

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
    });
    loading.value = false;
  };

  const handleSubmit = async (model: any) => {
    loading.value = true;
    let promptValue = model.prompt;
    if (typeof model.prompt === 'string' && model.prompt.trim()) promptValue = JSON.parse(model.prompt);

    const resources = (model.resources || [])
      .filter((res: any) => res.method && res.requestUrl) 
      .map((res: any) => ({
        method: res.method?.value || res.method,
        requestUrl: res.requestUrl,
      }));

    let stage: IStages = {
      stageName: model.stageName,
      status: model.status?.replace(/\s+/g, '_') || model.status,
      goal: model.goal,
      executionNotes: model.executionNotes,
      prompt: promptValue,
      resource: resources,
      nextStageId: model.nextStageId?.value || null,
      prevStageId: model.prevStageId?.value || null,
      errorStageId: model.errorStageId?.value || null,
      visibility: model.visibility ?? true,
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
      className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'
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

              {stageList.value && stageList.value.length > 0 && (
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

                  <div className='col-span-1'>
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
                  </div>
                </>
              )}

              <div className='col-span-3 border-t pt-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-medium'>{t('h_resource')}</h3>
                  <Button
                    name='add-resource-button'
                    type='button'
                    onClick={() => form.mutators.push('resources', { method: null, requestUrl: '' })}
                    disabled={loading.value}
                    className='px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    label='add'
                  />
                </div>

                <FieldArray name='resources'>
                  {({ fields }) =>
                    fields.length === 0 ? (
                      <p className='text-sm text-gray-500 italic text-center py-4'>
                        {t('pqrs.no_resources_added')}
                      </p>
                    ) : (
                      <div className='space-y-4'>
                        {fields.map((name, index) => (
                          <div key={name} className='border rounded-lg p-4 bg-gray-50'>
                            <div className='grid grid-cols-4 gap-4'>
                              <div className='col-span-1'>
                                <Field name={`${name}.method`}>
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

                              <div className='col-span-3'>
                                <div className='flex gap-2'>
                                  <div className='flex-1'>
                                    <Field<string> name={`${name}.requestUrl`}>
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
                                  <div className='mt-6'>
                                    <Button
                                      name='remove-resource-button'
                                      type='button'
                                      onClick={() => fields.remove(index)}
                                      disabled={loading.value}
                                      label='remove'
                                      icon='312'
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </FieldArray>
              </div>
            </div>
          </form>
        )
        }
      />
    </Section >
  );
};
