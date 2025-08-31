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

export const WebHookSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const hooks = useSignal<IWebhookResponse[]>([]);
  const loading = useSignal(false);

  useEffect(() => {
    document.title = t('p_webhook');
    fetchHooks();
  }, []);

  const fetchHooks = async () => {
    loading.value = true;
    const response = await WebhookService.listAll();
    if (response.getStatus()) {
      hooks.value = response.getMany();
    }
    loading.value = false;
  };

  interface IWebhookForm {
    name: string;
    url: string;
    events: string;
    platform: string;
    token: string;
  }

  const onSubmit = async (values: IWebhookForm, form: any) => {
    const data: ICreateWebhookRequest = {
      name: values.name,
      url: values.url,
      events: values.events
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e),
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
          url: '',
          events: '',
          platform: '',
          token: '',
        }}
        validate={(values) => {
          const errors: Partial<IWebhookForm> = {};
          if (!values.name) errors.name = 'required_field';
          if (!values.url) errors.url = 'required_field';
          return errors;
        }}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} className='flex flex-wrap gap-2'>
            <Field<string> name='name'>
              {({ input, meta }) => (
                <Input {...input} id='hook-name' label='h_name' meta={meta} />
              )}
            </Field>
            <Field<string> name='url'>
              {({ input, meta }) => (
                <Input {...input} id='hook-url' label='h_url' meta={meta} />
              )}
            </Field>
            <Field<string> name='events'>
              {({ input, meta }) => (
                <Input {...input} id='hook-events' label='h_events' meta={meta} />
              )}
            </Field>
            <Field<string> name='platform'>
              {({ input, meta }) => (
                <Input
                  {...input}
                  id='hook-platform'
                  label='h_platform'
                  meta={meta}
                />
              )}
            </Field>
            <Field<string> name='token'>
              {({ input, meta }) => (
                <Input {...input} id='hook-token' label='h_token' meta={meta} />
              )}
            </Field>
            <Button
              name='create-hook'
              label='create'
              icon='312'
              type='submit'
            />
          </form>
        )}
      />
      <Table
        data={hooks.value}
        columns={columns}
        loading={loading.value}
        unsettings
      />
    </Section>
  );
};
