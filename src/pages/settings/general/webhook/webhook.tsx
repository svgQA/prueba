import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { Table } from '@/components/common/table/table';
import { columns } from './webhook.columns';
import { WebhookService } from '@/services';
import { IWebhookResponse } from '@/types/webhook/webhook.response';
import { ToastManager } from '@/utils/toast/toast-manager';
import { Form, Field } from 'react-final-form';
import { ICreateWebhookRequest } from '@/types/webhook/webhook.request';
import { useUserStore } from '@/store/slices';

interface IWebhookForm {
  name: string;
  webhook: string;
  // events: string;
  platform: string;
  token: string;
}

export const WebHookSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const hooks = useSignal<IWebhookResponse[]>([]);
  const loading = useSignal(false);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    document.title = t('p_webhook');
    if (selectedCompany) {
      fetchHooks();
    }
  }, [selectedCompany, location]);

  const fetchHooks = async () => {
    loading.value = true;
    const response = await WebhookService.listAll();
    if (response.getStatus()) {
      hooks.value = response.getMany();
    }
    loading.value = false;
  };

  const onSubmit = async (values: IWebhookForm, form: any) => {
    const data: ICreateWebhookRequest = {
      name: values.name,
      webhook: values.webhook,
      // events: values.events
      //   .split(',')
      //   .map((e) => e.trim())
      //   .filter((e) => e),
      platform: values.platform,
      token: values.token,
    };
    const response = await WebhookService.create(data);
    if (!response.getStatus()) return;
    ToastManager.success('s_created_success');
    form.reset();
    await fetchHooks();
  };

  return (
    <Section className='space-y-4'>
      <Form<IWebhookForm>
        onSubmit={onSubmit}
        initialValues={{
          name: '',
          webhook: '',
          platform: '',
          token: '',
        }}
        validate={(values) => {
          const errors: Partial<IWebhookForm> = {};
          if (!values.name) errors.name = 'required_field';
          if (!values.webhook) errors.webhook = 'required_field';
          return errors;
        }}
        render={({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className='flex flex-col flex-wrap gap-2'
            id='form-create-webhook'
          >
            <div class='flex flex-row gap-2'>
              <Field<string> name='name'>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    type='text'
                    name='hook-name'
                    label='h_name'
                    meta={meta}
                  />
                )}
              </Field>
              <Field<string> name='webhook'>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    type='text'
                    name='hook-url'
                    label='h_url'
                    meta={meta}
                  />
                )}
              </Field>
            </div>
            {/*
            <Field<string> name='events'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  type='text'
                  name='hook-events'
                  label='h_events'
                  meta={meta}
                />
              )}
            </Field>
            */}
            <div className='flex flex-row gap-2'>
              <Field<string> name='platform'>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    type='text'
                    name='hook-platform'
                    label='h_platform'
                    meta={meta}
                  />
                )}
              </Field>
              <Field<string> name='token'>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    type='text'
                    name='hook-token'
                    label='h_token'
                    meta={meta}
                  />
                )}
              </Field>
            </div>
          </form>
        )}
      />
      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            <Button
              name='create-hook'
              label='create'
              icon='212'
              type='submit'
              form='form-create-webhook'
            />
          </div>
        </div>
        <Table
          data={hooks.value}
          columns={columns}
          loading={loading.value}
          className='!max-h-[46.5vh]'
        />
      </div>
    </Section>
  );
};
