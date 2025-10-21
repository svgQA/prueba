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
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';

import { StageService } from '@/services/pqrs/stage';
import { IStages } from '../utils/interface';
import { IOption } from '@/components/common/multi/interface';
import { SmartSelector } from '@/components/common/smart-selector/smart-select';

export const StageForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const { id } = useParams<{ id?: string }>();

  const [initialValues, setInitialValues] = useState<any>();
  const loading = useSignal<boolean>(false);
  const stageList = useSignal<IOption[]>([]);

  useEffect(() => {
    document.title = 'h_stages';
    fetchInitialValues();
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      fetchInitialValues();
      getSimpleStageList();
    }
  }, [selectedCompany, id]);

  const getSimpleStageList = async () => {
    const response = await StageService.getSimpleList();
    if (!response.getStatus()) return;
    stageList.value = response.getMany();
  }

  const fetchInitialValues = async () => {
    if (!id) {
      setInitialValues({
        stageName: '',
        goal: '',
        executionNotes: '',
        outputFormat: '',
        resultText: '',
        prompt: null,
        nextStageId: null,
        prevStageId: null,
        errorStageId: null,
        status: 'active',
      });
      return;
    }

    const response = await StageService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      stageName: initialData.stageName || '',
      goal: initialData.goal || '',
      executionNotes: initialData.executionNotes || '',
      outputFormat: initialData.outputFormat || '',
      resultText: initialData.resultText || '',
      prompt: initialData.prompt || null,
      nextStageId: initialData.nextStageId || null,
      prevStageId: initialData.prevStageId || null,
      errorStageId: initialData.errorStageId || null,
      status: initialData.status || 'active',
    });
  };

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;
    let stage: IStages = {
      stageName: model.stageName,
      goal: model.goal,
      executionNotes: model.executionNotes,
      outputFormat: model.outputFormat,
      resultText: model.resultText,
      prompt: model.prompt,
      nextStageId: model.nextStageId.value,
      prevStageId: model.prevStageId.value,
      errorStageId: model.errorStageId.value,
      status: model.status,
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
    <Section className='p-4 space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
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
            <div className='grid grid-cols-2 gap-4'>
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

              <div className='col-span-2'>
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

              <div className='col-span-2'>
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

              <div className='col-span-2'>
                <Field<string> name='outputFormat'>
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      placeholder={t('h_output_format')}
                      label={t('h_output_format')}
                      meta={meta}
                      icon='120'
                      type='text'
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-2'>
                <Field<string> name='resultText'>
                  {({ input, meta }) => (
                    <TextArea
                      {...input}
                      icon='120'
                      type='text'
                      placeholder={t('h_result_text')}
                      label={t('h_result_text')}
                      meta={meta}
                      disabled={loading.value}
                    />
                  )}
                </Field>
              </div>

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

              <div className='col-span-2'>
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

              <div className='col-span-2'>
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
            </div>
          </form>
        )}
      />
    </Section>
  );
};
