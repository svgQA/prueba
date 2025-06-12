import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Form } from 'react-final-form';
import { Section } from '@/components/common/section/section';
import { StatusButton } from '@/pages/settings/components/custom.button';

export const GroupCreateSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Security Group Settings';
  }, []);
  const onSubmit = async (model: any) => {
    console.log(model);
  };
  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            VAMOS A HACER LOS GRUPOS CON DATOS QUEMADOS Y ALGUNAS OPTIONS
            <div className='w-full flex-row flex justify-end items-center'>
              <StatusButton
                onClickClean={() => {
                  form.reset();
                }}
                submitting={submitting}
                pristine={pristine}
                form='form-group-create'
              />
            </div>
          </form>
        )}
      />
    </Section>
  );
};
