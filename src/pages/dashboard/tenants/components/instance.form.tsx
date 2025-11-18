import { type FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/common/input/input';
import { required } from '@/utils/utilities';

interface ICreateInstanceFormProps {
  onSubmit: (values: any) => Promise<void>;
}

export const CreateInstanceForm: FunctionComponent<
  ICreateInstanceFormProps
> = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className='mb-8'>
            <div className='grid grid-cols-2 gap-4'>
              <Field<string> name='name' validate={required}>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    placeholder='p_instance'
                    type='text'
                    label='h_name'
                    meta={meta}
                  />
                )}
              </Field>
              <Field<string> name='url' validate={required}>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    placeholder='postgresql://child1:child1pass@localhost:5434/child1db'
                    type='text'
                    label='URL*'
                    meta={meta}
                  />
                )}
              </Field>
            </div>
            <div className='mt-4 flex justify-end'>
              <button
                type='submit'
                className='px-4 py-2 bg-primary text-white rounded'
              >
                {t('h_create_instance')}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};
